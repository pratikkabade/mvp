import { useEffect, useState } from "react";
import { 
  AllContent, 
  comment 
} from "../../interfaces/Content";
import { 
  GET_CONTENT_URL, 
  VIEW_CONTENT_URL,
  ADD_COMMENT_URL,
  CREATE_CONTENT_URL,
  DELETE_COMMENT_URL,
  DELETE_CONTENT_URL,
  LIKE_CONTENT_URL
} from "../../constants/URL";
import { ANIMATION_TIME_DELAY } from "../../constants/Constants";

interface ContentApiResponse {
  data: AllContent[];
}

export const useContentService = () => {
  const user_id = localStorage.getItem('user_id') || '';
  const remembered_logged_id = localStorage.getItem('remembered_logged_id') || '';

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [selectedPerson, setSelectedPerson] = useState<string>('');
  const [data, setData] = useState<AllContent[]>([]);

  // Fetch all content
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

  // Create new content
  const createContent = async (content: string, privacy: string): Promise<AllContent | null> => {
    try {
      setLoading(true);
      const BODY_TO_SEND = JSON.stringify({ user_id, content, privacy });

      const response = await fetch(CREATE_CONTENT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: BODY_TO_SEND,
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const newContent: AllContent = await response.json();
      
      // Update local state with new content
      setData(prevData => [newContent, ...prevData]);
      
      return newContent;
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Like content
  const likeContent = async (content_id: string) => {
    try {
      const response = await fetch(LIKE_CONTENT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, content_id }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      // Update local state
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
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setError(errorMessage);
    }
  };

  // View content
  const viewContent = async (content_id: string) => {
    try {
      // First update local state for immediate UI feedback
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
      
      // Then make API call
      await fetch(VIEW_CONTENT_URL(content_id), {
        method: "GET"
      });
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setError(errorMessage);
    }
  };

  // Add comment
  const addComment = async (content_id: string, commentText: string) => {
    try {
      const BODY_TO_SEND = JSON.stringify({ 
        user_id, 
        content_id, 
        comment: commentText 
      });

      const response = await fetch(ADD_COMMENT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: BODY_TO_SEND,
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      // Create new comment object
      const newComment: comment = {
        commented_by: remembered_logged_id,
        comment: commentText,
        commented_at: new Date().toISOString().split('T')[0], // Format YYYY-MM-DD
      };

      // Update local state
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
      
      return newComment;
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setError(errorMessage);
      throw error;
    }
  };

  // Delete comment
  const deleteComment = async (content_id: string, comment_to_delete: string) => {
    try {
      const BODY_TO_SEND = JSON.stringify({ 
        user_id, 
        content_id, 
        comment_to_delete 
      });

      const response = await fetch(DELETE_COMMENT_URL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: BODY_TO_SEND,
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      // Update local state
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
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setError(errorMessage);
      throw error;
    }
  };

  // Delete content
  const deleteContent = async (content_id: string) => {
    try {
      const BODY_TO_SEND = JSON.stringify({ user_id });

      const response = await fetch(DELETE_CONTENT_URL(content_id), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: BODY_TO_SEND,
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      // Update local state
      setData(prevData => prevData.filter(content => content._id !== content_id));
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setError(errorMessage);
      throw error;
    }
  };

  return {
    // State
    loading,
    error,
    data,
    selectedPerson,
    setSelectedPerson,
    
    // Methods
    fetchData,
    createContent,
    likeContent,
    viewContent,
    addComment,
    deleteComment,
    deleteContent
  };
};