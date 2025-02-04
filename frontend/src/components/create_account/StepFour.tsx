import { useEffect } from "react";

export const StepFour = ({ userExists, setPage }: any) => {
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
                <button
                    color="blue"
                    id="login_button"
                    onClick={() => setPage('login')}
                    className="btn btn-primary rounded-full"
                >
                    Login
                </button>
            </div>
        </div>
    )
}
