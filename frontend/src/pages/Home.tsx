import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PrivilegeCheck, PrivilegeCheckParams } from "../utility/CheckAccess";
import CreateContentWrapper from "../wrappers/CreateContentWrapper";
import DotAnimation from "../components/animations/DotAnimation";

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

    if (user === null) return (
        <div className="h-screen -mt-16 pt-16 flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold mb-10">
                Please sign in to see the details.
            </h1>
            <CreateContentWrapper privacy={'null'}>
                <Link to={'/Login'} className="btn btn-primary text-white">
                    Sign in
                </Link>
            </CreateContentWrapper>
        </div>
    );
    if (loading) return (
        <div className="h-screen -mt-16 pt-16 flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold skeleton p-5 px-10 rounded-full">
                Loading<DotAnimation />
            </h1>
        </div>
    );
    if (!hasPrivilege) return (
        <div className="h-screen -mt-16 pt-16 flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold mb-10">
                User <span className="text-red-600">doesn't</span> have any access to the data
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
        <div className="h-screen -mt-16 pt-20">
            <div className="flex flex-row justify-center my-5 gap-5">
                <CreateContentWrapper privacy={'null'}>
                    <Link to={'/Content'} className="btn btn-primary text-white">
                        Content Page
                    </Link>
                </CreateContentWrapper>
                {isAdmin &&
                    <CreateContentWrapper privacy={'null'}>
                        <Link to={'/Administration'} className="btn btn-neutral text-white">
                            Admin Page
                        </Link>
                    </CreateContentWrapper>
                }
            </div>
        </div>
    );
};
