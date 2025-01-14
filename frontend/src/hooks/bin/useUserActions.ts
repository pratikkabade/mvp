import { useState } from "react";
import { USER_CHECK_URL, CREATE_USER_URL } from "../../constants/URL";

export const _useUserAction = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [userNameError, setUserNameError] = useState<string>("");
    const [passwordError, setPasswordError] = useState<boolean>(false);

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

    const createUser = async (id: string, password_1: string, password_2: string, setStep: (step: number) => void) => {
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

    return { isLoading, userNameError, passwordError, checkUserNameError, createUser, setUserNameError, setPasswordError };
};
