import Navbar from "./components/Navbar";
import Output from "./components/Output";
import Editor from "./components/Editor";

import './App.css'

const App = () => {

    return (
        <div id="app">
            <Navbar />
            <Editor />
            <Output />
        </div>
    );
};

export default App;
