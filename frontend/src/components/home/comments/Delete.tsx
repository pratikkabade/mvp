import { useEffect, useState } from "react";
import { DELETE_COMMENT_URL } from "../../../constants/URL";

interface DeleteCommentProps {
    content_id: string;
    comment_to_delete: string;
    onDelete: (content_id: string, comment_to_delete: string) => void;
}

export const DeleteComment = ({ content_id, comment_to_delete, onDelete }: DeleteCommentProps) => {
    const [user_id, setUserID] = useState<string>(localStorage.getItem('user_id') || '');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (!user_id) {
            setUserID(localStorage.getItem('user_id') || '');
            return;
        }
    }, [user_id]);


    const handleDeleteComment = async () => {
        try {
            setLoading(true);
            const BODY_TO_SEND = JSON.stringify({ user_id: user_id, content_id: content_id, comment_to_delete: comment_to_delete });

            const response = await fetch(DELETE_COMMENT_URL, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: BODY_TO_SEND
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            } else {
                onDelete(content_id, comment_to_delete);
            }
        }
        catch (error: any) {
            const errorMessage =
                error instanceof Error ? error.message : "An unknown error occurred";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <button onClick={handleDeleteComment}>x</button>
    )
}