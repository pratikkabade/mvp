import { ADD_COMMENT_URL } from "../../constants/URL";
import { comment } from "../../interfaces/Content";

export const fetchAddComment = async (
    user_id: string,
    content_id: string,
    commentText: string
): Promise<comment> => {
    const BODY_TO_SEND = JSON.stringify({ user_id, content_id, comment: commentText });

    const response = await fetch(ADD_COMMENT_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: BODY_TO_SEND,
    });

    if (!response.ok) {
        throw new Error("Failed to fetch data");
    }

    return {
        commented_by: localStorage.getItem('remembered_logged_id') || '',
        comment: commentText,
        commented_at: new Date().toISOString().split('T')[0], // Format YYYY-MM-DD
    };
};
