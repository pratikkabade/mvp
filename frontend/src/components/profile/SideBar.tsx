import HomeButton from "../../assets/svg/HomeButton"
import SettingsButton from "../../assets/svg/SettingsButton";

interface PageProps {
    page: string;
    setPage: (page: string) => void;
}

interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
}

export const SideBar = ({ page, setPage }: PageProps) => {
    const navItems: NavItem[] = [
        {
            id: "home",
            label: "Home",
            icon: <HomeButton />
        },
        {
            id: "account",
            label: "Account",
            icon: <SettingsButton />
        }
        // Add more navigation items easily here
    ];

    const NavItemComponent = ({ item }: { item: NavItem }) => (
        <li className="sm:w-32">
            <a onClick={() => setPage(item.id)} className={`flex flex-row justify-start items-center gap-2 cursor-pointer p-1 px-2 rounded-md ${page === item.id ? "bg-base-300" : "bg-base-100 hover:bg-base-200"}`}>
                {item.icon}
                <span className="max-sm:hidden">{item.label}</span>
            </a>
        </li>
    );

    return (
        <>
            <ul className="h-screen pt-20 flex flex-col gap-2 fade-in bg-base-100 max-sm:hidden">
                {navItems.map(item => (
                    <NavItemComponent key={item.id} item={item} />
                ))}
            </ul>
            <div>
                <ul className="menu menu-horizontal bg-base-100 rounded-box sm:hidden max-sm:pt-20">
                    {navItems.map(item => (
                        <NavItemComponent key={item.id} item={item} />
                    ))}
                </ul>
            </div>
        </>
    );
};