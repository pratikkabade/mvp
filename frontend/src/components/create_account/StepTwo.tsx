import { ProfilePicture } from "../../assets/svg/ProfilePicture";

export const StepTwo = ({ isLoading, isServerRunning, userExists, setPassword_1, password_1, setStep, id }: any) => {
    const handleKeyDown_2 = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            setTimeout(() => setStep(3), 0);
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
                    placeholder="Set a strong Password"
                    id="password_1"
                    value={password_1}
                    disabled={isLoading && isServerRunning}
                    color={userExists ? "failure" : ""}
                    className="grow border-none focus:!border-none focus:outline-none focus:ring-0 my-2"
                    onChange={(e) => setPassword_1(e.target.value)}
                    onKeyDown={handleKeyDown_2}
                    required
                />
            </label>
            {userExists ?
                <p className="text-red-700 font-semibold mt-2">Username already exists</p> :
                <p className="opacity-0 font-semibold mt-2">BLANK</p>
            }
            <div className="flex flex-row justify-end items-center mt-6 gap-5">
                <div
                    onClick={() => setStep(1)}
                    className="flex font-medium focus:z-10 text-black rounded-full hover:bg-green-50 p-2.5 cursor-pointer items-center group uppercase"
                >
                    <ProfilePicture /> <span className="ml-2">{id}</span>
                    <span className="ml-2 text-xs flex flex-col opacity-0 group-hover:opacity-40 capitalize">Change</span>
                </div>

                <button
                    color="blue"
                    onClick={() => {
                        setStep(3);
                        setTimeout(() => document.getElementById('password_2')?.focus(), 100);
                    }}
                    disabled={isLoading && isServerRunning && password_1 !== ''}
                    className="btn btn-primary rounded-full"
                >
                    {isLoading ? <span className="loading loading-spinner w-3 h-3"></span> : "Set password"}
                </button>

            </div>
        </div>
    )
}
