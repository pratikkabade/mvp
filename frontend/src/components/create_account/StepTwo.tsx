import PasswordLogo from "../../assets/svg/PasswordLogo";
import ProfilePicture from "../../assets/svg/ProfilePicture";

export const StepTwo = ({ isLoading, isServerRunning, setPassword_1, password_1, setStep, id }: any) => {
    const handleKeyDown_2 = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            setTimeout(() => setStep(3), 0);
        }
    };
    return (
        <div>
            <label className={`input input-bordered my-2 flex items-center gap-2`}>
                <PasswordLogo />
                <input
                    type="password"
                    placeholder="Set a strong Password"
                    id="password_1"
                    value={password_1}
                    disabled={isLoading && isServerRunning}
                    className="grow border-none focus:!border-none focus:outline-none focus:ring-0 my-2"
                    onChange={(e) => setPassword_1(e.target.value)}
                    onKeyDown={handleKeyDown_2}
                    required
                />
            </label>
            <p className="opacity-0 font-semibold mt-2">BLANK</p>
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
