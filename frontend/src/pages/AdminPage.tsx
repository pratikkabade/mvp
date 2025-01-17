import React, { useEffect, useState } from "react";
import { ADMIN_USER_DATA_URL, ADMIN_USER_UPDATE_URL } from "../constants/URL";


export const AdminPage: React.FC = () => {
    const [data, setData] = useState<any | null>(null);
    const [list, setList] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [access, setAccess] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
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
            setLoading(false);
        }
    }, []);



    useEffect(() => {
        if (!user || !userID) return;

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
                setLoading(false);
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

            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }

            await response.json();

            // Mark as saved
            setSaveStatus((prev) => ({ ...prev, [user_to_change]: "saved" }));
            setTimeout(() => {
                setSaveStatus((prev) => ({ ...prev, [user_to_change]: "" })); // Reset status after 2 seconds
            }, 2000);
        } catch (error: any) {
            setSaveStatus((prev) => ({ ...prev, [user_to_change]: "error" })); // Indicate error
            const errorMessage =
                error instanceof Error ? error.message : "An unknown error occurred";
            setError(errorMessage);
        }
    };



    if (user === null) return <div>Please sign in to see the details.</div>;
    if (loading) return <div>Loading...</div>;
    if (!access) return <div>User has no Access.</div>
    if (error)
        return (
            <div>
                <p>Error: {error}</p>
                <button onClick={() => (window.location.href = "/login")}>
                    Go to Login
                </button>
            </div>
        );


    return (
        <div>
            <h1>Logged in as {user}</h1>
            <h2>User Data:</h2>
            {data && (
                <ul>
                    {Object.entries(data).map(([key, value]) => (
                        <li key={key} className="m-2 border-2">
                            <strong>{key}</strong>:
                            <div className="flex flex-row justify-between">
                                <div className="flex flex-row">
                                    {list.map((item, k) => (
                                        <div key={k}>
                                            <label>
                                                <input
                                                    type="checkbox"
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
                                                {item}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => updateData(key, value)}>
                                    Save
                                </button>
                                {saveStatus[key] && (
                                    <span className="ml-2">
                                        {saveStatus[key] === "saving"
                                            ? "Saving..."
                                            : saveStatus[key] === "saved"
                                                ? "Saved!"
                                                : "Error"}
                                    </span>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
