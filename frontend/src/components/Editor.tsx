import React, { useEffect }from "react";
import axios from "axios";
import {useState} from "react";

interface HelpersType {
    name: string;
    iconColor: string;
    borderColor: string;
}


const KeyPad = ({ current }: { current: number }) => {
    const Move = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const arrow = e.currentTarget.dataset.arrow;
        const pixel = document.querySelector(`[data-pixel="${current}"]`);
        pixel?.classList.remove("bg-gray-600");
        switch (arrow) {
            case "up":
                if (current > 8) {
                    current -= 8;
                }
                break;
            case "down":
                if (current < 57) {
                    current += 8;
                }
                break;
            case "left":
                if (current > 1) {
                    current -= 1;
                }
                break;
            case "right":
                if (current < 64) {
                    current += 1;
                }
                break;
            default:
                break;
        }
        const newPixel = document.querySelector(`[data-pixel="${current}"]`);
        newPixel?.classList.add("bg-gray-600");
    };
    return (
        <div className="flex justify-center items-center w-1/5 bg-gray-800 p-2">
            <div className="grid grid-cols-3 grid-rows-2 gap-2 text-white text-2xl">
                <div />
                <div
                    className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 duration-100 hover:scale-110"
                    data-arrow="up"
                    onClick={Move}
                >
                    <svg
                        stroke="currentColor"
                        fill="none"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 7l4-4m0 0l4 4m-4-4v18"
                        ></path>
                    </svg>
                </div>
                <div />
                <div
                    className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 duration-100 hover:scale-110"
                    data-arrow="left"
                    onClick={Move}
                >
                    <svg
                        stroke="currentColor"
                        fill="none"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7 16l-4-4m0 0l4-4m-4 4h18"
                        ></path>
                    </svg>
                </div>
                <div
                    className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 duration-100 hover:scale-110"
                    data-arrow="down"
                    onClick={Move}
                >
                    <svg
                        stroke="currentColor"
                        fill="none"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16 17l-4 4m0 0l-4-4m4 4V3"
                        ></path>
                    </svg>
                </div>
                <div
                    className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 duration-100 hover:scale-110"
                    data-arrow="right"
                    onClick={Move}
                >
                    <svg
                        stroke="currentColor"
                        fill="none"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                        ></path>
                    </svg>
                </div>
            </div>
        </div>
    );
};

const Editor = () => {
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
    const pixels = [
        [1, 2, 3, 4, 5, 6, 7, 8],
        [9, 10, 11, 12, 13, 14, 15, 16],
        [17, 18, 19, 20, 21, 22, 23, 24],
        [25, 26, 27, 28, 29, 30, 31, 32],
        [33, 34, 35, 36, 37, 38, 39, 40],
        [41, 42, 43, 44, 45, 46, 47, 48],
        [49, 50, 51, 52, 53, 54, 55, 56],
        [57, 58, 59, 60, 61, 62, 63, 64],
    ];

    let current = 1;
    useEffect(() => {
        const pixel = document.querySelector(`[data-pixel="${current}"]`);
        pixel?.classList.add("bg-gray-600");
    }, [current]);
    return (
        <div className="flex flex-col gap-4 grow h-screen">
            <div className="text-3xl font-semibold py-6 text-center tracking-wider uppercase ">
                Editor
            </div>

            <div className="grow p-4">
                <div className="p-2 bg-gray-700 h-full grid grid-cols-8 grid=rows-8 gap-2">
                    {pixels.map((row) =>
                        row.map((pixel, index) => (
                            <div
                                className="h-auto w-auto bg-gray-800 rounded-lg"
                                data-pixel={pixel}
                                key={index}
                                onClick={() => {
                                    const currentPixel = document.querySelector(
                                        `[data-pixel="${current}"]`
                                    );
                                    currentPixel?.classList.remove(
                                        "bg-gray-600"
                                    );
                                    current = pixel;
                                    const newPixel = document.querySelector(
                                        `[data-pixel="${current}"]`
                                    );
                                    newPixel?.classList.add("bg-gray-600");
                                }}
                            >
                                {pixel}
                            </div>
                    )))}
                </div>
                </div>
            <div className="flex gap-5">
                <div className="h-[14rem] bg-gray-800 b-t-2 border-gray-700 w-4/5">
                    <div className="w-full h-full flex gap-5 flex-wrap p-4">
                        {Helpers.map(
                            (helper: HelpersType, index: React.Key) => (
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
                            )
                        )}
                        <button onClick={runCode}>Run</button> // Change this to the run button. //
                        <p style={{ color: 'red' }}>{error}</p>
                    </div>
                </div>
                <KeyPad current={current} />
            </div>
        </div>
    );
}

export default Editor;
