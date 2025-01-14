// src/utils/fetchDeleteComment.ts
import { DELETE_COMMENT_URL } from "../../constants/URL";

export const fetchDeleteComment = async (
    user_id: string,
    content_id: string,
    comment_to_delete: string
): Promise<void> => {
    const BODY_TO_SEND = JSON.stringify({ user_id, content_id, comment_to_delete });

    const response = await fetch(DELETE_COMMENT_URL, {
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
