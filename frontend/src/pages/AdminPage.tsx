import React, { useState } from "react";
import { Link } from "react-router-dom";
import CreateContentWrapper from "../wrappers/CreateContentWrapper";
import UserAccessWrapper from "../wrappers/UserAccessWrapper";
import DeleteUserModal from "../components/admin/DeleteUserModal";
// import { useAdminData } from "../hooks/useAdminData"; // Import our new hook
import { useUserManager } from "../hooks/useUserManager";

export const AdminPage: React.FC = () => {
    // const {
    //     data,
    //     list,
    //     loading,
    //     access,
    //     error,
    //     updatingError,
    //     user,
    //     saveStatus,
    //     updateData,
    //     handleDeleteUser,
    //     setData
    // } = useAdminData();
    const {
        adminData: data, // Renamed to match new structure
        list,
        isLoading: loading, // Renamed
        access,
        adminError: error, // Renamed
        updatingError,
        user,
        saveStatus,
        updateData,
        handleDeleteUser,
        setAdminData: setData // Renamed
    } = useUserManager();
    

    const [userToDelete, setUserToDelete] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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

                            <div className="tooltip" data-tip={updatingError}>
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

                            <div className="tooltip" data-tip={key === user ? "You cannot delete yourself" : null}>
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