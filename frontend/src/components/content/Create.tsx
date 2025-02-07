import { useState } from "react";
import { CREATE_CONTENT_URL } from "../../constants/URL";
import { AllContent } from "../../interfaces/Content";
import CreateContentWrapper from "../../wrappers/CreateContentWrapper";

interface CreateContentProps {
    onCreate: (newContent: AllContent) => void;
}

export const CreateContent: React.FC<CreateContentProps> = ({ onCreate }) => {
    const [show, setShow] = useState<boolean>(false);
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
            setShow(false);
        } catch (error: any) {
            const errorMessage =
                error instanceof Error ? error.message : "An unknown error occurred";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <CreateContentWrapper privacy={privacy}></CreateContentWrapper>
    );
    if (error) return (
        <CreateContentWrapper privacy={privacy}>
            <div className="tooltip flex flex-row w-full" data-tip={error}>
                <button className="btn btn-success text-white w-full" disabled>
                    Create Content
                </button>
            </div>
        </CreateContentWrapper>
    );

    return (
        <>
            {show ?
                <CreateContentWrapper privacy={privacy}>
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
                </CreateContentWrapper>
                :
                <CreateContentWrapper privacy={privacy}>
                    <button className="btn btn-success text-white" onClick={() => setShow(true)} disabled={loading}>
                        Create Content
                    </button>
                </CreateContentWrapper>
            }
        </>
    );
}