import PasswordLogo from "../../assets/svg/PasswordLogo";
import { useUserManager } from "../../hooks/useUserManager";

export const StepThree = ({ setPassword_2, password_2, password_1, id, setStep }: any) => {
    const { isLoading, passwordError, createUser } = useUserManager();

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            createUser(id, password_1, password_2, setStep);
        }
    };

    return (
        <div>
            <label className={`input input-bordered my-2 flex items-center gap-2`}>
                <PasswordLogo />
                <input
                    type="password"
                    placeholder="Re-Enter the Password"
                    id="password_2"
                    value={password_2}
                    className="grow border-none focus:outline-none focus:ring-0 my-2"
                    onChange={(e) => {
                        setPassword_2(e.target.value);
                        // setPasswordError(false);
                    }}
                    onKeyDown={handleKeyDown}
                    required
                />
            </label>
            {passwordError ? <p className="text-red-700 font-semibold mt-2">Passwords do not match</p> : <p className="opacity-0 font-semibold mt-2">BLANK</p>}

            <div className="flex flex-row justify-end items-center mt-6 gap-5">
                <div onClick={() => setStep(2)} className="flex font-medium text-black rounded-full hover:bg-blue-50 p-2.5 cursor-pointer">
                    Change password
                </div>
                <button onClick={() => createUser(id, password_1, password_2, setStep)} className="btn btn-primary rounded-full">
                    {isLoading ? <span className="loading loading-spinner w-3 h-3"></span> : "Create account"}
                </button>
            </div>
        </div>
    );
};
