import React, { useState } from 'react';
import Navbar from "./components/Navbar";
import Output from "./components/Output";
import Editor from "./components/Editor";

const App = () => {
    const [output, setOutput] = useState('');

    const handleCodeExecution = (outputText) => {
        setOutput(outputText);
        console.log(outputText);
    };

    return (
        <div className="flex gap-5">
            <Navbar />
            <Editor onCodeExecution={handleCodeExecution} />
            <Output output={output} />
        </div>
    );
};

export default App;
