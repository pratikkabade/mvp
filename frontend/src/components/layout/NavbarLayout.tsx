import { useEffect, useState } from "react";
import { LOGO_URL } from "../../constants/URL";
import { setFavicon } from "../../utility/Favicon";
import defaultLogo from "../../assets/icons/logo.png";
import { Link, useLocation } from "react-router-dom";

export const NavbarLayout = ({ serverIsRunningC }: { serverIsRunningC: boolean }) => {
   const [status, setStatus] = useState(false);
   const [user, setUser] = useState(localStorage.getItem('remembered_logged_id') || '');
   const [logo, setLogo] = useState(defaultLogo);

   // Fetch server status and set user from localStorage
   useEffect(() => {
      setStatus(serverIsRunningC);

      // Set user from localStorage once on initial render
      const storedUser = localStorage.getItem('remembered_logged_id');
      setUser(storedUser || '');
   }, [serverIsRunningC]); // Empty dependency array to run only once on mount

   // Update logo and favicon based on status change
   useEffect(() => {
      if (status) {
         setLogo(LOGO_URL);
         // console.log(LOGO_URL);

      } else {
         setLogo(defaultLogo);
      }
   }, [status]); // This effect runs only when 'status' changes

   const location = useLocation(); // Get the current location
   useEffect(() => {
      const storedUser = localStorage.getItem('remembered_logged_id');
      setUser(storedUser || '');
      // console.log("URL changed:", location.pathname, storedUser); // Optional: Debug URL changes
   }, [location]); // Depend on location to run this effect on URL changes

   useEffect(() => {
      setFavicon(logo);
   }, [logo]);

   return (
      <div className="navbar z-50 bg-base-100 rounded-lg shadow-md">
         <div className="flex-1">
            <Link to={"/PRM/"} className="btn btn-ghost text-xl">
               <img src={logo}
                  className="mr-3 h-9 w-9 rounded-md"
                  alt="Logo" />
               IdeaHub
            </Link>
         </div>
         <div className="flex-none text-xl">
            <ul className="menu menu-horizontal px-1">
               {user === '' ?
                  <Link to={"/PRM/Login"}>
                     <button className="fade-in btn btn-sm btn-success rounded-full text-white">Login</button>
                  </Link>
                  :
                  <div className="flex flex-row items-center gap-2">
                     <button className="btn btn-outline cursor-default btn-sm">{user}</button>
                     <Link to={"/PRM/Login"}>
                        <button className="fade-in btn btn-sm btn-error rounded-full" color={'failure'}
                           onClick={() => { localStorage.removeItem('remembered_logged_id') }}>Sign out</button>
                     </Link>
                  </div>
               }
            </ul>
         </div>
      </div>
   );
};
