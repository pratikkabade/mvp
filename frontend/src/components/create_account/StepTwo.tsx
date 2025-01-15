import { Button, TextInput, Spinner } from "flowbite-react";
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
            <TextInput
                type="password"
                placeholder="Set a strong Password"
                id="password_1"
                disabled={isLoading && isServerRunning}
                color={userExists ? "failure" : ""}
                className="input input-bordered my-2"
                onKeyDown={handleKeyDown_2}
                onChange={(e) => setPassword_1(e.target.value)}
                value={password_1}
                required
            />
            {userExists ?
                <p className="text-red-700 font-semibold mt-2">Username already exists</p> :
                <p className="opacity-0 font-semibold mt-2">BLANK</p>
            }
            <div className="flex flex-row justify-end items-center mt-6 gap-5">
                <div
                    onClick={() => setStep(1)}
                    className="flex font-medium focus:z-10 text-black rounded-full hover:bg-green-50 p-2.5 cursor-pointer items-center group uppercase"
                >
                    <ProfilePicture /> {id}
                    <span className="ml-2 text-xs flex flex-col opacity-0 group-hover:opacity-40 capitalize">Change</span>
                </div>
                <Button
                    pill
                    color="blue"
                    disabled={isLoading && isServerRunning && password_1 !== ''}
                    onClick={() => {
                        setStep(3);
                        setTimeout(() => document.getElementById('password_2')?.focus(), 100);
                    }}
                >
                    {isLoading ? <Spinner size="sm" /> : "Set password"}
                </Button>
            </div>
        </div>
    )
}
