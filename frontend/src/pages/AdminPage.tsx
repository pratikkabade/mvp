import React, { useEffect, useState } from "react";
import { ADMIN_USER_DATA_URL, ADMIN_USER_UPDATE_URL } from "../constants/URL";
import { PrivilegeCheck, PrivilegeCheckParams } from "../utility/CheckAccess";
import CreateContentWrapper from "../wrappers/CreateContentWrapper";
import { Link } from "react-router-dom";
import UserAccessWrapper from "../wrappers/UserAccessWrapper";
import { ANIMATION_TIME_DELAY } from "../constants/Constants";

interface UpdateUserApiResponse {
    message: string;
    error: string;
}

export const AdminPage: React.FC = () => {
    const [data, setData] = useState<any | null>(null);
    const [list, setList] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isAdmin, setIsAdmin] = useState<boolean>(true);
    const [access, setAccess] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [updatingError, setUpdatingError] = useState<string | null>(null);
    const [user, setUser] = useState<string | null>(null);
    const [userID, setUserID] = useState<string | null>(null);
    const [saveStatus, setSaveStatus] = useState<Record<string, string>>({});

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
        };


        const fetchData = async () => {
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

        fetchData();
    }, [user]);

    useEffect(() => {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                list.push(...data[key]);
            }
        }
        setList([...new Set(list)]);
    }, [data])


    const updateData = async (user_to_change: string, data: any) => {
        try {
            setSaveStatus((prev) => ({ ...prev, [user_to_change]: "saving" })); // Indicate saving
            const BODY_TO_SEND = JSON.stringify({ user_id: userID, user_to_change, new_privileges: { privileges: data } });
            const response = await fetch(ADMIN_USER_UPDATE_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: BODY_TO_SEND,
            });
            const result: UpdateUserApiResponse = await response.json();

            if (!response.ok) {
                const error = result.error;
                throw new Error(error);
            }


            if ('message' in result) {
                // Mark as saved
                setSaveStatus((prev) => ({ ...prev, [user_to_change]: "saved" }));
                setError(null);
                setTimeout(() => {
                    setSaveStatus((prev) => ({ ...prev, [user_to_change]: "" })); // Reset status after 2 seconds
                }, ANIMATION_TIME_DELAY);
            } else {
                setSaveStatus((prev) => ({ ...prev, [user_to_change]: "error" })); // Indicate error
                const errorMessage =
                    (error as unknown as Error) instanceof Error ? (error as unknown as Error).message : response.status;
                setUpdatingError(errorMessage.toString());
            }
        } catch (error: any) {
            setSaveStatus((prev) => ({ ...prev, [user_to_change]: "error" })); // Indicate error
            const errorMessage =
                error instanceof Error ? error.message : "An unknown error occurred";
            setUpdatingError(errorMessage);
        }
    };



    if (loading) return (
        <div className="h-screen -mt-16 pt-16">
            <ul className="flex flex-row flex-wrap gap-10 p-10">
                {Array.from({ length: 5 }).map((_, k) => (
                    <UserAccessWrapper key={k}></UserAccessWrapper>
                ))}
            </ul>
        </div>
    );
    if (user === null) return (
        <div className="h-screen -mt-16 pt-16 flex flex-col justify-center items-center">
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
        <div className="h-screen -mt-16 pt-16 flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold mb-10">
                User has <span className="text-red-600">no Access.</span>
            </h1>
        </div>
    );
    if (error) return (
        <div className="h-screen -mt-16 pt-16 flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold mb-10">
                Error: <span className="text-red-600">{error}</span>
            </h1>
        </div>
    );


    return (
        <div className="h-screen -mt-16 pt-16">
            {data && (
                <ul className="flex flex-row flex-wrap gap-10 p-10 z-0 w-full overflow-y-scroll">
                    {Object.entries(data).map(([key, value]) => (
                        <UserAccessWrapper key={key}>
                            <strong className="text-xl">{key}</strong>
                            <div className="flex flex-col">
                                {list
                                    .sort()
                                    .map((item, k) => (
                                        <div key={k}>
                                            <label>
                                                <label className="inline-flex items-center cursor-pointer">
                                                    {/* <input type="checkbox" value=""  /> */}
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={(value as any[]).includes(item)}
                                                        onChange={(e) => {
                                                            const checked = e.target.checked;
                                                            const newValue = checked
                                                                ? [...(value as any[]), item]
                                                                : (value as any[]).filter((x) => x !== item);
                                                            setData((prev: any) => ({
                                                                ...prev,
                                                                [key]: newValue,
                                                            }));
                                                        }}
                                                    />
                                                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600">
                                                    </div>

                                                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                        {item}
                                                    </span>
                                                </label>
                                            </label>
                                        </div>
                                    ))}
                            </div>

                            <div className="tooltip !z-50" data-tip={updatingError}>
                                <button className={`btn text-white btn-sm w-full ${saveStatus[key] === "error" ? 'btn-error' : 'btn-success'}`} onClick={() => updateData(key, value)}>
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
                        </UserAccessWrapper>
                    ))}
                </ul>
            )}
        </div>
    );
};
