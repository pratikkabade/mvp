import { useEffect } from "react";
import UserLogo from "../../assets/svg/UserLogo";

interface LoginFormProps {
    setPage: React.Dispatch<React.SetStateAction<string>>;
    isServerRunning: boolean;
    id: string;
    setId: React.Dispatch<React.SetStateAction<string>>;
    userNotFoundError: string;
    setUserNotFoundError: React.Dispatch<React.SetStateAction<string>>;
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
                <UserLogo />
                <input
                    type="text"
                    className="grow border-none focus:!border-none focus:outline-none focus:ring-0 my-2"
                    placeholder="User ID"
                    id="user_id"
                    disabled={isLoading && isServerRunning}
                    onChange={(e) => {
                        setId(e.target.value.toLowerCase());
                        if (userNotFoundError) setUserNotFoundError(""); // Clear error message
                    }}
                    value={id}
                    onKeyDown={handleKeyDown}  // Handle Enter key press here
                    required
                />
            </label>

            {userNotFoundError ?
                <p className="text-red-700 font-semibold mt-2">{userNotFoundError}</p> :
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
