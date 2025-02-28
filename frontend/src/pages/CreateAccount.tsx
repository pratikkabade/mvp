import { useEffect, useState } from "react";
import { StepOne } from "../components/create_account/StepOne";
import { StepTwo } from "../components/create_account/StepTwo";
import { StepThree } from "../components/create_account/StepThree";
import { StepFour } from "../components/create_account/StepFour";

interface CreateAccountProps {
    setPage: React.Dispatch<React.SetStateAction<string>>;
    isServerRunning: boolean;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CreateAccount: React.FC<CreateAccountProps> = ({
    setPage,
    isServerRunning,
    isLoading,
    setIsLoading,
}) => {
    const [id, setId] = useState('');
    const [step, setStep] = useState(1);
    const [password_1, setPassword_1] = useState('');
    const [password_2, setPassword_2] = useState('');
    const [passwordError, setPasswordError] = useState(false);

    useEffect(() => {
        setTimeout(() => { document.getElementById('user_id')?.focus() }, 100);
        setTimeout(() => { document.getElementById('password_1')?.focus() }, 100);
        setTimeout(() => { document.getElementById('password_2')?.focus() }, 100);
    }, [step, isServerRunning]);

    return (
        <div className="slide-r flex flex-col justify-end w-2/4 max-md:w-full ml-20 max-md:ml-0 max-md:mt-20">
            {step === 1 ?
                <StepOne
                    isLoading={isLoading}
                    isServerRunning={isServerRunning}
                    setId={setId}
                    id={id}
                    setPage={setPage}
                    setIsLoading={setIsLoading}
                    setStep={setStep}
                />
                :
                step === 2 ?
                    <StepTwo
                        isLoading={isLoading}
                        isServerRunning={isServerRunning}
                        setPassword_1={setPassword_1}
                        password_1={password_1}
                        setStep={setStep}
                        id={id}
                    />
                    : step === 3 ?
                        <StepThree
                            isLoading={isLoading}
                            isServerRunning={isServerRunning}
                            setPassword_2={setPassword_2}
                            password_2={password_2}
                            passwordError={passwordError}
                            setStep={setStep}
                            setIsLoading={setIsLoading}
                            password_1={password_1}
                            setPasswordError={setPasswordError}
                            id={id}
                        />
                        : step === 4 ?
                            <StepFour
                                setPage={setPage}
                            />
                            : null
            }
        </div>
    );
};
