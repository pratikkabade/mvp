import React, { ReactNode, HTMLAttributes } from 'react';
import { UserNameWrapper } from './UserNameWrapper';

interface SingleContentWrapperProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    privacy: string;
}

const SingleContentWrapper: React.FC<SingleContentWrapperProps> = ({ children, privacy, ...props }) => {
    const borderClass = privacy === 'private' ? 'border-2 border-error' : privacy === 'loading' ? 'skeleton' : '';

    if (!children) return (
        <div className={`shadow-lg bg-base-200 rounded-xl flex flex-col flex-wrap max-sm:w-3/4 w-96 ${borderClass} p-5 cursor-default text-base-300`} {...props}>
            <h6 className="text-sm bg-base-300  px-1 flex flex-row w-fit cursor-default rounded-md skeleton">
                loading date..
            </h6>
            <h1 className="text-2xl font-bold flex flex-row justify-between items-center">
                <span className="flex flex-row justify-center items-center">
                    <span className="text-lg">{UserNameWrapper('loading')}</span>
                    loading content..
                </span>
                <button className="btn btn-error btn-xs animate-pulse w-6">
                    {/* <span className="loading loading-spinner w-3 h-3"></span> */}
                </button>
            </h1>

            <h6 className="mt-2 flex flex-row justify-start items-center">
                <span className="mr-4 cursor-default skeleton">loading views..</span>
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
