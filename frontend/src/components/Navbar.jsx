import { useContext, useState } from "react";
import "./Navbar.css";
import { FileManagerContext } from "./FileManagerContextProvider";

const Navbar = () => {
    const fm = useContext(FileManagerContext)

    const uploadFile = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            console.log(file)
            const formData = new FormData();
            formData.append("file", file);
            const resp = await fetch('http://localhost:5000/' + "upload-encrypted", {
                method: "POST",
                body: formData,
            });
            if (resp.ok) {
                fm.setFiles(prev => [...prev, file.name.replace('encrypted_', '')])
            }
        }
    };

    const deleteFile = async (filename) => {
        const resp = await fetch('http://localhost:5000/files/'+filename, {
            method: 'DELETE'
        })
        if (resp.ok) {
            fm.setFiles(prev => prev.filter(f => f !== filename))
            fm.setOutput(prev => prev + '>>> delete ' + filename + ': SUCCESS\n')
            if (fm.currOpen === filename) fm.setCurrOpen('')
        }
    }

    const createFile = async () => {
        const newfile = prompt('New filename? (without extension)') + '.png'
        const resp = await fetch('http://localhost:5000/files/'+newfile, {
            method: 'POST'
        })
        if (resp.ok) {
            fm.setFiles(prev => [...prev, newfile])
            fm.setOutput(prev => prev + '>>> create ' + newfile + ': SUCCESS\n')
        }
    }

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
                    </span><span
                        className="material-symbols-outlined cursor-pointer"
                        title="Merge Files Into One Big Image"
                        onClick={createFile}
                    >
                        add
                    </span>
                </div>
            </div>
            {fm.files.length > 0 &&
            <ul
                className="text-lg font-light gap-1 flex flex-col text-gray-400 list-none"
                id="navbar"
            >
                {fm.files.map((file) => (
                    <li
                        onClick={() => fm.setCurrOpen(file)}
                        className="flex gap-2 rounded items-center justify-start hover:text-gray-300 duration-150 cursor-pointer text-sm hover:bg-slate-700 py-1 px-2"
                        key={file}
                    >
                        <span className="material-symbols-outlined">
                            description
                        </span>
                        {file}
                        <span 
                            className="material-symbols-outlined ml-auto file-options" 
                            title="Delete"
                            onClick={e => {e.stopPropagation(); deleteFile(file) }}
                            >
                            delete
                        </span>
                    </li>
                ))}
            </ul>}
            <div className="m-auto p-5 border-spacing-5 border-2 border-[#04db8c] border-dashed rounded-lg h-[20%] w-full flex justify-center items-center relative">
                <div className="flex flex-col justify-center items-center gap-3">
                    <span
                        className="material-symbols-outlined text-gray-300 text-4xl selection:rounded-xl"
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
                    className="absolute w-full h-full p-5 top-0 left-0 opacity-0 cursor-pointer"
                    onChange={uploadFile}
                />
            </div>
        </div>
    );
};

export default Navbar;
