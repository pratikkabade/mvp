import { useEffect } from "react";

interface LoginFormProps {
    setPage: React.Dispatch<React.SetStateAction<string>>;
    isServerRunning: boolean;
    id: string;
    setId: React.Dispatch<React.SetStateAction<string>>;
    userNotFoundError: boolean;
    setUserNotFoundError: React.Dispatch<React.SetStateAction<boolean>>;
    nextLogin: (e: React.MouseEvent<HTMLButtonElement>) => void;
    isLoading: boolean;  // Pass isLoading state to handle the loading state
}

export const LoginForm: React.FC<LoginFormProps> = ({
    setPage,
    isServerRunning,
    id,
    setId,
    userNotFoundError,
    setUserNotFoundError,
    nextLogin,
    isLoading,
}) => {

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            nextLogin(e as unknown as React.MouseEvent<HTMLButtonElement>);
        }
    };

    useEffect(() => {
    }, [isServerRunning])

    return (
        <div className="slide-r flex flex-col justify-end w-2/4 max-md:w-full ml-20 max-md:ml-0 max-md:mt-20">
            <label className={`input input-bordered my-2 flex items-center gap-2 ${userNotFoundError ? "input-error ring-red-500" : ""}`}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70">
                    <path
                        d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input
                    type="text"
                    className="grow border-none focus:!border-none focus:outline-none focus:ring-0 my-2"
                    placeholder="User ID"
                    id="user_id"
                    disabled={isLoading && isServerRunning}
                    onChange={(e) => {
                        setId(e.target.value.toLowerCase());
                        if (userNotFoundError) setUserNotFoundError(false); // Reset error when typing
                    }}
                    value={id}
                    onKeyDown={handleKeyDown}  // Handle Enter key press here
                    required
                />
            </label>

            {userNotFoundError ?
                <p className="text-red-700 font-semibold mt-2">User not found</p> :
                <p className="opacity-0 font-semibold mt-2">BLANK</p>
            }

            <div className="flex flex-row justify-end items-center mt-6 gap-5">
                <div
                    onClick={() => setPage("create-account")}
                    className="flex font-medium focus:z-10 text-black rounded-full hover:bg-blue-50 p-2.5 cursor-pointer"
                >
                    Create new account
                </div>
                <button
                    color="blue"
                    onClick={nextLogin}
                    disabled={isLoading && isServerRunning}
                    className="btn btn-primary rounded-full"
                >
                    {isLoading ? <span className="loading loading-spinner w-3 h-3"></span> : "Next"}
                </button>
            </div>
        </div>
    );
};
