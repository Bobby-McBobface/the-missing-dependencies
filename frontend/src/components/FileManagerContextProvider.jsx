import { createContext, useState, useEffect } from "react";

export const FileManagerContext = createContext({});

export function FileManagerContextProvider({ children }) {

    let [files, setFiles] = useState([]);
    let [currOpen, setCurrOpen] = useState('');
    let [output, setOutput] = useState('')

    useEffect(() => {
        fetch('http://localhost:5000/files')
            .then(resp => resp.json())
            .then(f => setFiles(f))
    }, [])

    return (
        <FileManagerContext.Provider value={{
            files, setFiles,
            currOpen, setCurrOpen,
            output, setOutput
        }}>
            {children}
        </FileManagerContext.Provider>
    )
}