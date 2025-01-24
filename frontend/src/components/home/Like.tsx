import { useEffect, useState } from "react";
import { LIKE_CONTENT_URL } from "../../constants/URL";

interface LikeButtonProps {
    content_id: string;
}

export const LikeButton = ({ content_id }: LikeButtonProps) => {
    const [user_id, setUserID] = useState<string>(localStorage.getItem('user_id') || '');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (!user_id) {
            setUserID(localStorage.getItem('user_id') || '');
            return;
        }
    }, [user_id]);

    const HandleLike = async () => {
        try {
            setLoading(true);
            // user_id = data.get("user_id")
            // content_id = data.get("content_id")
    
            const BODY_TO_SEND = JSON.stringify({ user_id: user_id, content_id:content_id });

            const response = await fetch(LIKE_CONTENT_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: BODY_TO_SEND
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }
        } catch (error: any) {
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
        <div>
            <button onClick={HandleLike}>like</button>
        </div>
    )
}