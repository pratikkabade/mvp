import { PRIVILEGE_CHECK_URL } from "../constants/URL";

export interface PrivilegeApiResponse {
    Access: boolean;
}

export interface checkPrivilegeParams {
    user: string | null;
    userID: string | null;
    PRIVILEGE_REQUIRED: string;
}

export const checkPrivilege = async ({user,userID, PRIVILEGE_REQUIRED}:checkPrivilegeParams) => {
    try {
        const BODY_TO_SEND = JSON.stringify({
            username: user,
            user_id: userID,
            privilege: PRIVILEGE_REQUIRED,
        });
        const response = await fetch(PRIVILEGE_CHECK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: BODY_TO_SEND,
        });

        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }

        const result: PrivilegeApiResponse = await response.json();
        return result?.Access;
    } catch (error: any) {
        console.log("Error in checkPrivilege: ", error);
        return false;
    }
};
