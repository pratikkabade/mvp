import { useEffect, useState } from "react";
import { ADD_COMMENT_URL } from "../../../constants/URL";
import { comment } from "../../../interfaces/Content";

interface AddCommentProps {
    content_id: string;
    onAdd: (content_id: string, newComment: comment) => void;
}

export const AddComment = ({ content_id, onAdd }: AddCommentProps) => {
    const user_name = localStorage.getItem('remembered_logged_id') || '';

    const [user_id, setUserID] = useState<string>(localStorage.getItem('user_id') || '');
    const [comment, setComment] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (!user_id) {
            setUserID(localStorage.getItem('user_id') || '');
            return;
        }
    }, [user_id]);

    const handleCreateContent = async () => {
        try {
            setLoading(true);
            const BODY_TO_SEND = JSON.stringify({ user_id: user_id, content_id: content_id, comment: comment });

            const response = await fetch(ADD_COMMENT_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: BODY_TO_SEND
            });

            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }else{
                // need date in this format 2025-01-28

                onAdd(content_id, {commented_by: user_name, comment: comment, commented_at: new Date().toISOString().split('T')[0]});
                setComment('');
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
        <div className="flex flex-row">
            <div>
                <label htmlFor="comment">Comment</label>
                <input
                    type="text"
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
            </div>
            <button onClick={handleCreateContent} disabled={loading}>
                Add Comment
            </button>
        </div>
    );
};


