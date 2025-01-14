import UserLogo from "../../assets/svg/UserLogo";
import { useUserManager } from "../../hooks/useUserManager";

export const StepOne = ({ setId, id, setPage, setStep }: any) => {
    const { isLoading, userNameError, checkUserNameError, setUserNameError } = useUserManager();
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            checkUserNameError(id, setStep);
        }
    };

    return (
        <>
            <label className={`input input-bordered my-2 flex items-center gap-2 ${userNameError ? "input-error ring-red-500" : ""}`}>
                <UserLogo />
                <input
                    className="grow border-none focus:outline-none focus:ring-0 my-2"
                    placeholder="Set a new User ID"
                    id="user_id"
                    onChange={(e) => {
                        setId(e.target.value.toLowerCase());
                        if (userNameError) setUserNameError("");
                    }}
                    value={id}
                    onKeyDown={handleKeyDown}
                    required
                />
            </label>

            {userNameError ? <p className="text-red-700 font-semibold mt-2">{userNameError}</p> : <p className="opacity-0 font-semibold mt-2">BLANK</p>}

            <div className="flex flex-row justify-end items-center mt-6 gap-5">
                <div onClick={() => setPage("login")} className="flex font-medium text-black rounded-full hover:bg-red-50 p-2.5 cursor-pointer">
                    Cancel creation
                </div>
                <button onClick={() => checkUserNameError(id, setStep)} className="btn btn-primary rounded-full">
                    {isLoading ? <span className="loading loading-spinner w-3 h-3"></span> : "Next"}
                </button>
            </div>
        </>
    );
};
