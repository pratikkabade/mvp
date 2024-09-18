import { ProfilePicture } from "../../assets/svg/ProfilePicture.tsx";

interface LogoAndGreetingProps {
    showLogin: boolean;
    setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
    logo: string;
    id: string;
    setId: React.Dispatch<React.SetStateAction<string>>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LogoAndGreeting: React.FC<LogoAndGreetingProps> = ({ showLogin, setShowLogin, logo, id, setId, setIsLoading }) => {
    return (
        <div className="slide-r flex flex-col items-end max-md:flex-row max-md:items-center max-md:w-full">
            <img src={logo} className="h-28 w-28 max-md:h-20" alt="Logo" />
            {showLogin ? (
                <div className="max-md:ml-5 md:text-right font-bold w-64">
                    <h1 className="text-5xl max-md:text-3xl mt-5 max-md:mt-0 p-1">Log in</h1>
                    <h1 className="text-2xl max-md:text-xl font-normal mt-2 p-1">Use your work account</h1>
                </div>
            ) : (
                <div className="max-md:ml-5 md:text-right font-bold w-64">
                    <h1 className="text-5xl max-md:text-3xl mt-5 max-md:mt-0 p-1">Welcome</h1>
                    <h1 className="text-2xl max-md:text-xl font-normal mt-2 p-1 pr-3 rounded-full hover:bg-base-200 border-2 border-base-200 cursor-pointer"
                        onClick={() => {
                            setIsLoading(true)
                            setTimeout(() => {
                                localStorage.removeItem('remembered_id')
                                setId('')
                                setShowLogin(true)
                                setIsLoading(false)
                            }, 3000)
                        }}>
                        <span className="flex flex-row justify-between items-center uppercase font-semibold">
                            <ProfilePicture />
                            {id}
                        </span>
                    </h1>
                </div>
            )}
        </div>
    )
}
