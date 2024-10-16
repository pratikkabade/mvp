import { HTMLAttributes, ReactNode } from "react";
import { LOGO_URL } from "../constants/URL"

interface CreateContentWrapperProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}

const HomePageWrapper: React.FC<CreateContentWrapperProps> = ({ children }) => {
    return (
        <div className="lg:h-screen pt-20 flex flex-row justify-center items-center h-full">
            <div className="hero-content flex-col lg:flex-row">
                <img
                    src={LOGO_URL}
                    className="max-w-sm rounded-lg shadow-2xl w-52 h-52"
                />
                <div className="max-w-full ml-0 lg:ml-10">
                    <h1 className="text-5xl font-bold">
                        Welcome to IdeaHub
                    </h1>
                    <h1 className="text-3xl py-3">
                        A place where ideas spark conversations!
                    </h1>
                    <p className="py-4">
                        🚀 Share Your Thoughts – Post your ideas, innovations, or thoughts and let the world see them.
                    </p>
                    <p className="py-4">
                        💬 Engage & Connect – Like, comment, and interact with ideas that inspire you.
                    </p>
                    <p className="py-4">
                        🌎 Join a Community of Thinkers – Collaborate with creative minds from around the world.
                    </p>
                    <p className="py-4">
                        🔔 Stay Updated – Follow topics that interest you and never miss out on great discussions.
                    </p>

                    {children}
                </div>
            </div>
        </div>
    )
}

export default HomePageWrapper;