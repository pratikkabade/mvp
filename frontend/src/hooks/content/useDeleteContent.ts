// src/utils/fetchDeleteContent.ts
import { DELETE_CONTENT_URL } from "../../constants/URL";

export const fetchDeleteContent = async (user_id: string, content_id: string): Promise<void> => {
    const BODY_TO_SEND = JSON.stringify({ user_id });

    const response = await fetch(DELETE_CONTENT_URL(content_id), {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: BODY_TO_SEND,
    });

    if (!response.ok) {
        throw new Error(response.statusText);
    }
};
