import { useEffect, useState } from "react";
import { comment } from "../../../interfaces/Content";
import { fetchAddComment } from "../../../hooks/content/useAddComment";

interface AddCommentProps {
    content_id: string;
    onAdd: (content_id: string, newComment: comment) => void;
}

export const AddComment = ({ content_id, onAdd }: AddCommentProps) => {
    const [user_id, setUserID] = useState<string>(localStorage.getItem('user_id') || '');
    const [comment, setComment] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (!user_id) {
            setUserID(localStorage.getItem('user_id') || '');
        }
    }, [user_id]);

    const handleCreateContent = async () => {
        try {
            setLoading(true);
            const newComment = await fetchAddComment(user_id, content_id, comment);
            onAdd(content_id, newComment);
            setComment('');
        } catch (error: any) {
            setError(error instanceof Error ? error.message : "An unknown error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-row justify-between items-center gap-2 slide-up">
            <input
                placeholder="Type here"
                value={comment}
                className="input input-bordered input-sm w-full"
                onChange={(e) => setComment(e.target.value)}
                disabled={loading}
            />
            <button className="btn btn-success text-white btn-xs" onClick={handleCreateContent} disabled={loading}>
                {loading ? <span className="loading loading-spinner w-3 h-3"></span> : "Comment"}
            </button>
            {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>
    );
};
