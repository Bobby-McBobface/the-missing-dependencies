import React from "react";
import img_icon from "../assets/image.svg";
import folder_icon from "../assets/folder.svg";

const Navbar = () => {
    const Files: string[] = ["main.png", "index.png", "img.png"];
    const OutputFiles: string[] = ["main.png", "index.png", "img.png"];
    const [filesCollapsed, setFilesCollapsed] = React.useState<boolean>(false);
    const [outputFilesCollapsed, setOutputFilesCollapsed] =
        React.useState<boolean>(false);
    return (
        <div className="flex flex-col gap-6 w-[18rem] bg-slate-800 h-screen overflow-y-hidden border-r-2 border-slate-700">
            <div className="text-3xl font-semibold py-6 text-center tracking-wider uppercase ">
                Explorer
            </div>
            <div className="flex flex-col gap-2 px-2">
                <div
                    className={
                        "flex gap-2 items-center text-2xl font-medium px-10 text-white duration-150" +
                        (!filesCollapsed ? " bg-slate-700" : " bg-slate-800")
                    }
                    onClick={() => setFilesCollapsed(!filesCollapsed)}
                >
                    <svg
                        stroke="currentColor"
                        fill="currentColor"
                        stroke-width="0"
                        viewBox="0 0 320 512"
                        height="1.2rem"
                        width="1.2rem"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`duration-150 ${
                            filesCollapsed ? "rotate-0" : "rotate-90"
                        }`}
                    >
                        <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"></path>
                    </svg>
                    <img src={folder_icon} height={25} width={25} />
                    files
                </div>
                <div
                    className={`py-4 text-lg font-light text-gray-400 ${
                        filesCollapsed ? "hidden" : "block"
                    }`}
                >
                    {OutputFiles.map((file: string, index: React.Key) => (
                        <div
                            className="flex gap-3 hover:text-gray-300 duration-150 cursor-pointer hover:bg-slate-700 px-14"
                            key={index}
                        >
                            <img src={img_icon} height={20} width={20} />
                            {file}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-2 px-2">
                <div
                    className={
                        "flex gap-2 items-center text-2xl font-medium px-10 text-white duration-150" +
                        (!outputFilesCollapsed
                            ? " bg-slate-700"
                            : " bg-slate-800")
                    }
                    onClick={() =>
                        setOutputFilesCollapsed(!outputFilesCollapsed)
                    }
                >
                    <svg
                        stroke="currentColor"
                        fill="currentColor"
                        stroke-width="0"
                        viewBox="0 0 320 512"
                        height="1.2rem"
                        width="1.2rem"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`duration-150 ${
                            outputFilesCollapsed ? "rotate-0" : "rotate-90"
                        }`}
                    >
                        <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"></path>
                    </svg>
                    <img src={folder_icon} height={25} width={25} />
                    output
                </div>
                <div
                    className={`py-4 text-lg font-light text-gray-400 ${
                        outputFilesCollapsed ? "hidden" : "block"
                    }`}
                >
                    {Files.map((file: string, index: React.Key) => (
                        <div
                            className="flex gap-3 hover:text-gray-300 duration-150 cursor-pointer hover:bg-slate-700 px-14"
                            key={index}
                        >
                            <img src={img_icon} height={20} width={20} />
                            {file}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
