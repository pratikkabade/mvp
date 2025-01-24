import { useState } from "react";
import { CREATE_CONTENT_URL } from "../../constants/URL";

export const CreateContent = () => {
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
        <div className="flex flex-row bg-emerald-100 m-5">
            <div>
                <label htmlFor="content">Content</label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="privacy">Privacy</label>
                <select
                    id="privacy"
                    value={privacy}
                    onChange={(e) => setPrivacy(e.target.value)}
                >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                </select>
            </div>
            <button onClick={handleCreateContent} disabled={loading}>
                Create Content
            </button>
        </div>
    );
}