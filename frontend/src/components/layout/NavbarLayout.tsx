import { Button, Navbar } from "flowbite-react";
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
      <Navbar fluid rounded className="shadow-sm">
         <Navbar.Brand>
            <Link to={"/"}>
               <img src={logo}
                  className="mr-3 h-6 w-6 sm:h-9 sm:w-9 rounded-md"
                  alt="Logo" />
               <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                  {/* Optionally, you can add a title or additional text here */}
               </span>
            </Link>
         </Navbar.Brand>

         <div className="flex flex-row items-center gap-2">
            {user === '' ?
               <Link to={"/Login"}>
                  <Button className="fade-in" outline pill size={'sm'} color={'success'}>Login</Button>
               </Link>
               :
               <div className="flex flex-row items-center gap-2">
                  <span>Signed in as: <span className="bg-base-300 p-2 rounded-md">{user}</span></span>
                  <Link to={"/Login"}>
                     <Button className="fade-in" pill size={'sm'} color={'failure'}
                        onClick={() => { localStorage.removeItem('remembered_logged_id') }}>Sign out</Button>
                  </Link>
               </div>
            }
         </div>
      </Navbar>
   );
};
