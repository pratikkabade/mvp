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
            <label className={`input input-bordered my-2 flex items-center gap-2 ${userExists ? "input-error ring-red-500" : ""}`}>
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
                    placeholder="Re-Enter the Password"
                    id="password_2"
                    disabled={isLoading && isServerRunning}
                    color={userExists ? "failure" : ""}
                    value={password_2}
                    className="grow border-none focus:!border-none focus:outline-none focus:ring-0 my-2"
                    onChange={(e) => {
                        setPassword_2(e.target.value);
                        setPasswordError(false);
                    }}
                    onKeyDown={handleKeyDown_3}
                    required
                />
            </label>
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
                <button
                    color="blue"
                    onClick={() => { createUser(id, password_1) }}
                    className="btn btn-primary rounded-full"
                >
                    {isLoading ? <span className="loading loading-spinner w-3 h-3"></span> : "Create account"}
                </button>
            </div>
        </div>
    )
}
