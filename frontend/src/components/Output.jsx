import { useContext } from "react";
import "./Output.css";
import { FileManagerContext } from "./FileManagerContextProvider";

const Output = () => {
    const fm = useContext(FileManagerContext)
    return (
        <div
            id="output-window"
            className=" p-4 font-semibold text-center tracking-wider uppercase title border-l-2 border-slate-700"
        >
            <div className="window-header flex items-center justify-between">
                <p className="font-semibold text-left tracking-wider uppercase title">
                    Output
                </p>
                <div className="options flex items-center gap-2">
                    <span
                        className="material-symbols-outlined cursor-pointer"
                        title="Clear Output"
                        onClick={() => fm.setOutput("")}
                    >
                        delete
                    </span>
                </div>
            </div>
            <textarea
                id="output" 
                style={{
                    resize: "none",
                    fontSize: ".9rem",
                    fontFamily: "monospace", 
                    backgroundColor: "#0A192F",
                    overflow: 'auto'
                }}
                disabled
                value={fm.output}
            ></textarea>
        </div>
    );
};

export default Output;
