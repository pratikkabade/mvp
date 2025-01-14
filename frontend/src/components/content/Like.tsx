import useLike from "../../hooks/content/useLike";

interface LikeButtonProps {
    like_number: number;
    content_id: string;
    handleLikeContent: (id: string) => void;
}

export const LikeButton = ({ content_id, like_number }: LikeButtonProps) => {
    const { HandleLike, dynamicLikes, loading, error } = useLike(like_number, content_id);

    if (loading) {
        return (
            <button className="btn btn-secondary btn-xs w-16 h-6" disabled>
                <span className="loading loading-spinner w-3 h-3"></span>
            </button>
        );
    }

    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <button className="btn btn-secondary btn-xs w-16 h-6" onClick={HandleLike}>
            {dynamicLikes} likes
        </button>
    );
};
