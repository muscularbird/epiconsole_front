import { Link } from "react-router";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../components/ui/navigation-menu"
import { useNavigate } from "react-router";
import { Switch } from "../components/ui/switch"

export default function Header() {
    const navigate = useNavigate();

    const switchTheme = (checked: boolean) => {
        if (checked) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    return (
        <div className="w-full p-4 flex flex-row justify-between">
        <div>
            <button className="btn btn-ghost normal-case text-xl align-middle hover:bg-white hover:rounded-xl p-1 flex flex-row hover:cursor-pointer" onClick={() => navigate("/")}>
            <img src="/game-controller.svg" alt="Epiconsole Logo" width={30} height={30} />
            <p className="inline align-middle font-bold text-xl ml-2">Epiconsole</p>
            </button>
        </div>
        <NavigationMenu viewport={false}>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <Switch id="dark-mode" onCheckedChange={switchTheme} className="cursor-pointer"/>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                        <Link to="/play" className="text-xl">Play</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                        <Link to="/about" className="text-xl">About</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
        </div>
    );
}