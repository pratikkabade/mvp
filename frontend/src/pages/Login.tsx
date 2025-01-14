import { useEffect, useState } from "react";
import defaultLogo from "../assets/icons/logo.png";
import { LogoAndGreeting } from "../components/login/Greeting.tsx";
import { LoginForm } from "../components/login/LoginForm.tsx";
import { PasswordForm } from "../components/login/PasswordForm.tsx";
import { useNavigate } from "react-router";
import { LOGO_URL } from "../constants/URL.tsx";
import { setFavicon } from "../utility/Favicon.ts";
import { serverHealth } from "../utility/serverHealth.ts";
import { CreateAccount } from "./CreateAccount.tsx";
import { useUserManager } from "../hooks/useUserManager.ts";

export const Login = () => {
    const [page, setPage] = useState('login');
    const [id, setId] = useState(localStorage.getItem('remembered_id') || '');
    const [password, setPassword] = useState('');
    const [rememberId, setRememberId] = useState(true);
    const [status, setStatus] = useState(false);
    const [logo, setLogo] = useState(defaultLogo);
    // Create a local loading state to pass to components that need a setter
    const [localLoading, setLocalLoading] = useState(false);

    // Use the hook and destructure the values we need
    const { 
        isLoading, 
        userNotFoundError, 
        passwordError, 
        checkUserExists, 
        checkPassword, 
        resetErrors 
    } = useUserManager();

    // Synchronize the local loading state with the hook's loading state
    useEffect(() => {
        setLocalLoading(isLoading);
    }, [isLoading]);

    const navigate = useNavigate();

    // Fetch system status from backend
    const fetchStatus = async () => {
        const isServerUp = await serverHealth();
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
            setPage('password');
        }
    }, [status, logo]);

    useEffect(() => {
        setTimeout(() => document.getElementById('password')?.focus(), 100);
        setTimeout(() => document.getElementById('user_id')?.focus(), 100);
    }, [page]);

    // Handle login button click
    const nextLogin = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const userExists = await checkUserExists(id);
        if (userExists) {
            setPage('password');
            setTimeout(() => document.getElementById('password')?.focus(), 100);
        } else {
            setTimeout(() => document.getElementById('user_id')?.focus(), 100);
        }
    };

    // Navigate based on user role
    const navigateToDashboard = (id: string) => {
        if (id === '') {
            navigate('/PRM/');
        } else {
            navigate('/PRM/');
        }
    };

    // Handle password form submission
    const saveLogin = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const result = await checkPassword(id, password);
        
        if (result.success) {
            const userId = result.userId;
            if (rememberId) {
                localStorage.setItem('remembered_id', id);
                localStorage.setItem('remembered_logged_id', id);
                if (userId) localStorage.setItem('user_id', userId);
            }
            navigateToDashboard(id);
        } else {
            setTimeout(() => document.getElementById('password')?.focus(), 100);
        }
    };

    // Convert passwordError to string to match PasswordForm expectations
    const stringPasswordError = typeof passwordError === 'boolean' 
        ? passwordError ? 'Invalid password' : '' 
        : passwordError;

    return (
        <div className="h-screen flex justify-center items-center z-10 bg-base-00">
            <div className={`flex shadow-md p-10 justify-center items-center ${isLoading ? 'bg-base-200 animate-pulse blurred-content-light' : 'bg-base-200'} rounded-3xl w-3/4 xl:w-7/12 max-lg:w-full flex-row max-md:flex-col h-fit`}>
                <LogoAndGreeting
                    page={page}
                    setPage={setPage}
                    setIsLoading={setLocalLoading}
                    logo={logo}
                    id={id}
                    setId={setId}
                />
                {page === 'login' ? (
                    <LoginForm
                        setPage={setPage}
                        isServerRunning={status}
                        id={id}
                        setId={setId}
                        userNotFoundError={userNotFoundError}
                        setUserNotFoundError={() => resetErrors()}
                        nextLogin={nextLogin}
                        isLoading={isLoading}
                    />
                ) : page === 'password' ? (
                    <PasswordForm
                        isServerRunning={status}
                        password={password}
                        setPassword={setPassword}
                        passwordError={stringPasswordError}
                        setPasswordError={() => resetErrors()}
                        rememberId={rememberId}
                        setRememberId={setRememberId}
                        saveLogin={saveLogin}
                        isLoading={isLoading}
                    />
                ) :
                    page === 'create-account' ? (
                        <CreateAccount
                            setPage={setPage}
                            isServerRunning={status}
                            isLoading={localLoading}
                            setIsLoading={setLocalLoading}
                        />
                    ) : null}
            </div>
        </div>
    );
};