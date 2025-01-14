import { useState, useEffect } from "react";
import {
  ADMIN_USER_DATA_URL,
  ADMIN_USER_UPDATE_URL,
  DELETE_USER_URL,
  USER_CHECK_URL,
  USER_PASSWORD_URL,
  CREATE_USER_URL
} from "../constants/URL";
import { checkPrivilege, checkPrivilegeParams } from "../utility/checkPrivilege";
import { ANIMATION_TIME_DELAY } from "../constants/Constants";

// All combined interfaces
interface UpdateUserApiResponse {
  message: string;
  error: string;
}

interface UserData {
  [key: string]: string[];
}

interface UseUserManagerReturn {
  // Admin data properties
  adminData: UserData | null;
  list: string[];
  isAdmin: boolean;
  access: boolean;
  adminError: string | null;
  updatingError: string | null;
  user: string | null;
  userID: string | null;
  saveStatus: Record<string, string>;
  
  // Auth properties
  userNotFoundError: string;
  passwordError: string | boolean;
  
  // Common properties
  isLoading: boolean;
  userNameError: string;
  
  // Admin data methods
  refreshUserData: () => Promise<void>;
  updateData: (user_to_change: string, userData: string[]) => Promise<void>;
  handleDeleteUser: (user_to_delete: string) => Promise<boolean>;
  setAdminData: React.Dispatch<React.SetStateAction<UserData | null>>;
  
  // Auth methods
  checkUserExists: (id: string) => Promise<boolean>;
  checkPassword: (id: string, password: string) => Promise<{ success: boolean; userId?: string }>;
  resetErrors: () => void;
  
  // User actions methods
  checkUserNameError: (id: string, setStep: (step: number) => void) => Promise<void>;
  createUser: (id: string, password_1: string, password_2: string, setStep: (step: number) => void) => Promise<void>;
  setUserNameError: React.Dispatch<React.SetStateAction<string>>;
}

export const useUserManager = (): UseUserManagerReturn => {
  // Common states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Admin data states
  const [adminData, setAdminData] = useState<UserData | null>(null);
  const [list, setList] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(true);
  const [access, setAccess] = useState<boolean>(false);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [updatingError, setUpdatingError] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<Record<string, string>>({});
  
  // Auth states
  const [userNotFoundError, setUserNotFoundError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string | boolean>('');
  
  // User action states
  const [userNameError, setUserNameError] = useState<string>('');

  // Load user from localStorage
  useEffect(() => {
    const _user = localStorage.getItem("remembered_logged_id");
    const _user_id = localStorage.getItem("user_id");
    if (_user && _user.trim() !== "") {
      setUser(_user);
      setUserID(_user_id);
    } else {
      setAdminError("No user found. Please log in.");
    }
  }, []);

  // Check admin privileges
  useEffect(() => {
    if (!user || !userID) return;

    const checkPrivileges = async () => {
      try {
        setIsLoading(true);
        const hasAdminPrivilege = await checkPrivilege({
          user,
          userID,
          PRIVILEGE_REQUIRED: "admin",
        } as checkPrivilegeParams);

        setIsAdmin(hasAdminPrivilege);
        setAccess(hasAdminPrivilege);
      } catch (error) {
        setAdminError("Failed to check privileges.");
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, ANIMATION_TIME_DELAY);
      }
    };

    checkPrivileges();
  }, [user, userID]);

  // Fetch user data for admin
  const refreshUserData = async () => {
    if (!userID) return;

    try {
      setIsLoading(true);
      const BODY_TO_SEND = JSON.stringify({ user_id: userID });
      const response = await fetch(ADMIN_USER_DATA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: BODY_TO_SEND,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      if ("message" in result) {
        console.error("User has no access");
      } else {
        setAccess(true);
        setAdminData(result);
      }
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setAdminError(errorMessage);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, ANIMATION_TIME_DELAY);
    }
  };

  // Process data to create list of unique privileges
  useEffect(() => {
    if (!adminData) return;

    const newList: string[] = [];
    for (const key in adminData) {
      if (adminData.hasOwnProperty(key)) {
        if (Array.isArray(adminData[key])) {
          newList.push(...adminData[key]);
        }
      }
    }

    // Create a unique list using Set and convert back to array
    const uniqueList = Array.from(new Set(newList));
    setList(uniqueList);
  }, [adminData]);

  // Update user data
  const updateData = async (user_to_change: string, userData: string[]) => {
    try {
      setSaveStatus((prev) => ({ ...prev, [user_to_change]: "saving" }));
      setUpdatingError(null);
      const BODY_TO_SEND = JSON.stringify({
        user_id: userID,
        user_to_change,
        new_privileges: { privileges: userData },
      });

      const response = await fetch(ADMIN_USER_UPDATE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: BODY_TO_SEND,
      });
      const result: UpdateUserApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update user");
      }

      if ("message" in result) {
        setSaveStatus((prev) => ({ ...prev, [user_to_change]: "saved" }));
        setAdminError(null);
        setTimeout(() => {
          setSaveStatus((prev) => ({ ...prev, [user_to_change]: "" }));
        }, ANIMATION_TIME_DELAY);
      } else {
        setSaveStatus((prev) => ({ ...prev, [user_to_change]: "error" }));
        setUpdatingError("Failed to update user privileges");
      }
    } catch (error: any) {
      setSaveStatus((prev) => ({ ...prev, [user_to_change]: "error" }));
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setUpdatingError(errorMessage);
    }
  };

  // Delete user
  const handleDeleteUser = async (user_to_delete: string): Promise<boolean> => {
    try {
      const BODY_TO_SEND = JSON.stringify({ user_id: userID, user_to_delete });
      const response = await fetch(DELETE_USER_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: BODY_TO_SEND,
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      // Trigger a refresh after successful deletion
      setTimeout(() => {
        refreshUserData();
      }, 500);

      return true;
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setAdminError(errorMessage);
      return false;
    }
  };

  // Fetch data when user, userID, isAdmin changes
  useEffect(() => {
    if (user && userID && isAdmin) {
      refreshUserData();
    }
  }, [user, userID, isAdmin]);

  // Auth methods
  const checkUserExists = async (id: string): Promise<boolean> => {
    if (id === "") {
      setUserNotFoundError("User ID cannot be empty");
      return false;
    }

    try {
      setIsLoading(true);
      const BODY_TO_SEND = JSON.stringify({ username: id });
      const response = await fetch(USER_CHECK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: BODY_TO_SEND,
      });

      if (response.ok) {
        setUserNotFoundError("");
        return true;
      } else {
        setUserNotFoundError("User not found");
        return false;
      }
    } catch (error) {
      console.error("Error checking user existence:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const checkPassword = async (
    id: string,
    password: string
  ): Promise<{ success: boolean; userId?: string }> => {
    try {
      setIsLoading(true);
      const BODY_TO_SEND = JSON.stringify({ username: id, password: password });
      const response = await fetch(USER_PASSWORD_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: BODY_TO_SEND,
      });

      const data = await response.json();

      if (response.ok) {
        const userId = data?.user?.user_id;
        return { success: true, userId };
      } else {
        setPasswordError(response.status.toString());
        return { success: false };
      }
    } catch (error) {
      console.error("Error checking password:", error);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  // User creation methods
  const checkUserNameError = async (id: string, setStep: (step: number) => void) => {
    if (!id) {
      setUserNameError("User ID cannot be empty");
      setTimeout(() => document.getElementById("user_id")?.focus(), 100);
      return;
    }
    if (id.length < 3) {
      setUserNameError("User ID must be at least 3 characters");
      setTimeout(() => document.getElementById("user_id")?.focus(), 100);
      return;
    }
    if (id.length > 10) {
      setUserNameError("User ID must be at most 10 characters");
      setTimeout(() => document.getElementById("user_id")?.focus(), 100);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(USER_CHECK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: id }),
      });

      if (response.status === 200 || response.status === 400) {
        setUserNameError("Username already exists");
        setTimeout(() => document.getElementById("user_id")?.focus(), 100);
      } else {
        setStep(2);
        setUserNameError("");
        setTimeout(() => document.getElementById("password_1")?.focus(), 100);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async (
    id: string, 
    password_1: string, 
    password_2: string, 
    setStep: (step: number) => void
  ) => {
    setIsLoading(true);
    if (password_1 !== password_2) {
      setPasswordError(true);
      setTimeout(() => document.getElementById("password_2")?.focus(), 100);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(CREATE_USER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: id, password: password_1 }),
      });

      if (response.status === 201) {
        setStep(4);
      } else {
        setPasswordError(true);
        console.error(await response.text());
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Reset errors
  const resetErrors = () => {
    setUserNotFoundError("");
    setPasswordError("");
    setUserNameError("");
    setAdminError(null);
    setUpdatingError(null);
  };
  

  return {
    // Admin data properties
    adminData,
    list,
    isAdmin,
    access,
    adminError,
    updatingError,
    user,
    userID,
    saveStatus,  
    
    // Auth properties
    userNotFoundError,
    passwordError,
    
    // Common properties
    isLoading,
    userNameError,
    
    // Admin data methods
    refreshUserData,
    updateData,
    handleDeleteUser,
    setAdminData,
    
    // Auth methods
    checkUserExists,
    checkPassword,
    resetErrors,
    
    // User actions methods
    setUserNameError,
    checkUserNameError,
    createUser
  };
};