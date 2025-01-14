import { useEffect, useState } from "react";
import { AllContent, comment } from "../../interfaces/Content";
import { GET_CONTENT_URL, VIEW_CONTENT_URL } from "../../constants/URL";
import { ANIMATION_TIME_DELAY } from "../../constants/Constants";

interface ContentApiResponse {
    data: AllContent[];
}

export const useContentData = () => {
    const user_id = localStorage.getItem('user_id');

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [selectedPerson, setSelectedPerson] = useState<string>('');
    const [data, setData] = useState<AllContent[]>([]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(GET_CONTENT_URL(user_id), {
                method: "GET"
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const result: ContentApiResponse = await response.json();
            setData(result.data);
        } catch (error: any) {
            const errorMessage =
                error instanceof Error ? error.message : "An unknown error occurred";
            setError(errorMessage);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, ANIMATION_TIME_DELAY);
        }
    };

    // Initialize data on component mount
    useEffect(() => {
        fetchData();
    }, []);

    const handleViewContentCall = async (content_id: string) => {
        try {
            await fetch(VIEW_CONTENT_URL(content_id), {
                method: "GET"
            });
        } catch (error: any) {
            const errorMessage =
                error instanceof Error ? error.message : "An unknown error occurred";
            setError(errorMessage);
        }
    };

    const handleLikeContent = async (content_id: string) => {
        setData(prevData =>
            prevData.map(content =>
                content._id === content_id
                    ? {
                        ...content,
                        interaction: {
                            ...content.interaction,
                            likes: content.interaction.likes + 1
                        }
                    }
                    : content
            )
        );
    };

    const handleViewContent = (content_id: string) => {
        setData(prevData =>
            prevData.map(content =>
                content._id === content_id
                    ? {
                        ...content,
                        interaction: {
                            ...content.interaction,
                            views: content.interaction.views + 1
                        }
                    }
                    : content
            )
        );
        handleViewContentCall(content_id);
    };

    const handleDeleteComment = (content_id: string, comment_to_delete: string) => {
        setData(prevData =>
            prevData.map(content =>
                content._id === content_id
                    ? {
                        ...content,
                        interaction: {
                            ...content.interaction,
                            comments: content.interaction.comments.filter(
                                comment => comment.comment !== comment_to_delete
                            )
                        }
                    }
                    : content
            )
        );
    };

    const handleAddComment = (content_id: string, newComment: comment) => {
        setData(prevData =>
            prevData.map(content =>
                content._id === content_id
                    ? {
                        ...content,
                        interaction: {
                            ...content.interaction,
                            comments: [...content.interaction.comments, newComment]
                        }
                    }
                    : content
            )
        );
    };

    const handleDeleteContent = (content_id: string) => {
        setData(prevData => prevData.filter(content => content._id !== content_id));
    };

    return {
        loading,
        error,
        data,
        selectedPerson,
        setSelectedPerson,
        fetchData,
        handleLikeContent,
        handleViewContent,
        handleDeleteComment,
        handleAddComment,
        handleDeleteContent
    };
};