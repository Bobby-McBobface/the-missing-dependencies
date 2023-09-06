import Navbar from "./components/Navbar";
import Output from "./components/Output";
import Editor from "./components/Editor";

const App = () => {
    return (
        <div className="flex gap-5">
            <Navbar />
            <Editor />
            <Output />
        </div>
    );
};

export default App;
