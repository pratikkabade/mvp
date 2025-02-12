import { useEffect } from "react";

interface PasswordFormProps {
    isServerRunning: boolean;
    password: string;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    passwordError: string;
    setPasswordError: React.Dispatch<React.SetStateAction<string>>;
    rememberId: boolean;
    setRememberId: React.Dispatch<React.SetStateAction<boolean>>;
    saveLogin: (e: React.MouseEvent<HTMLButtonElement>) => void;
    isLoading: boolean;  // Pass isLoading state to handle the loading state
}

export const PasswordForm: React.FC<PasswordFormProps> = ({
    isServerRunning,
    password,
    setPassword,
    passwordError,
    setPasswordError,
    rememberId,
    setRememberId,
    saveLogin,
    isLoading,
}) => {

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            saveLogin(e as unknown as React.MouseEvent<HTMLButtonElement>);
        }
    };

    useEffect(() => {
    }, [isServerRunning])

    return (
        <div className="slide-r flex flex-col justify-end w-2/4 max-md:w-full ml-20 max-md:ml-0 max-md:mt-20">
            <label className={`input input-bordered my-2 flex items-center gap-2 ${passwordError ? "input-error ring-red-500" : ""}`}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70">
                    <path
                        fillRule="evenodd"
                        d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                        clipRule="evenodd" />
                </svg>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    id="password"
                    disabled={isLoading && isServerRunning}
                    color={passwordError ? "failure" : ""}
                    className="grow border-none focus:!border-none focus:outline-none focus:ring-0 my-2"
                    onChange={(e) => {
                        setPassword(e.target.value);
                        if (passwordError) setPasswordError(''); // Reset error when typing
                    }}
                    onKeyDown={handleKeyDown}
                    required

                />
            </label>

            {passwordError === '401' ?
                <p className="text-red-700 font-semibold mt-2">Password is incorrect</p> :
                passwordError === '403' ?
                    <p className="text-red-700 font-semibold mt-2">Login is disabled for this user</p> :
                    <p className="opacity-0 font-semibold mt-2">BLANK</p>
            }

            <div className="flex flex-row justify-end items-center space-x-5 mt-6">
                <label className="cursor-pointer p-2 px-3 bg-base-200 hover:bg-base-300 rounded-full">
                    <span className="mr-1">Remember me</span>
                    <input
                        type="checkbox"
                        checked={rememberId}
                        onChange={() => setRememberId(!rememberId)}
                    />
                </label>
                <button
                    color="blue"
                    onClick={saveLogin}
                    disabled={isLoading && isServerRunning}
                    className="btn btn-primary rounded-full"
                >
                    {isLoading ? <span className="loading loading-spinner w-3 h-3"></span> : "Login"}
                </button>
            </div>
        </div>
    );
};
