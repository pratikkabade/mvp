import React, { useState } from 'react';
import { USER_PASSWORD_URL } from '../../constants/URL';
import PasswordLogo from '../../assets/svg/PasswordLogo';

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
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [authIsLoading, setAuthIsLoading] = useState<boolean>(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [deleteInProgress, setDeleteInProgress] = useState<boolean>(false);
    const [deleteSuccess, setDeleteSuccess] = useState<boolean>(false);

    // Check if password is correct
    const checkPassword = async (id: string, password: string) => {
        try {
            setAuthIsLoading(true);
            const BODY_TO_SEND = JSON.stringify({ username: id, password: password })
            const response = await fetch(USER_PASSWORD_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: BODY_TO_SEND,
            });

            if (response.ok) {
                setPasswordError(null);
                setIsAuthenticated(true);
            } else {
                console.log(response.status);
                setPasswordError(response.status.toString());
                setTimeout(() => document.getElementById('password')?.focus(), 100);
            }
        } catch (error) {
            console.error("Error checking password:", error);
            setPasswordError("An error occurred while verifying your password");
        } finally {
            setAuthIsLoading(false);
        }
    };

    // Handle password form submission on Enter key
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (username) {
                checkPassword(username, password);
            } else {
                setPasswordError("No remembered logged ID found.");
            }
        }
    };

    // Reset state when modal is closed
    const handleClose = () => {
        setPassword("");
        setPasswordError(null);
        setIsAuthenticated(false);
        setDeleteSuccess(false);
        onClose();
    };

    // Handle user deletion with loading state
    const handleDelete = async () => {
        setDeleteInProgress(true);
        try {
            await onDelete(userToDelete);
            setDeleteSuccess(true);

            // Auto close after successful deletion
            setTimeout(() => {
                handleClose();
            }, 1500);
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
                                        if (passwordError) setPasswordError(null); // Reset error when typing
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
                                onClick={() => {
                                    if (username) {
                                        checkPassword(username, password);
                                    }
                                }}>
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
                                    onClick={handleClose}
                                    disabled={deleteInProgress}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-error text-base-100 flex-1"
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