import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function App() {
    const navigate = useNavigate();
    useEffect(() => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (prefersDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        // const handleChange = (e: MediaQueryListEvent) => {
        //     if (e.matches) {
        //         document.documentElement.classList.add('dark');
        //     } else {
        //         document.documentElement.classList.remove('dark');
        //     }
        // };
    }, []);

    return (
        <div className="flex w-full h-full flex-col justify-center items-center">
        <h1 className="font-space-grotesk font-bold">Welcome to my Epiconsole !</h1>
        <button className="btn bg-primary text-primary-foreground font-bold p-4 rounded-xl text-2xl m-10 hover:cursor-pointer hover:shadow-2xl" onClick={() => navigate("/play")}>Play now</button>
        </div>
    )
}