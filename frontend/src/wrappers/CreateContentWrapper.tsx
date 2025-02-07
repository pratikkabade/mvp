import React, { ReactNode, HTMLAttributes } from 'react';

interface CreateContentWrapperProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    privacy: string;
}

const CreateContentWrapper: React.FC<CreateContentWrapperProps> = ({ children, privacy, ...props }) => {
    const borderClass = privacy === 'private' ? 'border-2 border-error' : 'border-2 border-base-200';

    if (!children) return (
        <div className={`flex flex-col shadow-lg bg-base-200 skeleton rounded-xl max-sm:w-3/4 w-96 p-5 gap-5 ${borderClass}`}>
            <input
                id="content"
                placeholder="Content creating.."
                className="input input-bordered w-full"
                disabled
            />
            <select
                disabled
                id="privacy"
                className="select select-bordered w-full">
                <option disabled selected>Privacy ?</option>
            </select>
            <button className="btn btn-success text-white"
                disabled>
                Create Content
            </button>
        </div>
    )

    return (
        <div className={`flex flex-col shadow-lg bg-base-200 rounded-xl max-sm:w-3/4 w-96 p-5 gap-5 ${borderClass}`} {...props}>
            {children}
        </div>
    );
};

export default CreateContentWrapper;
