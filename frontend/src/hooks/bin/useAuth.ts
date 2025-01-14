import { useState } from 'react';
import { USER_CHECK_URL, USER_PASSWORD_URL } from "../../constants/URL.tsx";

export const _useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userNotFoundError, setUserNotFoundError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Check if user exists in the system
  const checkUserExists = async (id: string): Promise<boolean> => {
    if (id === '') {
      setUserNotFoundError('User ID cannot be empty');
      return false;
    }

    try {
      setIsLoading(true);
      const BODY_TO_SEND = JSON.stringify({ username: id });
      const response = await fetch(USER_CHECK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: BODY_TO_SEND,
      });

      if (response.ok) {
        setUserNotFoundError('');
        return true;
      } else {
        setUserNotFoundError('User not found');
        return false;
      }
    } catch (error) {
      console.error("Error checking user existence:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Check if password is correct
  const checkPassword = async (id: string, password: string): Promise<{success: boolean, userId?: string}> => {
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

  // Reset errors
  const resetErrors = () => {
    setUserNotFoundError('');
    setPasswordError('');
  };

  return {
    isLoading,
    userNotFoundError,
    passwordError,
    checkUserExists,
    checkPassword,
    resetErrors,
    setUserNotFoundError,
    setPasswordError,
    setIsLoading
  };
};