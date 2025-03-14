import { useEffect, useState } from "react";
import { fetchDeleteComment } from "../../../hooks/content/useDeleteComment";

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
        }
    }, [user_id]);

    const handleDeleteComment = async () => {
        try {
            setLoading(true);
            await fetchDeleteComment(user_id, content_id, comment_to_delete);
            onDelete(content_id, comment_to_delete);
        } catch (error: any) {
            setError(error instanceof Error ? error.message : "An unknown error occurred");
            console.error(error);
        }
        setLoading(false);
    }

    if (error)
        return (
            <div className="tooltip" data-tip={error}>
                <button className="btn btn-error btn-xs" disabled>x</button>
            </div>
        );

    return (
        <button className="btn btn-error btn-xs" onClick={handleDeleteComment} disabled={loading}>
            {loading ? <span className="loading loading-spinner w-2 h-2"></span> : "x"}
        </button>
    );
};
