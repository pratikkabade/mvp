import { useState, useEffect } from "react";
import { ADMIN_USER_DATA_URL, ADMIN_USER_UPDATE_URL, DELETE_USER_URL } from "../../constants/URL";
import { checkPrivilege, checkPrivilegeParams } from "../../utility/checkPrivilege";
import { ANIMATION_TIME_DELAY } from "../../constants/Constants";

interface UpdateUserApiResponse {
    message: string;
    error: string;
}

interface UserData {
    [key: string]: string[];
}

interface UseAdminDataReturn {
    data: UserData | null;
    list: string[];
    loading: boolean;
    isAdmin: boolean;
    access: boolean;
    error: string | null;
    updatingError: string | null;
    user: string | null;
    userID: string | null;
    saveStatus: Record<string, string>;
    refreshUserData: () => Promise<void>;
    updateData: (user_to_change: string, userData: string[]) => Promise<void>;
    handleDeleteUser: (user_to_delete: string) => Promise<boolean>;
    setData: React.Dispatch<React.SetStateAction<UserData | null>>;
}

export const _useAdminData = (): UseAdminDataReturn => {
    const [data, setData] = useState<UserData | null>(null);
    const [list, setList] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isAdmin, setIsAdmin] = useState<boolean>(true);
    const [access, setAccess] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [updatingError, setUpdatingError] = useState<string | null>(null);
    const [user, setUser] = useState<string | null>(null);
    const [userID, setUserID] = useState<string | null>(null);
    const [saveStatus, setSaveStatus] = useState<Record<string, string>>({});

    // Load user from localStorage
    useEffect(() => {
        const _user = localStorage.getItem("remembered_logged_id");
        const _user_id = localStorage.getItem("user_id");
        if (_user && _user.trim() !== "") {
            setUser(_user);
            setUserID(_user_id);
        } else {
            setError("No user found. Please log in.");
        }
    }, []);

    // Check admin privileges
    useEffect(() => {
        if (!user || !userID) return;

        const checkPrivileges = async () => {
            try {
                setLoading(true);
                const hasAdminPrivilege = await checkPrivilege({ 
                    user, 
                    userID, 
                    PRIVILEGE_REQUIRED: "admin" 
                } as checkPrivilegeParams);
                
                setIsAdmin(hasAdminPrivilege);
                setAccess(hasAdminPrivilege);
            } catch (error) {
                setError("Failed to check privileges.");
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, ANIMATION_TIME_DELAY);
            }
        };

        checkPrivileges();
    }, [user, userID]);

    // Fetch user data
    const refreshUserData = async () => {
        if (!userID) return;

        try {
            setLoading(true);
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
            if ('message' in result) {
                console.error('User has no access');
            } else {
                setAccess(true);
                setData(result);
            }
        } catch (error: any) {
            const errorMessage =
                error instanceof Error ? error.message : "An unknown error occurred";
            setError(errorMessage);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, ANIMATION_TIME_DELAY);
        }
    };

    // Process data to create list of unique privileges
    useEffect(() => {
        if (!data) return;

        const newList: string[] = [];
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                if (Array.isArray(data[key])) {
                    newList.push(...data[key]);
                }
            }
        }

        // Create a unique list using Set and convert back to array
        const uniqueList = Array.from(new Set(newList));
        setList(uniqueList);
    }, [data]);

    // Update user data
    const updateData = async (user_to_change: string, userData: string[]) => {
        try {
            setSaveStatus((prev) => ({ ...prev, [user_to_change]: "saving" }));
            setUpdatingError(null);
            const BODY_TO_SEND = JSON.stringify({
                user_id: userID,
                user_to_change,
                new_privileges: { privileges: userData }
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

            if ('message' in result) {
                setSaveStatus((prev) => ({ ...prev, [user_to_change]: "saved" }));
                setError(null);
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
            setError(errorMessage);
            return false;
        }
    };

    // Fetch data when user, userID, isAdmin changes
    useEffect(() => {
        if (user && userID && isAdmin) {
            refreshUserData();
        }
    }, [user, userID, isAdmin]);

    return {
        data,
        list,
        loading,
        isAdmin,
        access,
        error,
        updatingError,
        user,
        userID,
        saveStatus,
        refreshUserData,
        updateData,
        handleDeleteUser,
        setData,
    };
};