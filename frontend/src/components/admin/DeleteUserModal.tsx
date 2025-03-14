import React, { useEffect, useState } from 'react';
import { ANIMATION_TIME_DELAY } from '../../constants/Constants';
import PasswordLogo from '../../assets/svg/PasswordLogo';
import { useUserManager } from '../../hooks/useUserManager';

interface DeleteUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: (userToDelete: string) => void;
    username: string;
    userToDelete: string;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
    isOpen,
    onClose,
    onDelete,
    username,
    userToDelete
}) => {
    const [password, setPassword] = useState<string>("");
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [deleteInProgress, setDeleteInProgress] = useState<boolean>(false);
    const [deleteSuccess, setDeleteSuccess] = useState<boolean>(false);

    // Use our custom hook for authentication logic
    const { 
        isLoading: authIsLoading, 
        passwordError, 
        checkPassword,
        resetErrors,    
        // Note: You'll need to use direct state updates since we don't expose individual setters
    } = useUserManager();
    
    

    // Handle password form submission on Enter key
    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (username) {
                await handleAuthentication();
            } else {
                resetErrors();
            }
        }
    };

    // Focus on password input when modal is opened
    useEffect(() => {
        setTimeout(() => document.getElementById('password')?.focus(), 100);
    }, [authIsLoading]);

    // Focus on password input when modal is authenticated
    useEffect(() => {
        if (isAuthenticated) {
            setTimeout(() => document.getElementById('cancel')?.focus(), 100);
        }
    }, [isAuthenticated]);

    // Handle authentication
    const handleAuthentication = async () => {
        if (username) {
            const result = await checkPassword(username, password);
            if (result.success) {
                setIsAuthenticated(true);
            }
            setTimeout(() => document.getElementById('password')?.focus(), 100);
        }
    };

    // Reset state when modal is closed
    const handleClose = () => {
        setPassword("");
        setIsAuthenticated(false);
        setDeleteSuccess(false);
        onClose();
    };

    // Handle user deletion with loading state
    const handleDelete = async () => {
        setDeleteInProgress(true);
        try {
            onDelete(userToDelete);
            setDeleteSuccess(true);
            // Auto close after successful deletion
            setTimeout(() => {
                handleClose();
            }, ANIMATION_TIME_DELAY);
        } catch (error) {
            console.error("Error during deletion:", error);
        } finally {
            setDeleteInProgress(false);
        }
    };

    if (!isOpen) return null;

    return (
        <dialog open className="modal modal-bottom sm:modal-middle backdrop-blur-md fade-in">
            <div className="modal-box">
                <button
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    onClick={handleClose}
                >
                    ✕
                </button>
                <h3 className="font-bold text-lg">Reauthenticate to continue</h3>
                {
                    !isAuthenticated ? (
                        <>
                            <p className="font-semibold pt-4 pb-2">Please reauthenticate to delete user</p>
                            <label className={`input input-bordered my-2 flex items-center gap-2 ${passwordError ? "input-error ring-red-500" : ""}`}>
                                <PasswordLogo />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    id="password"
                                    disabled={authIsLoading}
                                    className="grow border-none focus:!border-none focus:outline-none focus:ring-0 my-2"
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        // if (passwordError) setPasswordError(''); // Reset error when typing
                                        if (passwordError) resetErrors(); // Reset error when typing                                        
                                    }}
                                    onKeyDown={handleKeyDown}
                                    required
                                    autoFocus
                                />
                            </label>
                            {passwordError === '401' ?
                                <p className="text-red-700 font-semibold mt-2">Password is incorrect</p> :
                                passwordError === '403' ?
                                    <p className="text-red-700 font-semibold mt-2">Login is disabled for this user</p> :
                                    passwordError ?
                                        <p className="text-red-700 font-semibold mt-2">{passwordError}</p> :
                                        <p className="opacity-0 font-semibold mt-2">BLANK</p>
                            }
                            <button
                                className="btn btn-success text-base-100 w-full"
                                disabled={authIsLoading}
                                onClick={handleAuthentication}>
                                {authIsLoading ? (
                                    <span className="loading loading-spinner w-4 h-4"></span>
                                ) : (
                                    "Reauthenticate"
                                )}
                            </button>
                        </>
                    ) : deleteSuccess ? (
                        <>
                            <p className="text-green-600 font-semibold pt-4 pb-2">
                                User <b>{userToDelete}</b> has been successfully deleted!
                            </p>
                            <p className="text-gray-700 mb-4">
                                The page will refresh to show the updated user list.
                            </p>
                            <button
                                className="btn btn-primary text-base-100 w-full mt-4"
                                onClick={handleClose}
                            >
                                Close
                            </button>
                        </>
                    ) : (
                        <>
                            <p className="text-red-700 font-semibold pt-4 pb-2">
                                You are about to delete user: <b>{userToDelete}</b>
                            </p>
                            <p className="text-gray-700 mb-4">
                                This action cannot be undone. All user data will be permanently removed.
                            </p>
                            <div className="flex gap-2 mt-4">
                                <button
                                    className="btn flex-1"
                                    id='cancel'
                                    onClick={handleClose}
                                    disabled={deleteInProgress}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-error text-base-100 flex-1"
                                    id='delete'
                                    onClick={handleDelete}
                                    disabled={deleteInProgress}
                                >
                                    {deleteInProgress ? (
                                        <span className="loading loading-spinner w-4 h-4"></span>
                                    ) : (
                                        "Delete User"
                                    )}
                                </button>
                            </div>
                        </>
                    )}
            </div>
        </dialog>
    );
};

export default DeleteUserModal;