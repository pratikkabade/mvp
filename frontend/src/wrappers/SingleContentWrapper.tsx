import React, { ReactNode, HTMLAttributes } from 'react';

interface SingleContentWrapperProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    privacy: string;
}

const SingleContentWrapper: React.FC<SingleContentWrapperProps> = ({ children, privacy, ...props }) => {
    const borderClass = privacy === 'private' ? 'border-2 border-error' : privacy === 'loading' ? 'skeleton' : '';

    if (!children) return (
        <div className={`shadow-lg bg-base-200 rounded-xl flex flex-col flex-wrap max-sm:w-3/4 w-96 ${borderClass} p-5 cursor-default text-base-300`} {...props}>
            <h1 className="text-3xl font-bold flex flex-row justify-between items-center rounded-md skeleton px-2">
                loading..
                <button className="btn btn-error btn-xs animate-pulse w-6">
                    {/* <span className="loading loading-spinner w-3 h-3"></span> */}
                </button>
            </h1>
            <h6 className="text-lg font-mono">
                <span className="bg-slate-200 rounded-xl mr-2">created_by</span>
                <span className='rounded-md skeleton'>created_at</span>
            </h6>
            <h6>
                <span className="mr-1">viewed by:</span><span className='rounded-md skeleton px-2'></span>
                <button className="btn btn-secondary btn-xs w-14 h-6 ml-4 animate-pulse">
                    {/* <span><span className="loading loading-spinner w-3 h-3 mr-0.5"></span>likes</span> */}
                </button>
            </h6>
            <div className="w-full slide-down">
                <button className={`rounded-md px-2 my-2 bg-base-200 hover:bg-base-300`}>
                    Comments: <span className='rounded-md skeleton ml-1'>( )</span>
                    <i className="fa-solid fa-caret-down"></i>
                </button>
            </div>
        </div>
    )

    return (
        <div className={`shadow-lg bg-base-200 rounded-xl flex flex-col flex-wrap max-sm:w-3/4 w-96 ${borderClass} p-5`} {...props}>
            {children}
        </div>
    );
};

export default SingleContentWrapper;
