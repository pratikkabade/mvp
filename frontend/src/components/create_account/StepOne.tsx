import { Button, TextInput, Spinner } from "flowbite-react";
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
            <TextInput
                type="text"
                placeholder="Set a new User ID"
                id="user_id"
                disabled={isLoading && isServerRunning && userExists}
                color={userExists ? "failure" : ""}
                className="input input-bordered my-2"
                onChange={(e) => {
                    setId(e.target.value.toLowerCase());
                    if (userExists) setUserExists(false);
                }}
                onKeyDown={handleKeyDown_1}  // Handle Enter key press here
                required
            />
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
                <Button
                    pill
                    color="blue"
                    disabled={id === ''}
                    onClick={() => checkUserExists(id)}
                >
                    {isLoading ? <Spinner size="sm" /> : "Check for username"}
                </Button>
            </div>
        </>
    )
}