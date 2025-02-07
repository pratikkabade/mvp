import { useState } from "react";
import { AllContent, comment } from "../../interfaces/Content"
import { DeleteContent } from "./Delete";
import { LikeButton } from "./Like";
import { AddComment } from "./comments/Add";
import { DeleteComment } from "./comments/Delete";
import SingleContentWrapper from "../../wrappers/SingleContentWrapper";

interface SingleContentProps {
    content: AllContent;
    HandleViewContent: (id: string) => void;
    HandleLikeContent: (id: string) => void;
    handleDeleteContent: (id: string) => void;
    handleAddComment: (content_id: string, newComment: comment) => void;
    handleDeleteComment: (content_id: string, comment_to_delete: string) => void;
}

interface CommentsProps {
    content: AllContent;
    handleAddComment: (content_id: string, newComment: comment) => void;
    handleDeleteComment: (content_id: string, comment_to_delete: string) => void;
}

const CommentsComponent = ({ content, handleDeleteComment, handleAddComment }: CommentsProps) => {
    const [show, setShow] = useState<boolean>(false);
    const [showDetails, setShowDetails] = useState<number>(-1);
    return (
        <div className="w-full slide-down">
            <button onClick={() => setShow(!show)} className={`rounded-md px-2 my-2 ${show ? 'bg-base-300 hover:bg-base-100' : 'bg-base-200 hover:bg-base-300'}`}>
                Comments: ({content.interaction.comments.length})
                <i className="fa-solid fa-caret-down"></i>
            </button>
            {show && content.interaction.comments.map((comment: comment, index) => {
                return (
                    <div key={index} className="flex flex-row justify-between items-center bg-base-100 border border-base-300 rounded-md p-0.5 px-2 my-1 slide-down">
                        <div className="flex flex-col">
                            <h6
                                onClick={() => {
                                    if (showDetails === index) {
                                        setShowDetails(-1);
                                    } else {
                                        setShowDetails(index);
                                    }
                                }}
                                className="text-lg font-semibold cursor-pointer">{comment.comment}</h6>
                            {showDetails === index && <h6 className="text-md font-mono">
                                <span>
                                    by:<span className="bg-slate-200 rounded-xl mr-2 px-1">{comment.commented_by}</span>
                                    @{comment.commented_at}
                                </span>
                            </h6>}
                        </div>
                        <DeleteComment comment_to_delete={comment.comment} content_id={content._id} onDelete={handleDeleteComment} />
                    </div>
                )
            })}
            {show && <AddComment content_id={content._id} onAdd={handleAddComment} />}
        </div>
    )
}

export const SingleContent = ({ content, HandleViewContent, HandleLikeContent, handleDeleteContent, handleAddComment, handleDeleteComment }: SingleContentProps) => {
    return (
        <SingleContentWrapper privacy={content.privacy}>
            <h1 className="text-3xl font-bold flex flex-row justify-between items-center">
                {content.content}
                <DeleteContent content_id={content._id} refreshContent={() => handleDeleteContent(content._id)} />
            </h1>
            <h6 className="text-lg font-mono">
                <span className="bg-slate-200 rounded-xl mr-2">{content.created_by}</span>
                @{content.created_at}
            </h6>
            <h6>
                <span className="mr-4" onClick={() => HandleViewContent(content._id)}>viewed by: {content.interaction.views}</span>
                <LikeButton like_number={content.interaction.likes} content_id={content._id} HandleLikeContent={() => HandleLikeContent} />
            </h6>
            <CommentsComponent content={content} handleDeleteComment={handleDeleteComment} handleAddComment={handleAddComment} />
        </SingleContentWrapper>
    )
}