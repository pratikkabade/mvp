import { HTMLAttributes, ReactNode } from "react";

interface ProfilePageWrappersProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}

export const ProfilePageWrappers = ({ children }: ProfilePageWrappersProps) => {
    return (
        <div className="h-screen pt-20 flex flex-row fade-in sm:px-10 max-sm:flex-col justify-center items-center">
            {children}
        </div>
    )
}