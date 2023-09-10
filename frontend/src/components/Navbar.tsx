import { useState } from "react";
import "./Navbar.css";

const Navbar = () => {
    const [files] = useState<string[]>(["main.png", "index.png", "img.png"]);

    return (
        <div className="flex flex-col gap-6 w-[100%] bg-slate-800 h-screen overflow-y-hidden border-r-2 border-slate-700 p-4">
            <div className="window-header flex items-center justify-between">
                <p className="font-semibold text-left tracking-wider uppercase title">
                    Explorer
                </p>
                <div className="options flex items-center gap-2">
                    <span
                        className="material-symbols-outlined cursor-pointer"
                        title="Merge Files Into One Big Image"
                    >
                        cell_merge
                    </span>
                    <span
                        className="material-symbols-outlined cursor-pointer"
                        title="New File"
                    >
                        add
                    </span>
                </div>
            </div>
            <ul
                className="text-lg font-light gap-1 flex flex-col text-gray-400 list-none"
                id="navbar"
            >
                {files.map((file: string) => (
                    <li
                        className="flex gap-2 rounded items-center justify-start hover:text-gray-300 duration-150 cursor-pointer text-sm hover:bg-slate-700 py-1 px-2"
                        key={file}
                    >
                        <span className="material-symbols-outlined">
                            description
                        </span>
                        {file}
                        <span
                            className="material-symbols-outlined file-options ml-auto"
                            title="Download as Encrypted Image"
                        >
                            key
                        </span>
                        <span
                            className="material-symbols-outlined file-options"
                            title="Download as Image"
                        >
                            download
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Navbar;
