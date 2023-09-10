import { useContext, useEffect, useState } from "react";
import "./Editor.css";
import { newDefaultGrid } from "../utils/mapping";

import { FileManagerContext } from "./FileManagerContextProvider";

let mapping = []

const Editor = () => {
    const fm = useContext(FileManagerContext)
    const [pixels, setPixels] = useState(newDefaultGrid());
    const [text, setText] = useState("");

    useEffect(() => {
        if (fm.currOpen.length === 0) return
        Promise.all([
            fetch('http://localhost:5000/mapping'),
            fetch('http://localhost:5000/files/' + fm.currOpen)
        ])
        .then(([rMap, rFileData]) => Promise.all([rMap.json(), rFileData.json()]))
        .then(([m, fileData]) => { 
            mapping = m; 
            console.log(fileData)
            setPixels(fileData.pixels);
            setText(fileData.text) 
        }) 
    }, [fm.currOpen])
    
    useEffect(() => {
        const newPixels = newDefaultGrid();
        const size = newPixels.length;
        let index = 0;
        while (index < text.length && index < size * size) {
            newPixels[Math.floor(index / size)][index % size] =
                mapping[text.charCodeAt(index)];
            index++;
        }
        setPixels(newPixels);
    }, [text]);


    const run = async () => {
        const resp = await fetch('http://localhost:5000/run', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(pixels)
        })
        const out = await resp.text()
        fm.setOutput(prev => prev + '>>> pymage ' + fm.currOpen + '\n' + out)
    }

    const save = async () => {
        const resp = await fetch('http://localhost:5000/files/' + fm.currOpen, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(pixels)
        })
        if (resp.ok) fm.setOutput(prev => prev + '>>> save ' + fm.currOpen + ' - SUCCESS\n')
    }

    return (
        <div className="h-[100%]" id="editor">
            <div className="window-header flex items-start justify-between">
                <p className="font-semibold text-left tracking-wider uppercase title p-4">
                    Editor
                </p>
                {fm.currOpen.length > 0 && 
                <div className="options flex items-center gap-2 p-4">
                    <span
                        className="material-symbols-outlined"
                        title="Download as Encrypted Image">
                        <a  
                            target="_blank"
                            href={'http://localhost:5000/download/' + fm.currOpen}
                            download={fm.currOpen}>
                            key
                        </a>
                    </span>
                    <span className="material-symbols-outlined" title="Run" onClick={run}>
                        play_arrow
                    </span>
                    <span className="material-symbols-outlined" title="save" onClick={save}>
                        save
                    </span>
                </div>}
            </div>
            {fm.currOpen.length > 0 && 
            <>
                <div id="image-container">
                    <div
                        id="image"
                        style={{
                            gridTemplateRows: `repeat(${pixels.length}, ${
                                1 / pixels.length
                            }fr)`,
                            gridTemplateColumns: `repeat(${pixels.length}, ${
                                1 / pixels.length
                            }fr)`,
                        }}
                    >
                        {pixels.map((row) => {
                            return row.map(([r, g, b]) => {
                                return (
                                    <div
                                        className="pixel duration-300"
                                        style={{
                                            backgroundColor: `rgb(${r}, ${g}, ${b})`,
                                        }}
                                    ></div>
                                );
                            });
                        })}
                    </div>
                </div>
                <textarea
                    spellCheck="false"
                    style={{
                        resize: "none",
                        padding: "1rem",
                        fontSize: ".9rem",
                        fontFamily: "monospace",
                    }}
                    onChange={(e) => setText(e.target.value)}
                    value={text}
                    placeholder="Type your Python program..."
                    className="border-t-2 border-slate-700 bg-slate-800"
                ></textarea>
            </>}
        </div>
    );
};

export default Editor;
