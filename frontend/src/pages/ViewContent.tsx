import { useEffect, useState } from "react";
import { AllContent, comment } from "../interfaces/Content";
import { GET_CONTENT_URL, VIEW_CONTENT_URL } from "../constants/URL";
import { ANIMATION_TIME_DELAY } from "../constants/Constants";
import SingleContentWrapper from "../wrappers/SingleContentWrapper";
import { SingleContent } from "../components/content/SingleContent";
import { CreateContent } from "../components/content/Create";

interface ContentApiResponse {
    data: AllContent[];
}

export const ViewContent = () => {
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

    useEffect(() => {
        fetchData();
    }, []);

    const HandleLikeContent = async (content_id: string) => {
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

    const HandleViewContentCall = async (content_id: string) => {
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
    const HandleViewContent = (content_id: string) => {
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
        HandleViewContentCall(content_id);
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

    if (loading) return (
        <div className="h-screen -mt-16 pt-20">
            <div className="flex flex-row flex-wrap justify-center items-start gap-10 slide-up">
                {Array.from({ length: 3 }).map((_, index) => (
                    <SingleContentWrapper key={index} privacy={'loading'}></SingleContentWrapper>
                ))}
            </div>
        </div>
    );

    if (error)
        return (
            <div className="h-screen -mt-16 pt-20">
                <p>Error: {error}</p>
                <button onClick={() => (window.location.href = "/login")}>
                    Go to Login
                </button>
            </div>
        );

    return (
        <div className="h-screen -mt-16 pt-20">
            <div className="flex flex-col flex-wrap justify-between items-center gap-10">
                <div className="flex flex-row flex-wrap justify-center items-start gap-10">
                    {
                        data &&
                        (selectedPerson
                            ? data.filter((content: AllContent) => content.created_by === selectedPerson)
                            : data
                        ).map((content: AllContent, index) => {
                            return (
                                <SingleContent
                                    key={index}
                                    content={content}
                                    selectedPerson={selectedPerson}
                                    setSelectedPerson={setSelectedPerson}
                                    HandleViewContent={HandleViewContent}
                                    HandleLikeContent={HandleLikeContent}
                                    handleDeleteContent={handleDeleteContent}
                                    handleAddComment={handleAddComment}
                                    handleDeleteComment={handleDeleteComment}
                                />
                            )
                        })
                    }
                </div>
                <div className="flex flex-row flex-wrap justify-center items-center gap-10">
                    {selectedPerson && <button className="btn btn-outline btn-error btn-sm" onClick={() => setSelectedPerson('')}>
                        {selectedPerson}
                    </button>}
                    <CreateContent onCreate={fetchData} />
                </div>
            </div>
        </div>
    )
}