import { Button, TextInput, Spinner } from "flowbite-react";
import { useEffect } from "react";

interface PasswordFormProps {
    isServerRunning: boolean;
    password: string;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    passwordError: boolean;
    setPasswordError: React.Dispatch<React.SetStateAction<boolean>>;
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
            <TextInput
                type="password"
                placeholder="Password"
                value={password}
                id="password"
                disabled={isLoading && isServerRunning}
                color={passwordError ? "failure" : ""}
                className={`input input-bordered my-2 ${passwordError ? "input-error ring-red-500" : ""}`}
                onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError(false); // Reset error when typing
                }}
                onKeyDown={handleKeyDown}
                required
            />
            {passwordError ?
                <p className="text-red-700 font-semibold mt-2">Password is incorrect</p> :
                <p className="text-white font-semibold mt-2">BLANK</p>
            }

            <div className="flex flex-row justify-end items-center space-x-5 mt-6">
                <label className="cursor-pointer border-2 border-white hover:bg-slate-100 p-1 rounded-md">
                    <span className="mr-1">Remember me</span>
                    <input
                        type="checkbox"
                        checked={rememberId}
                        onChange={() => setRememberId(!rememberId)}
                    />
                </label>
                <Button
                    pill
                    color="blue"
                    onClick={saveLogin}
                    disabled={isLoading && isServerRunning}  // Disable button during loading state
                >
                    {isLoading ? <Spinner size="sm" /> : "Login"}
                </Button>
            </div>
        </div>
    );
};
