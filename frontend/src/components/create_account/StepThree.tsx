import { Button, TextInput, Spinner } from "flowbite-react";
import { CREATE_USER_URL } from "../../constants/URL";

export const StepThree = ({ isLoading, isServerRunning, userExists, setPassword_2, password_2, passwordError, setStep, setIsLoading, password_1, setPasswordError, id }: any) => {
    // Check for same password
    // const createUser = () => {

    // }
    const createUser = async (id: string, password_1: string) => {
        setIsLoading(true);
        if (password_1 !== password_2) {
            setPasswordError(true);
            setTimeout(() => { document.getElementById('password_2')?.focus() }, 100);
        } else {
            setPasswordError(false);
            try {
                setIsLoading(true);
                const BODY_TO_SEND = JSON.stringify({ "username": id, "password": password_1 })
                const response = await fetch(CREATE_USER_URL, {
                    method: 'POST',  // Change the method to POST
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: BODY_TO_SEND,
                });
                if (response.status === 201) {
                    setStep(4);
                } else {
                    setPasswordError(true);
                    console.error(response.text);
                }
            } finally {
                setIsLoading(false);
            }
        }
        setIsLoading(false);
    };
    const handleKeyDown_3 = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            createUser(id, password_1);
        }
    };
    return (
        <div>
            <TextInput
                type="password"
                placeholder="Re-Enter the Password"
                id="password_2"
                disabled={isLoading && isServerRunning}
                color={userExists ? "failure" : ""}
                className="input input-bordered my-2"
                onKeyDown={handleKeyDown_3}
                onChange={(e) => {
                    setPassword_2(e.target.value);
                    setPasswordError(false);
                }}
                value={password_2}
                required
            />
            {passwordError ?
                <p className="text-red-700 font-semibold mt-2">Passwords do not match</p> :
                <p className="opacity-0 font-semibold mt-2">BLANK</p>
            }
            <div className="flex flex-row justify-end items-center mt-6 gap-5">
                <div
                    onClick={() => setStep(2)}
                    className="flex font-medium focus:z-10 text-black rounded-full hover:bg-blue-50 p-2.5 cursor-pointer"
                >
                    Change password
                </div>
                <Button
                    pill
                    color="blue"
                    onClick={() => { createUser(id, password_1) }}
                >
                    {isLoading ? <Spinner size="sm" /> : "Create account"}
                </Button>
            </div>
        </div>
    )
}
