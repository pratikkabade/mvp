import { USER_CHECK_URL } from "../../constants/URL";

export const StepOne = ({ isLoading, isServerRunning, userExists, setId, setUserExists, id, setPage, setIsLoading, setStep }: any) => {
    // Check if user exists in the system
    const checkUserExists = async (id: string) => {
        try {
            setIsLoading(true);
            const BODY_TO_SEND = JSON.stringify({ username: id })
            const response = await fetch(USER_CHECK_URL, {
                method: 'POST',  // Change the method to POST
                headers: {
                    'Content-Type': 'application/json',
                },
                body: BODY_TO_SEND,
            });

            if (response.status === 200 || response.status === 400) {
                setUserExists(true);
                setTimeout(() => document.getElementById('user_id')?.focus(), 100);
            } else {
                setStep(2);
                setUserExists(false);
                setTimeout(() => document.getElementById('password_1')?.focus(), 100);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown_1 = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            setTimeout(() => checkUserExists(id), 0);
        }
    };
    return (
        <>
            <label className={`input input-bordered my-2 flex items-center gap-2 ${userExists ? "input-error ring-red-500" : ""}`}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70">
                    <path
                        d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input
                    className="grow border-none focus:!border-none focus:outline-none focus:ring-0 my-2"
                    placeholder="Set a new User ID"
                    id="user_id"
                    disabled={isLoading && isServerRunning && userExists}
                    color={userExists ? "failure" : ""}
                    onChange={(e) => {
                        setId(e.target.value.toLowerCase());
                        if (userExists) setUserExists(false);
                    }}
                    value={id}
                    onKeyDown={handleKeyDown_1}  // Handle Enter key press here
                    required
                />
            </label>

            {
                userExists ?
                    <p className="text-red-700 font-semibold mt-2">Username already exists</p> :
                    <p className="opacity-0 font-semibold mt-2">BLANK</p>
            }

            <div className="flex flex-row justify-end items-center mt-6 gap-5">
                <div
                    onClick={() => setPage("login")}
                    className="flex font-medium focus:z-10 text-black rounded-full hover:bg-red-50 p-2.5 cursor-pointer"
                >
                    Cancel creation
                </div>
                <button
                    color="blue"
                    onClick={() => checkUserExists(id)}
                    disabled={isLoading && isServerRunning}
                    className="btn btn-primary rounded-full"
                >
                    {isLoading ? <span className="loading loading-spinner w-3 h-3"></span> : "Next"}
                </button>

            </div>
        </>
    )
}