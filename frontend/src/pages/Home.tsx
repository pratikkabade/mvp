import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ViewContent } from "../components/home/ViewContent";
import { PrivilegeCheck, PrivilegeCheckParams } from "../utility/CheckAccess";

export const Home: React.FC = () => {
    const PRIVILEGE_REQUIRED = "read";
    const [loading, setLoading] = useState<boolean>(true);
    const [hasPrivilege, setHasPrivilege] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
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
        const checkPrivileges = async () => {
            try {
                setLoading(true);
                const hasReadPrivilege = await PrivilegeCheck({ user, userID, PRIVILEGE_REQUIRED } as PrivilegeCheckParams);
                const hasAdminPrivilege = await PrivilegeCheck({ user, userID, PRIVILEGE_REQUIRED: "admin" } as PrivilegeCheckParams);
                setHasPrivilege(hasReadPrivilege);
                setIsAdmin(hasAdminPrivilege);
            } catch (error) {
                setError("Failed to check privileges.");
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            checkPrivileges();
        }
    }, [user]);

    if (user === null) return <div>Please sign in to see the details.</div>;
    if (loading) return <div>Loading...</div>;
    if (!hasPrivilege) return <div>User doesn't have any access to the data</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Logged in as {user}</h1>
            {isAdmin && <Link to={'/Administration'}>admin page</Link>}
            <ViewContent />
        </div>
    );
};
