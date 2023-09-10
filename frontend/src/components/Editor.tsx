import { useEffect, useState } from "react";
import "./Editor.css";
import { getMapping, newDefaultGrid } from "../utils/mapping";

const mapping = getMapping();

const Editor = () => {
    const [pixels, setPixels] = useState<number[][][]>(newDefaultGrid());
    const [text, setText] = useState<string>("");

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

    return (
        <div className="h-[100%]" id="editor">
            <div className="window-header flex items-start justify-between">
                <p className="font-semibold text-left tracking-wider uppercase title p-4">
                    Editor
                </p>
                <div className="options flex items-center gap-2 p-4">
                    <span className="material-symbols-outlined" title="Run">
                        play_arrow
                    </span>
                    <span className="material-symbols-outlined" title="save">
                        save
                    </span>
                </div>
            </div>
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
                    className="border-2 border-slate-700"
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
                autoFocus
                style={{
                    resize: "none",
                    padding: "1rem",
                    fontSize: ".9rem",
                    fontFamily: "monospace",
                }}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type your text..."
                className="border-t-2 border-slate-700 bg-slate-800"
            ></textarea>
        </div>
    );
};

export default Editor;
