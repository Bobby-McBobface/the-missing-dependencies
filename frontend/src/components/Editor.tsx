import { useEffect, useState } from "react";
import './Editor.css'


import { getMapping, newDefaultGrid } from '../utils/mapping'

const mapping = getMapping()

// const KeyPad = ({ current }: { current: number }) => {
//     const Move = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
//         const arrow = e.currentTarget.dataset.arrow;
//         const pixel = document.querySelector(`[data-pixel="${current}"]`);
//         pixel?.classList.remove("bg-gray-600");
//         switch (arrow) {
//             case "up":
//                 if (current > 8) {
//                     current -= 8;
//                 }
//                 break;
//             case "down":
//                 if (current < 57) {
//                     current += 8;
//                 }
//                 break;
//             case "left":
//                 if (current > 1) {
//                     current -= 1;
//                 }
//                 break;
//             case "right":
//                 if (current < 64) {
//                     current += 1;
//                 }
//                 break;
//             default:
//                 break;
//         }
//         const newPixel = document.querySelector(`[data-pixel="${current}"]`);
//         newPixel?.classList.add("bg-gray-600");
//     };
//     return (
//         <div className="flex justify-center items-center w-1/5 bg-gray-800 p-2">
//             <div className="grid grid-cols-3 grid-rows-2 gap-2 text-white text-2xl">
//                 <div />
//                 <div
//                     className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 duration-100 hover:scale-110"
//                     data-arrow="up"
//                     onClick={Move}
//                 >
//                     <svg
//                         stroke="currentColor"
//                         fill="none"
//                         strokeWidth="2"
//                         viewBox="0 0 24 24"
//                         aria-hidden="true"
//                         height="1em"
//                         width="1em"
//                         xmlns="http://www.w3.org/2000/svg"
//                     >
//                         <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M8 7l4-4m0 0l4 4m-4-4v18"
//                         ></path>
//                     </svg>
//                 </div>
//                 <div />
//                 <div
//                     className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 duration-100 hover:scale-110"
//                     data-arrow="left"
//                     onClick={Move}
//                 >
//                     <svg
//                         stroke="currentColor"
//                         fill="none"
//                         strokeWidth="2"
//                         viewBox="0 0 24 24"
//                         aria-hidden="true"
//                         height="1em"
//                         width="1em"
//                         xmlns="http://www.w3.org/2000/svg"
//                     >
//                         <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M7 16l-4-4m0 0l4-4m-4 4h18"
//                         ></path>
//                     </svg>
//                 </div>
//                 <div
//                     className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 duration-100 hover:scale-110"
//                     data-arrow="down"
//                     onClick={Move}
//                 >
//                     <svg
//                         stroke="currentColor"
//                         fill="none"
//                         strokeWidth="2"
//                         viewBox="0 0 24 24"
//                         aria-hidden="true"
//                         height="1em"
//                         width="1em"
//                         xmlns="http://www.w3.org/2000/svg"
//                     >
//                         <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M16 17l-4 4m0 0l-4-4m4 4V3"
//                         ></path>
//                     </svg>
//                 </div>
//                 <div
//                     className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 duration-100 hover:scale-110"
//                     data-arrow="right"
//                     onClick={Move}
//                 >
//                     <svg
//                         stroke="currentColor"
//                         fill="none"
//                         strokeWidth="2"
//                         viewBox="0 0 24 24"
//                         aria-hidden="true"
//                         height="1em"
//                         width="1em"
//                         xmlns="http://www.w3.org/2000/svg"
//                     >
//                         <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M17 8l4 4m0 0l-4 4m4-4H3"
//                         ></path>
//                     </svg>
//                 </div>
//             </div>
//         </div>
//     );
// };

const Editor = () => {
    const [pixels, setPixels] = useState<number[][][]>(newDefaultGrid());
    const [text, setText] = useState<string>('')
    console.log(text)

    useEffect(() => {
        console.log('reloading')
        const newPixels = newDefaultGrid()
        const size = newPixels.length
        let index = 0;
        while (index < text.length && index < size*size) {
            newPixels[Math.floor(index/size)][index%size] = mapping[text.charCodeAt(index)]    
            index++
        }
        setPixels(newPixels)
    }, [text])  

    return (
        <div className="h-[100%] p-4" id="editor">
            <div className="window-header flex items-start justify-between">
                <p className="font-semibold text-left tracking-wider uppercase title">
                    Editor
                </p>
                <div className="options flex items-center gap-2">
                    <span className="material-symbols-outlined" title="Run">
                        play_arrow
                    </span>
                    <span className="material-symbols-outlined" title="save">
                        save
                    </span>
                </div>
            </div>  
            <div id="image-container">
                <div id="image" 
                    style={{
                        gridTemplateRows: `repeat(${pixels.length}, ${1/pixels.length}fr)`,
                        gridTemplateColumns: `repeat(${pixels.length}, ${1/pixels.length}fr)`
                    }}>
                    {pixels.map(row => {
                        return row.map(([r, g, b]) => {
                            return (
                                <div className="pixel duration-300" style={{backgroundColor: `rgb(${r}, ${g}, ${b})`}}>
                                </div>
                            )
                        })
                    })}
                </div>
            </div>  
            <textarea 
                spellCheck="false"
                autoFocus 
                style={{resize: 'none', padding: '1rem', fontSize: '.9rem', fontFamily: 'monospace'}}
                onChange={e => setText(e.target.value)}
                placeholder="Type your text..."
                >
            </textarea>
        </div>
    );
};

export default Editor;
