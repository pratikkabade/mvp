import { useState } from "react";
import { CREATE_CONTENT_URL } from "../../constants/URL";
import { AllContent } from "../../interfaces/Content";

interface CreateContentProps {
    onCreate: (newContent: AllContent) => void;
}

export const CreateContent: React.FC<CreateContentProps> = ({ onCreate }) => {
    const [content, setContent] = useState<string>('');
    const [privacy, setPrivacy] = useState<string>('public');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const user_id = localStorage.getItem('user_id');

    const handleCreateContent = async () => {
        try {
            setLoading(true);
            const BODY_TO_SEND = JSON.stringify({ user_id: user_id, content: content, privacy: privacy });

            const response = await fetch(CREATE_CONTENT_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: BODY_TO_SEND
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const newContent: AllContent = await response.json();
            onCreate(newContent);
            setContent('');
            setPrivacy('public');
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
        <div className={`flex flex-col shadow-lg bg-base-200 rounded-xl max-sm:w-3/4 w-96 p-5 gap-5 ${privacy === 'private' ? 'border-2 border-error' : 'border-2 border-base-200'}`}>
            <input
                id="content"
                placeholder="Content to create"
                className="input input-bordered w-full"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <select
                id="privacy"
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value)}
                className="select select-bordered w-full">
                <option disabled selected>Privacy ?</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
            </select>
            <button className="btn btn-success text-white" onClick={handleCreateContent} disabled={loading}>
                Create Content
            </button>
        </div >
    );
}