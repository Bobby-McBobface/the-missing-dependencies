import { useState } from 'react'
import './Output.css'

const Output = () => {
    const [output, setOutput] = useState<string>('')
    return (
        <div id="output-window" className=" p-4 font-semibold text-center tracking-wider uppercase title">
            <div className="window-header flex items-center justify-between">
                <p className="font-semibold text-left tracking-wider uppercase title">
                    Output
                </p>
                <div className="options flex items-center gap-2">
                    <span 
                        className="material-symbols-outlined cursor-pointer" 
                        title="Clear"
                        onClick={() => setOutput('')}>
                        delete
                    </span>
                </div>
            </div>  
            <textarea 
                id="output"
                style={{ backgroundColor: '#0A192F'}}
                disabled
                value={output}>                
            </textarea>
        </div>
    );
};

export default Output;
