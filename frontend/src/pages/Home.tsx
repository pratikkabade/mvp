import React, { useEffect, useState } from "react";
import { DUMMY_DATA_URL, PRIVILEGE_CHECK_URL } from "../constants/URL";
import { Link } from "react-router-dom";
import { ViewContent } from "../components/home/ViewContent";
import { CreateContent } from "../components/home/Create";

interface User {
    name: string;
    role: string;
}

interface ApiResponse {
    data: User[];
}

interface PrivilegeApiResponse {
    Access: boolean;
}

// curl -X POST http://localhost:5000/auth/check_privilege -H "Content-Type: application/json" -d '{"username": "admin", "user_id": "676e6eecd54a2a76c88f7eb6", "privilege": "read"}'

export const Home: React.FC = () => {
    const PRIVILEGE_REQUIRED = "read";
    const [data, setData] = useState<User[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [hasPrivilege, setHasPrivilege] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<string | null>(null);
    const [userID, setUserID] = useState<string | null>(null);

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
        if (!user) {
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                const BODY_TO_SEND = JSON.stringify({
                    username: user,
                    user_id: userID,
                    privilege: PRIVILEGE_REQUIRED,
                });
                const response = await fetch(PRIVILEGE_CHECK_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: BODY_TO_SEND,
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const result: PrivilegeApiResponse = await response.json();
                setHasPrivilege(result?.Access);
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
        if (!user && !hasPrivilege) {
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                const BODY_TO_SEND = JSON.stringify({ username: user });
                const response = await fetch(DUMMY_DATA_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: BODY_TO_SEND,
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const result: ApiResponse = await response.json();
                setData(result.data);
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

    if (user === null) return <div>Please sign in to see the details.</div>;
    if (loading) return <div>Loading...</div>;
    if (!hasPrivilege) return <div>User doesn't have any access to the data</div>;
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
                    {data.map((user, index) => (
                        <li key={index}>
                            <strong>{user.name}</strong> - {user.role}
                        </li>
                    ))}
                </ul>
            )}
            <Link to={'/Administration'}>admin page</Link>
            <ViewContent />
            <CreateContent />
        </div>
    );
};
