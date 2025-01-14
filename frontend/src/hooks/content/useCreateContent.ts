// src/utils/fetchCreateContent.ts
import { CREATE_CONTENT_URL } from "../../constants/URL";
import { AllContent } from "../../interfaces/Content";

export const fetchCreateContent = async (
    user_id: string | null,
    content: string,
    privacy: string
): Promise<AllContent> => {
    const BODY_TO_SEND = JSON.stringify({ user_id, content, privacy });

    const response = await fetch(CREATE_CONTENT_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: BODY_TO_SEND,
    });

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return response.json();
};
