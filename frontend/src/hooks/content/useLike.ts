import { useEffect, useState } from "react";
import { LIKE_CONTENT_URL } from "../../constants/URL";

const useLike = (initialLikes: number, content_id: string) => {
    const [user_id, setUserID] = useState<string>(localStorage.getItem("user_id") || "");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [dynamicLikes, setDynamicLikes] = useState<number>(initialLikes);

    useEffect(() => {
        if (!user_id) {
            setUserID(localStorage.getItem("user_id") || "");
        }
    }, [user_id]);

    const HandleLike = async () => {
        try {
            setLoading(true);
            const response = await fetch(LIKE_CONTENT_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id, content_id }),
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            setDynamicLikes((prev) => prev + 1);
        } catch (error: any) {
            setError(error instanceof Error ? error.message : "An unknown error occurred");
        } finally {
            setLoading(false);
        }
    };

    return { HandleLike, dynamicLikes, loading, error };
};

export default useLike;
