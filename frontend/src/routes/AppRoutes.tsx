import { BrowserRouter, Route, Routes } from "react-router-dom"
import { NavbarLayout } from "../components/layout/NavbarLayout"
import { ServerCheck } from "../components/layout/ServerCheck"
import { useEffect, useState } from "react"
import { fetchServerStatus } from "../utility/CheckServerStatus"
import { Home } from "../pages/Home"
import { Login } from "../pages/Login"

export const Route_Items = [
    { name: "Home", link: "/", element: <Home /> },
    { name: "Login", link: "/Login", element: <Login /> },
]

export const AppRoutes = () => {
    const [serverIsRunning, setServerIsRunning] = useState(false);
    const fetchStatus = async () => {
        const isServerUp = await fetchServerStatus();
        setServerIsRunning(isServerUp);
    };

    useEffect(() => {
        fetchStatus();
    }, [])

    return (
        <div>
            <BrowserRouter>
                {/* Navbar component */}
                <NavbarLayout serverIsRunningC={serverIsRunning} />

                {/* Server status check */}
                <ServerCheck serverIsRunningC={serverIsRunning} />

                <Routes>
                    {
                        Route_Items.map((item, index) => {
                            return (
                                <Route
                                    key={index}
                                    path={item.link}
                                    element={item.element} />
                            )
                        })
                    }
                </Routes>


                {/* Overlay effect when the server is down */}
                {!serverIsRunning && <div className="blur-overlay mt-24"></div>}
            </BrowserRouter>
        </div>
    )
}