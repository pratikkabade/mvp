import React, { useState } from "react";
import { AllContent, comment } from "../../interfaces/Content"
import { DeleteContent } from "./Delete";
import { LikeButton } from "./Like";
import { AddComment } from "./comments/Add";
import { DeleteComment } from "./comments/Delete";
import SingleContentWrapper from "../../wrappers/SingleContentWrapper";
import DateDifference from "../../utility/DateDifference";
import { UserNameWrapper } from "../../wrappers/UserNameWrapper";

interface SingleContentProps {
    content: AllContent;
    selectedPerson: string;
    setSelectedPerson: React.Dispatch<React.SetStateAction<string>>;
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
                                className="text-lg font-semibold cursor-pointer">
                                {comment.comment}
                            </h6>
                            {showDetails === index &&
                                <h6>
                                    <span className="text-sm bg-base-200 rounded-md pr-1 flex flex-row w-fit !cursor-default items-center">
                                        {UserNameWrapper(comment.commented_by)}
                                        <span className="ml-2">
                                            {
                                                DateDifference(comment.commented_at) === 0 ?
                                                    <span>Today</span> :
                                                    <span>
                                                        <b>{DateDifference(comment.commented_at)}</b> days ago
                                                    </span>
                                            }
                                        </span>
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

export const SingleContent = ({ content, selectedPerson, setSelectedPerson, HandleViewContent, HandleLikeContent, handleDeleteContent, handleAddComment, handleDeleteComment }: SingleContentProps) => {
    return (
        <SingleContentWrapper privacy={content.privacy}>
            <h6 className="text-sm bg-base-300 rounded-xl px-1 flex flex-row w-fit cursor-default slide-down">
                {
                    DateDifference(content.created_at) === 0 ?
                        <span>Today</span> :
                        <span>
                            <b>{DateDifference(content.created_at)}</b> days ago
                        </span>
                }
            </h6>
            <h1 className="text-3xl font-bold flex flex-row justify-between items-center slide-down">
                <span className="flex flex-row justify-center items-center">
                    <span className="text-lg cursor-pointer" onClick={() => {
                        if (selectedPerson === content.created_by) {
                            setSelectedPerson('');
                        } else {
                            setSelectedPerson(content.created_by);
                        }
                    }}>
                        {UserNameWrapper(content.created_by)}
                    </span>
                    <span className="ml-2">
                        {content.content}
                    </span>
                </span>
                <DeleteContent content_id={content._id} refreshContent={() => handleDeleteContent(content._id)} />
            </h1>
            <h6 className="mt-2 slide-down">
                <span className="mr-4 cursor-default" onClick={() => HandleViewContent(content._id)}>{content.interaction.views} views</span>
                <LikeButton like_number={content.interaction.likes} content_id={content._id} handleLikeContent={HandleLikeContent} />
            </h6>
            <CommentsComponent content={content} handleDeleteComment={handleDeleteComment} handleAddComment={handleAddComment} />
        </SingleContentWrapper>
    )
}