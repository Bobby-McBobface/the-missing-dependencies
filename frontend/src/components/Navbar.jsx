import { useContext, useState } from "react";
import "./Navbar.css";
import { FileManagerContext } from "./FileManagerContextProvider";

const Navbar = () => {
    const fm = useContext(FileManagerContext)

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
        </div>
    );
};

export default Navbar;
