import { useState } from "react";
import "./Navbar.css";

const Navbar = () => {
    const [files] = useState<string[]>(["main.png", "index.png", "img.png"]);
    const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            fetch("http://localhost:5000/upload", {
                method: "POST",
                body: formData,
            });
        }
    };
    return (
        <div className="flex flex-col gap-6 w-[85%] bg-slate-800 h-screen overflow-y-hidden border-r-2 border-slate-700 p-4">
            <div className="flex flex-col gap-6 grow">
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
            <div className="m-auto p-3 border-spacing-5 border-2 border-[#04db8c] border-dashed rounded-lg h-[17rem] w-[17rem] flex justify-center items-center relative">
                <div className="flex flex-col justify-center items-center gap-3">
                    <span
                        className="material-symbols-outlined text-gray-300 text-7xl selection:rounded-xl"
                        title="drop files here"
                    >
                        image
                    </span>
                    <span className="text-gray-200 text-xl font-extralight tracking-tighter">
                        Drop files here
                    </span>
                    <span />
                </div>
                <input
                    type="file"
                    className="absolute w-full h-full p-2 top-0 left-0 opacity-0 cursor-pointer"
                    onChange={uploadFile}
                />
            </div>
        </div>
    );
};

export default Navbar;
