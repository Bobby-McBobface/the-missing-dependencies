import { useContext, useEffect, useRef, useState } from "react";
import "./Editor.css";
import { newDefaultGrid } from "../utils/mapping";

import { FileManagerContext } from "./FileManagerContextProvider";

let mapping = [
    [255, 192, 192],    // Light red
    [255, 0, 0],    // Red
    [192, 0, 0],    // Dark red
    [255, 255, 192],    // Light yellow
    [255, 255, 0],      // Yellow
    [192, 192, 0],      // Dark yellow
    [192, 255, 192],    // Light green
    [0, 255, 0],    // Green
    [0, 192, 0],    // Dark green
    [192, 255, 255],    // Light cyan
    [0, 255, 255],      // Cyan
    [0, 192, 192],      // Dark cyan
    [192, 192, 255],    // Light blue
    [0, 0, 255],    // Blue
    [0, 0, 192],    // Dark blue
    [255, 192, 255],    // Light magenta
    [255, 0, 255],      // Magenta
    [192, 0, 192],      // Dark magenta
    [255, 255, 255],    // White
    [0, 0, 0],          // Black
]

const Editor = () => {
    const fm = useContext(FileManagerContext)
    const [pixels, setPixels] = useState(newDefaultGrid());
    const [text, setText] = useState("");
    const currPixel = useRef(0)

    useEffect(() => {
        if (fm.currOpen.length === 0) return
        fetch('http://localhost:5000/files/' + fm.currOpen)
        .then((resp) => resp.json())
        .then((p) => { setPixels(p) }) 
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

    useEffect(() => {
        currPixel.current = 0
    }, [])


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

    const placeColor = (color) => {
        let newPixels = JSON.parse(JSON.stringify(pixels))
        console.log(newPixels)
        newPixels[Math.floor(currPixel.current/pixels.length)][currPixel.current%pixels.length] = color
        setPixels(newPixels)
        currPixel.current++;
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
                        {pixels.map((row, i) => {
                            return row.map(([r, g, b], j) => {
                                return (
                                    <div
                                        className="pixel duration-300"
                                        style={{
                                            backgroundColor: `rgb(${r}, ${g}, ${b})`,
                                            border: (pixels.length * i + j === currPixel.current ? '2px solid black' : 'none')
                                        }}
                                    ></div>
                                );
                            });
                        })}
                    </div>
                </div>
                <div id="colors" className="h-full w-full">
                    {mapping.map(([r,g,b]) => {
                        return (
                            <div 
                                className="color" 
                                style={{ backgroundColor: `rgb(${r}, ${g}, ${b})` }}
                                onClick={() => placeColor([r,g,b])}></div>
                        )
                    })}
                </div>
            </>}
        </div>
    );
};

export default Editor;
