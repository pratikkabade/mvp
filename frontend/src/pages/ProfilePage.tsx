import { useState } from "react";
import { AccountHome } from "../components/profile/ProfileHome";
import { SideBar } from "../components/profile/SideBar";
import { Management } from "../components/profile/Management";

// import { Link } from "react-router-dom";
export const ProfilePage = () => {
    const [page, setPage] = useState<string>("home");

    return (
        <div className="h-screen flex flex-row max-sm:flex-col justify-start items-center">
            <SideBar page={page} setPage={setPage} />
            {page === "home" && <AccountHome />}
            {page === "account" && <Management />}
        </div>
    );
};
