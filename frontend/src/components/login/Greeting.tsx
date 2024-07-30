import { ProfilePicture } from "../../assets/svg/ProfilePicture.tsx";

interface LogoAndGreetingProps {
    page: string;
    setPage: React.Dispatch<React.SetStateAction<string>>;
    logo: string;
    id: string;
    setId: React.Dispatch<React.SetStateAction<string>>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LogoAndGreeting: React.FC<LogoAndGreetingProps> = ({ page, setPage, logo, id, setId, setIsLoading }) => {
    return (
        <div className="slide-r flex flex-col items-end max-md:flex-row max-md:items-center max-md:w-full">
            <img src={logo} className="h-28 w-28 max-md:h-20 rounded-xl" alt="Logo" />
            {page === 'login' ? (
                <div className="max-md:ml-5 md:text-right font-bold w-64">
                    <h1 className="text-5xl max-md:text-3xl mt-5 max-md:mt-0 p-1">Log in</h1>
                    <h1 className="text-2xl max-md:text-xl font-normal mt-2 p-1">Use your work account</h1>
                </div>
            ) : page === 'password' ? (
                <div className="max-md:ml-5 md:text-right font-bold w-64">
                    <h1 className="text-5xl max-md:text-3xl mt-5 max-md:mt-0 p-1">Welcome</h1>
                    <h1 className="text-2xl max-md:text-xl font-normal mt-2 p-1 pr-3 rounded-full hover:bg-base-200 border-2 border-base-200 cursor-pointer"
                        onClick={() => {
                            setIsLoading(true)
                            setTimeout(() => {
                                localStorage.removeItem('remembered_id')
                                setId('')
                                setPage('login')
                                setIsLoading(false)
                            }, 3000)
                        }}>
                        <span className="flex flex-row justify-between items-center uppercase font-semibold">
                            <ProfilePicture />
                            {id}
                        </span>
                    </h1>
                </div>
            ) : page === 'create-account' ? (
                <div className="max-md:ml-5 md:text-right font-bold w-64">
                    <h1 className="text-5xl max-md:text-3xl mt-5 max-md:mt-0 p-1">Create</h1>
                    <h1 className="text-2xl max-md:text-xl font-normal mt-2 p-1">Your new account</h1>
                </div>
            ) : null}
        </div>
    )
}
