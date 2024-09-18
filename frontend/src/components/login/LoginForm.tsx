import { Button, TextInput, Spinner } from "flowbite-react";
import { useEffect } from "react";

interface LoginFormProps {
    isServerRunning: boolean;
    id: string;
    setId: React.Dispatch<React.SetStateAction<string>>;
    userNotFoundError: boolean;
    setUserNotFoundError: React.Dispatch<React.SetStateAction<boolean>>;
    nextLogin: (e: React.MouseEvent<HTMLButtonElement>) => void;
    isLoading: boolean;  // Pass isLoading state to handle the loading state
}

export const LoginForm: React.FC<LoginFormProps> = ({
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
            <TextInput
                type="text"
                placeholder="User ID"
                id="user_id"
                disabled={isLoading && isServerRunning}
                color={userNotFoundError ? "failure" : ""}
                className="input input-bordered my-2"
                onChange={(e) => {
                    setId(e.target.value.toLowerCase());
                    if (userNotFoundError) setUserNotFoundError(false); // Reset error when typing
                }}
                value={id}
                onKeyDown={handleKeyDown}  // Handle Enter key press here
                required
            />
            {userNotFoundError ?
                <p className="text-red-700 font-semibold mt-2">User not found</p> :
                <p className="text-white font-semibold mt-2">BLANK</p>
            }

            <div className="flex flex-row justify-end items-center mt-6 gap-5">
                <div
                    className="flex font-medium focus:z-10 text-black rounded-full hover:bg-blue-50 p-2.5 hover:cursor-not-allowed"
                >
                    Create new account
                </div>
                <Button
                    pill
                    color="blue"
                    onClick={nextLogin}
                    disabled={isLoading && isServerRunning}
                >
                    {isLoading ? <Spinner size="sm" /> : "Next"}
                </Button>
            </div>
        </div>
    );
};
