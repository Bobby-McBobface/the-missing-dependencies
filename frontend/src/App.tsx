import React, { useState } from 'react';
import Navbar from "./components/Navbar";
import Output from "./components/Output";
import Editor from "./components/Editor";

import './App.css'

const App = () => {
    const [output, setOutput] = useState('');

    const handleCodeExecution = (outputText) => {
        setOutput(outputText);
        console.log(outputText);
    };

    return (
        <div id="app">
            <Navbar />
            <Editor onCodeExecution={handleCodeExecution} />
            <Output output={output} />
        </div>
    );
};

export default App;
