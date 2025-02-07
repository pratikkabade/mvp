import React, { ReactNode, HTMLAttributes } from 'react';

interface CreateContentWrapperProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}

const UserAccessWrapper: React.FC<CreateContentWrapperProps> = ({ children, ...props }) => {
    if (!children) {
        return (
            <li className="bg-base-200 flex flex-col rounded-xl shadow-md p-3 gap-5 slide-up">
                <strong className="text-xl skeleton px-2 rounded-md">
                    <span className='text-base-300'>user</span>
                </strong>
                <div className="flex flex-col">
                    {Array.from({ length: 4 }).map((_, k) => (
                        <div key={k}>
                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                />
                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600">
                                </div>
                                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300 skeleton">
                                    <span className='text-base-300'>access</span>
                                </span>
                            </label>
                        </div>
                    ))}
                </div>
                <div className="tooltip" data-tip={'loading..'}>
                    <button className={`btn text-white btn-sm w-full btn-error`}>
                        loading..
                    </button>
                </div>
            </li>
        );
    }

    return (
        <div className={`bg-base-200 flex flex-col rounded-xl shadow-md p-3 gap-5 slide-up`} {...props}>
            {children}
        </div>
    );
}

export default UserAccessWrapper;
