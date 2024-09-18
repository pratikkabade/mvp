import { useEffect, useState } from "react";
import defaultLogo from "../assets/icons/logo.png";
import { LogoAndGreeting } from "../components/login/Greeting.tsx";
import { LoginForm } from "../components/login/LoginForm.tsx";
import { PasswordForm } from "../components/login/PasswordForm.tsx";
import { useNavigate } from "react-router";
import { LOGO_URL, USER_CHECK_URL, USER_PASSWORD_URL } from "../constants/URL.tsx";
import { setFavicon } from "../utility/Favicon.ts";
import { fetchServerStatus } from "../utility/CheckServerStatus.ts";

export const Login = () => {
    const [showLogin, setShowLogin] = useState(true);
    const [id, setId] = useState(localStorage.getItem('remembered_id') || '');
    const [password, setPassword] = useState('');
    const [userNotFoundError, setUserNotFoundError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [rememberId, setRememberId] = useState(true);
    const [status, setStatus] = useState(false);
    const [logo, setLogo] = useState(defaultLogo);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    // Fetch system status from backend
    const fetchStatus = async () => {
        const isServerUp = await fetchServerStatus();
        setStatus(isServerUp);
    };

    // Update the logo and favicon based on system status
    useEffect(() => {
        fetchStatus();
        if (status) {
            setLogo(LOGO_URL);
        }
        setFavicon(logo);
        status && setTimeout(() => document.getElementById('user_id')?.focus(), 2500);
        document.getElementById('password')?.focus()
        if (id !== '') {
            setShowLogin(false)
        }
    }, [status, logo]);

    // Check if user exists in the system
    const checkUserExists = async (id: string) => {
        try {
            setIsLoading(true);
            const response = await fetch(USER_CHECK_URL(id));
            if (response.ok) {
                setUserNotFoundError(false);
                setShowLogin(false); // Switch to password form
                setTimeout(() => document.getElementById('password')?.focus(), 100);
            } else {
                setUserNotFoundError(true); // Show user not found error
                setTimeout(() => document.getElementById('user_id')?.focus(), 100);
            }
        } catch (error) {
            console.error("Error checking user existence:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setTimeout(() => document.getElementById('password')?.focus(), 100);
        setTimeout(() => document.getElementById('user_id')?.focus(), 100);
    }, [showLogin])

    // Handle login button click
    const nextLogin = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setTimeout(() => checkUserExists(id), 0);
    };

    // Check if password is correct
    const checkPassword = async (id: string, password: string) => {
        try {
            setIsLoading(true);
            const response = await fetch(USER_PASSWORD_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, password }),
            });

            if (response.ok) {
                if (rememberId) {
                    localStorage.setItem('remembered_id', id);
                    localStorage.setItem('remembered_logged_id', id);                    
                }
                navigateToDashboard(id);
            } else {
                setPasswordError(true);
                setTimeout(() => document.getElementById('password')?.focus(), 100);
            }
        } catch (error) {
            console.error("Error checking password:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Navigate based on user role
    const navigateToDashboard = (id: string) => {
        if (id === '') {
            navigate('/');
        } else {
            navigate('/');
        }
    };

    // Handle password form submission
    const saveLogin = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setTimeout(() => checkPassword(id, password), 0);
    };

    return (
        <div className="h-screen flex justify-center items-center font-sans -mt-24">
            <div className={`flex shadow-md p-10 justify-center items-center ${isLoading ? 'bg-slate-50 animate-pulse blurred-content-light' : 'bg-white'} rounded-3xl w-3/4 xl:w-7/12 max-lg:w-full flex-row max-md:flex-col h-fit`}>
                <LogoAndGreeting
                    showLogin={showLogin}
                    setShowLogin={setShowLogin}
                    setIsLoading={setIsLoading}
                    logo={logo}
                    id={id}
                    setId={setId}
                />
                {showLogin ? (
                    <LoginForm
                        isServerRunning={status}
                        id={id}
                        setId={setId}
                        userNotFoundError={userNotFoundError}
                        setUserNotFoundError={setUserNotFoundError}
                        nextLogin={nextLogin}
                        isLoading={isLoading} // Pass loading state for UI feedback
                    />
                ) : (
                    <PasswordForm
                        isServerRunning={status}
                        password={password}
                        setPassword={setPassword}
                        passwordError={passwordError}
                        setPasswordError={setPasswordError}
                        rememberId={rememberId}
                        setRememberId={setRememberId}
                        saveLogin={saveLogin}
                        isLoading={isLoading} // Pass loading state for UI feedback
                    />
                )}
            </div>
        </div>
    );
};
