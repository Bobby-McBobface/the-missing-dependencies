import React, { useState } from "react";
import axios from "axios";

interface HelpersType {
    name: string;
    iconColor: string;
    borderColor: string;
}

function Editor({ onCodeExecution }) {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    const handleCodeChange = (event) => {
        setCode(event.target.value);
    };

    const runCode = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/run', { code });
      onCodeExecution(response.data.output);
      setCode('');
      setError(response.data.error);
    } catch (error) {
        setError('An error occurred while running the code.');
        }
    };

    const Helpers: HelpersType[] = [
        {
            name: "if",
            iconColor: "#FFFF00",
            borderColor: "#fafa82",
        },
        {
            name: "print",
            iconColor: "#00FF00",
            borderColor: "#a2f5a2",
        },
    ];
    return (
        <div className="flex flex-col gap-10 grow h-screen">
            <div className="text-3xl font-semibold py-6 text-center tracking-wider uppercase ">
                Editor
            </div>
            <div className="grow"></div>
            <div>
                <h2>Run Code</h2>
                <textarea rows="4" cols="50" value={code} onChange={handleCodeChange} /> // Change this to the image area. //
            </div>
            <div className="h-[14rem] bg-gray-800 b-t-2 border-gray-700">
                <div className="w-full h-full flex gap-5 flex-wrap p-4">
                    {Helpers.map((helper: HelpersType, index: React.Key) => (
                        <div
                            className="h-auto w-auto flex gap-2 items-center"
                            key={index}
                        >
                            <svg
                                stroke="currentColor"
                                fill="currentColor"
                                strokeWidth="0"
                                viewBox="0 0 512 512"
                                height="1em"
                                width="1em"
                                xmlns="http://www.w3.org/2000/svg"
                                className="text-3xl border-2 rounded-full"
                                style={
                                    {
                                        color: helper.iconColor,
                                        borderColor: helper.borderColor,
                                    } as React.CSSProperties
                                }
                            >
                                <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path>
                            </svg>
                            <div className="text-2xl font-light">
                                {helper.name}
                            </div>
                        </div>
                    ))}
                    <button onClick={runCode}>Run</button> // Change this to the run button. //
                    <p style={{ color: 'red' }}>{error}</p>
                </div>
            </div>
        </div>
    );
}

export default Editor;
