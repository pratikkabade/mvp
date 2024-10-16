import React, { useEffect, useState } from "react";
import { ADMIN_USER_DATA_URL, ADMIN_USER_UPDATE_URL, DELETE_USER_URL } from "../constants/URL";
import { PrivilegeCheck, PrivilegeCheckParams } from "../utility/CheckAccess";
import CreateContentWrapper from "../wrappers/CreateContentWrapper";
import { Link } from "react-router-dom";
import UserAccessWrapper from "../wrappers/UserAccessWrapper";
import { ANIMATION_TIME_DELAY } from "../constants/Constants";
import DeleteUserModal from "../components/admin/DeleteUserModal";

interface UpdateUserApiResponse {
    message: string;
    error: string;
}

interface UserData {
    [key: string]: string[];
}

export const AdminPage: React.FC = () => {
    const [data, setData] = useState<UserData | null>(null);
    const [list, setList] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isAdmin, setIsAdmin] = useState<boolean>(true);
    const [access, setAccess] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [updatingError, setUpdatingError] = useState<string | null>(null);
    const [user, setUser] = useState<string | null>(null);
    const [userID, setUserID] = useState<string | null>(null);
    const [saveStatus, setSaveStatus] = useState<Record<string, string>>({});
    const [userToDelete, setUserToDelete] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0); // Add state to trigger refreshes

    // Function to refresh user data
    const refreshUserData = async () => {
        if (!userID) return;

        try {
            setLoading(true);
            const BODY_TO_SEND = JSON.stringify({ user_id: userID });
            const response = await fetch(ADMIN_USER_DATA_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: BODY_TO_SEND,
            });

            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }

            const result = await response.json();
            if ('message' in result) {
                console.error('User has no access');
            } else {
                setAccess(true);
                setData(result);
            }
        } catch (error: any) {
            const errorMessage =
                error instanceof Error ? error.message : "An unknown error occurred";
            setError(errorMessage);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, ANIMATION_TIME_DELAY);
        }
    };

    useEffect(() => {
        const _user = localStorage.getItem("remembered_logged_id");
        const _user_id = localStorage.getItem("user_id");
        if (_user && _user.trim() !== "") {
            setUser(_user);
            setUserID(_user_id);
        } else {
            setError("No user found. Please log in.");
        }
    }, []);

    useEffect(() => {
        if (!user || !userID) return;

        const checkPrivileges = async () => {
            try {
                setLoading(true);
                const hasAdminPrivilege = await PrivilegeCheck({ user, userID, PRIVILEGE_REQUIRED: "admin" } as PrivilegeCheckParams);
                setIsAdmin(hasAdminPrivilege);
                setAccess(hasAdminPrivilege);
                if (!isAdmin) return;
            } catch (error) {
                setError("Failed to check privileges.");
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, ANIMATION_TIME_DELAY);
            }
        };

        if (user) {
            checkPrivileges();
        }

        refreshUserData();
    }, [user, userID, isAdmin, refreshTrigger]); // Add refreshTrigger to dependencies

    useEffect(() => {
        if (!data) return;

        const newList: string[] = [];
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                // Ensure data[key] is an array before trying to spread it
                if (Array.isArray(data[key])) {
                    newList.push(...data[key]);
                }
            }
        }

        // Create a unique list using Set and convert back to array properly
        const uniqueList = Array.from(new Set(newList));
        setList(uniqueList);
    }, [data]);

    const updateData = async (user_to_change: string, userData: string[]) => {
        try {
            setSaveStatus((prev) => ({ ...prev, [user_to_change]: "saving" }));
            setUpdatingError(null);
            const BODY_TO_SEND = JSON.stringify({
                user_id: userID,
                user_to_change,
                new_privileges: { privileges: userData }
            });

            const response = await fetch(ADMIN_USER_UPDATE_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: BODY_TO_SEND,
            });
            const result: UpdateUserApiResponse = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to update user");
            }

            if ('message' in result) {
                setSaveStatus((prev) => ({ ...prev, [user_to_change]: "saved" }));
                setError(null);
                setTimeout(() => {
                    setSaveStatus((prev) => ({ ...prev, [user_to_change]: "" }));
                }, ANIMATION_TIME_DELAY);
            } else {
                setSaveStatus((prev) => ({ ...prev, [user_to_change]: "error" }));
                setUpdatingError("Failed to update user privileges");
            }
        } catch (error: any) {
            setSaveStatus((prev) => ({ ...prev, [user_to_change]: "error" }));
            const errorMessage =
                error instanceof Error ? error.message : "An unknown error occurred";
            setUpdatingError(errorMessage);
        }
    };

    const handleDeleteUser = async (user_to_delete: string) => {
        try {
            const BODY_TO_SEND = JSON.stringify({ user_id: userID, user_to_delete });
            const response = await fetch(DELETE_USER_URL, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: BODY_TO_SEND,
            });

            if (!response.ok) {
                throw new Error("Failed to delete user");
            }

            // Instead of trying to parse and set data directly,
            // close the modal and trigger a refresh
            setIsModalOpen(false);

            // Use a timeout to give the API time to process before we refetch
            setTimeout(() => {
                // Trigger a refresh by incrementing refreshTrigger
                setRefreshTrigger(prev => prev + 1);
            }, 500);

            return true; // Return success for the DeleteUserModal
        } catch (error: any) {
            const errorMessage =
                error instanceof Error ? error.message : "An unknown error occurred";
            setError(errorMessage);
            return false; // Return failure for the DeleteUserModal
        }
    };

    const openDeleteModal = (username: string) => {
        setUserToDelete(username);
        setIsModalOpen(true);
    };

    if (loading) return (
        <div className="h-screen pt-20">
            <ul className="flex flex-row flex-wrap gap-10 p-10 z-0 w-full overflow-y-scroll">
                {Array.from({ length: 5 }).map((_, k) => (
                    <UserAccessWrapper key={k}></UserAccessWrapper>
                ))}
            </ul>
        </div>
    );

    if (user === null) return (
        <div className="h-screen pt-20 flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold mb-10">
                Please sign in to see the details.
            </h1>
            <CreateContentWrapper privacy={'null'}>
                <Link to={'/PRM/Login'} className="btn btn-primary text-white">
                    Sign in
                </Link>
            </CreateContentWrapper>
        </div>
    );

    if (!access) return (
        <div className="h-screen pt-20 flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold mb-10">
                User has <span className="text-red-600">no Access.</span>
            </h1>
        </div>
    );

    if (error) return (
        <div className="h-screen pt-20 flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold mb-10">
                Error: <span className="text-red-600">{error}</span>
            </h1>
        </div>
    );

    return (
        <div className="h-screen pt-20">
            {data && (
                <ul className="flex flex-row flex-wrap gap-10 p-10 z-0 w-full overflow-y-scroll">
                    {Object.entries(data).map(([key, value]) => (
                        <UserAccessWrapper key={key}>
                            <strong className="text-xl slide-down">{key}</strong>
                            <div className="flex flex-col slide-down">
                                {list
                                    .sort()
                                    .map((item, k) => {
                                        // Ensure value is an array before using includes
                                        const isIncluded = Array.isArray(value) && value.includes(item);

                                        return (
                                            <div key={k}>
                                                <label className="inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={isIncluded}
                                                        onChange={(e) => {
                                                            if (!Array.isArray(value)) return;

                                                            const checked = e.target.checked;
                                                            const newValue = checked
                                                                ? [...value, item]
                                                                : value.filter((x) => x !== item);

                                                            setData((prev) => prev ? ({
                                                                ...prev,
                                                                [key]: newValue,
                                                            }) : null);
                                                        }}
                                                    />
                                                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600">
                                                    </div>

                                                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                        {item}
                                                    </span>
                                                </label>
                                            </div>
                                        );
                                    })}
                            </div>

                            <div className="tooltip !z-50" data-tip={updatingError}>
                                <button
                                    className={`btn text-white btn-sm w-full ${saveStatus[key] === "error" ? 'btn-error' : 'btn-success'}`}
                                    onClick={() => {
                                        const userData = Array.isArray(value) ? value : [];
                                        updateData(key, userData);
                                    }}
                                >
                                    {saveStatus[key] ? (
                                        <span className="ml-2">
                                            {saveStatus[key] === "saving"
                                                ? <span className="loading loading-spinner w-4 h-4"></span>
                                                : saveStatus[key] === "saved"
                                                    ? "Saved!"
                                                    : "Error"}
                                        </span>
                                    ) : (<span>Save</span>)}
                                </button>
                            </div>

                            <div className="tooltip !z-50" data-tip={key === user ? "You cannot delete yourself" : null}>
                                <button
                                    className="btn text-white btn-sm w-full btn-error -mt-2"
                                    disabled={key === user}
                                    onClick={() => openDeleteModal(key)}
                                >
                                    Delete User
                                </button>
                            </div>
                        </UserAccessWrapper>
                    ))}
                </ul>
            )}

            {isModalOpen && (
                <DeleteUserModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onDelete={handleDeleteUser}
                    username={user || ""}
                    userToDelete={userToDelete || ""}
                />
            )}
        </div>
    );
};