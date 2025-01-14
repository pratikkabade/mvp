import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { NavbarLayout } from "../components/layout/NavbarLayout";
import { ServerCheck } from "../components/layout/ServerCheck";
import { useEffect, useState } from "react";
import { serverHealth } from "../utility/serverHealth";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { AdminPage } from "../pages/AdminPage";
import { ViewContent } from "../pages/ViewContent";
import { PRMHome } from "../pages/PRMHome";

export const Route_Items = [
    { name: "PRMHome", link: "/", element: <PRMHome /> },
    { name: "Home", link: "/PRM/", element: <Home /> },
    { name: "Login", link: "/PRM/Login", element: <Login /> },
    { name: "Administration", link: "/PRM/Administration", element: <AdminPage /> },
    { name: "Content", link: "/PRM/Content", element: <ViewContent /> },
];

export const AppRoutes = () => {
    const [serverIsRunning, setServerIsRunning] = useState(false);
    const fetchStatus = async () => {
        const isServerUp = await serverHealth();
        setServerIsRunning(isServerUp);
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    return (
        <BrowserRouter>
            <InnerRoutes serverIsRunning={serverIsRunning} />
        </BrowserRouter>
    );
};

const InnerRoutes = ({ serverIsRunning }: { serverIsRunning: boolean }) => {
    const location = useLocation();
    const showNavbarAndServerCheck = !["/"].includes(location.pathname);

    return (
        <div>
            {showNavbarAndServerCheck && (
                <>
                    {/* Navbar component */}
                    <NavbarLayout serverIsRunningC={serverIsRunning} />

                    {/* Server status check */}
                    <ServerCheck serverIsRunningC={serverIsRunning} />
                </>
            )}

            <Routes>
                {Route_Items.map((item, index) => (
                    <Route key={index} path={item.link} element={item.element} />
                ))}
            </Routes>

            {/* Overlay effect when the server is down */}
            {showNavbarAndServerCheck && (serverIsRunning ? (
                <div className="blur-overlay" style={{ animation: "fadeOut 3s forwards" }}></div>
            ) : (
                <div className="blur-overlay"></div>
            ))}
        </div>
    );
};