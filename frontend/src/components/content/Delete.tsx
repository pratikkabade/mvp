import { useEffect, useState } from "react";
import { DELETE_CONTENT_URL } from "../../constants/URL";

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
            return;
        }
    }, [user_id]);

    const HandleDelete = async () => {
        try {
            setLoading(true);
            const BODY_TO_SEND = JSON.stringify({ user_id: user_id });

            const response = await fetch(DELETE_CONTENT_URL(content_id), {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: BODY_TO_SEND
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            } else {
                refreshContent();
            }
        } catch (error: any) {
            const errorMessage =
                error instanceof Error ? error.message : "An unknown error occurred";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (error) return (
        <div className="tooltip" data-tip={error}>
            <button className="btn btn-error btn-xs" disabled>x</button>
        </div>
    );

    if (loading) return (
        <button className="btn btn-error btn-xs">
            <span className="loading loading-spinner w-3 h-3"></span>
        </button>
    )

    return (
        <div>
            <button className="btn btn-error btn-xs" onClick={HandleDelete}>x</button>
        </div>
    )
}