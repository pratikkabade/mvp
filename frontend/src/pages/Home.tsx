import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PrivilegeCheck, PrivilegeCheckParams } from "../utility/CheckAccess";
import DotAnimation from "../components/animations/DotAnimation";
import HomePageWrapper from "../wrappers/HomePageWrapper";

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

    if (loading) return (
        <HomePageWrapper>
            <h1 className="text-xl font-bold skeleton p-5 px-10 rounded-md text-slate-500 w-1/2">
                Loading<DotAnimation />
            </h1>
        </HomePageWrapper>
    );


    if (user === null) return (
        <HomePageWrapper>
            <div className="flex flex-row justify-start items-center gap-5 mt-5">
                <Link to={'/PRM/Login'} className="btn btn-primary text-white">
                    Sign in
                </Link>
                <h1 className="text-xl font-bold">
                    Please sign in to see the details.
                </h1>
            </div>
        </HomePageWrapper>
    )



    if (!hasPrivilege) return (
        <HomePageWrapper>
            <div className="flex flex-row justify-start items-center gap-5 mt-5">
                <h1 className="text-xl font-bold">
                    User <span className="text-red-600">doesn't</span> have any access to the data
                </h1>
            </div>
        </HomePageWrapper>
    )


    if (error) return (
        <HomePageWrapper>
            <div className="flex flex-row justify-start items-center gap-5 mt-5">
                <h1 className="text-xl font-bold">
                    Error: <span className="text-red-600">{error}</span>
                </h1>
            </div>
        </HomePageWrapper>
    )


    return (
        <HomePageWrapper>
            <div className="flex flex-row gap-5 mt-5">
                <Link to={'/PRM/Content'} className="btn btn-primary text-white">
                    Content Page
                </Link>
                {isAdmin &&
                    <Link to={'/PRM/Administration'} className="btn btn-neutral text-white">
                        Admin Page
                    </Link>
                }
            </div>
        </HomePageWrapper>
    );
}
