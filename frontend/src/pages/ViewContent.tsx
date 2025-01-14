import SingleContentWrapper from "../wrappers/SingleContentWrapper";
import { SingleContent } from "../components/content/SingleContent";
import { CreateContent } from "../components/content/Create";
import { useContentData } from "../hooks/content/useContentData";
import { AllContent } from "../interfaces/Content";

export const ViewContent = () => {
    const {
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
    } = useContentData();

    if (loading) return (
        <div className="h-screen pt-20">
            <div className="flex flex-row flex-wrap justify-center items-start gap-10 slide-up">
                {Array.from({ length: 3 }).map((_, index) => (
                    <SingleContentWrapper key={index} privacy={'loading'}></SingleContentWrapper>
                ))}
            </div>
        </div>
    );

    if (error)
        return (
            <div className="h-screen pt-20">
                <p>Error: {error}</p>
                <button onClick={() => (window.location.href = "/login")}>
                    Go to Login
                </button>
            </div>
        );

    return (
        <div className="h-screen pt-20">
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
                                    HandleViewContent={handleViewContent}
                                    HandleLikeContent={handleLikeContent}
                                    handleDeleteContent={handleDeleteContent}
                                    handleAddComment={handleAddComment}
                                    handleDeleteComment={handleDeleteComment}
                                />
                            )
                        })
                    }
                </div>
                <div className="flex flex-row flex-wrap justify-center items-center gap-10">
                    {selectedPerson && (
                        <button
                            className="btn btn-outline btn-error btn-sm"
                            onClick={() => setSelectedPerson('')}
                        >
                            {selectedPerson}
                        </button>
                    )}
                    <CreateContent onCreate={fetchData} />
                </div>
            </div>
        </div>
    );
};