import Navbar from "./components/Navbar";
import Output from "./components/Output";
import Editor from "./components/Editor";

import { FileManagerContextProvider } from "./components/FileManagerContextProvider";

import "./App.css";

const App = () => {
    return (
        <FileManagerContextProvider>
            <div id="app">
                <Navbar />
                <Editor />
                <Output />
            </div>
        </FileManagerContextProvider>
    );
};

export default App;
