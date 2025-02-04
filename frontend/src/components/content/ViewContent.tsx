import { useEffect, useState } from "react";
import { GET_CONTENT_URL, VIEW_CONTENT_URL } from "../../constants/URL";
import { CreateContent } from "./Create";
import { AllContent, comment } from "../../interfaces/Content";
import { SingleContent } from "./SingleContent";

interface ContentApiResponse {
    data: AllContent[];
}

export const ViewContent = () => {
    const user_id = localStorage.getItem('user_id');

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
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
            setLoading(false);
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

    if (loading) return <div>Loading...</div>;
    if (error)
        return (
            <div>
                <p>Error: {error}</p>
                <button onClick={() => (window.location.href = "/login")}>
                    Go to Login
                </button>
            </div>
        );

    return (
        <div className="flex flex-row flex-wrap justify-center items-start gap-10">
            {
                data &&
                data.map((content: AllContent, index) => {
                    return (
                        <SingleContent
                            key={index}
                            content={content}
                            HandleViewContent={HandleViewContent}
                            HandleLikeContent={HandleLikeContent}
                            handleDeleteContent={handleDeleteContent}
                            handleAddComment={handleAddComment}
                            handleDeleteComment={handleDeleteComment}
                        />
                    )
                })
            }
            <CreateContent onCreate={fetchData} />
        </div>
    )
}



// <div key={content._id} className="border flex flex-col bg-slate-100 m-5">
//     <div key={content._id} className="flex flex-row">
//         <h1>{content.content}</h1>
//         <h6>| created_at: {content.created_at}</h6>
//         <h6>| created_by: {content.created_by}</h6>
//         <h6>| likes: {content.interaction.likes}</h6>
//         <LikeButton content_id={content._id} />
//         <h6 onClick={() => HandleViewContent(content._id)}>| views: {content.interaction.views}</h6>
//         <h6>| privacy: {content.privacy}</h6>
//         <h6>| comments: ({content.interaction.comments.length})
//             {content.interaction.comments.map((comment: comment) => {
//                 return (
//                     <div key={comment.commented_at} className="flex flex-row bg-red-100">
//                         <h6>{comment.comment}</h6>
//                         <h6>{comment.commented_at}</h6>
//                         <h6>{comment.commented_by}</h6>
//                         <DeleteComment comment_to_delete={comment.comment} content_id={content._id} onDelete={handleDeleteComment} />
//                     </div>
//                 )
//             })}
//         </h6>
//         <DeleteContent content_id={content._id} refreshContent={() => handleDeleteContent(content._id)} />
//     </div>
//     <AddComment content_id={content._id} onAdd={handleAddComment} />
// </div>
