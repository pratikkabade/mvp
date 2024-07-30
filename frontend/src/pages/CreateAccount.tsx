import { Button, TextInput, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { CREATE_USER_URL, USER_CHECK_URL } from "../constants/URL";
import { ProfilePicture } from "../assets/svg/ProfilePicture";

interface CreateAccountProps {
    setPage: React.Dispatch<React.SetStateAction<string>>;
    isServerRunning: boolean;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}


const StepOne = ({ isLoading, isServerRunning, userExists, setId, setUserExists, id, setPage, setIsLoading, setStep }: any) => {
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

const StepTwo = ({ isLoading, isServerRunning, userExists, setPassword_1, password_1, setStep, id }: any) => {
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


const StepThree = ({ isLoading, isServerRunning, userExists, setPassword_2, password_2, passwordError, setStep, setIsLoading, password_1, setPasswordError, id }: any) => {
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


const StepFour = ({ userExists, setPage }: any) => {
    useEffect(() => {
        document.getElementById('login_button')?.focus();
    }, [])
    return (
        <div>
            <h1 className="my-2 font-bold">Your account has been created <span className="text-emerald-600">Successfully!</span></h1>
            {userExists ?
                <p className="text-red-700 font-semibold mt-2">Username already exists</p> :
                <p className="opacity-0 font-semibold mt-2">BLANK</p>
            }
            <div className="flex flex-row justify-end items-center mt-6 gap-5">
                <Button
                    pill
                    color="blue"
                    id="login_button"
                    onClick={() => setPage('login')}
                >
                    Login
                </Button>
            </div>
        </div>
    )
}




export const CreateAccount: React.FC<CreateAccountProps> = ({
    setPage,
    isServerRunning,
    isLoading,
    setIsLoading,
}) => {
    const [id, setId] = useState('');
    const [userExists, setUserExists] = useState(false);
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
                    userExists={userExists}
                    setId={setId}
                    setUserExists={setUserExists}
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
                        userExists={userExists}
                        setPassword_1={setPassword_1}
                        password_1={password_1}
                        setStep={setStep}
                        id={id}
                    />
                    : step === 3 ?
                        <StepThree
                            isLoading={isLoading}
                            isServerRunning={isServerRunning}
                            userExists={userExists}
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
                                userExists={userExists}
                                setPage={setPage}
                            />
                            : null
            }
        </div>
    );
};
