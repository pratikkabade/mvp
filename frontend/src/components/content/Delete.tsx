import { useEffect, useState } from "react";
import { fetchDeleteContent } from "../../hooks/content/useDeleteContent";

interface DeleteContentProps {
    content_id: string;
    refreshContent: () => void;
}

export const DeleteContent = ({ content_id, refreshContent }: DeleteContentProps) => {
    const [user_id, setUserID] = useState<string>(localStorage.getItem('user_id') || '');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (!user_id) {
            setUserID(localStorage.getItem('user_id') || '');
        }
    }, [user_id]);

    const handleDelete = async () => {
        try {
            setLoading(true);
            await fetchDeleteContent(user_id, content_id);
            refreshContent();
        } catch (error: any) {
            setError(error instanceof Error ? error.message : "An unknown error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (error)
        return (
            <div className="tooltip" data-tip={error}>
                <button className="btn btn-error btn-xs" disabled>x</button>
            </div>
        );

    if (loading)
        return (
            <button className="btn btn-error btn-xs">
                <span className="loading loading-spinner w-3 h-3"></span>
            </button>
        );

    return (
        <div>
            <button className="btn btn-error btn-xs" onClick={handleDelete}>x</button>
        </div>
    );
};
