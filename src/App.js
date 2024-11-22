import "./App.css";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <div className="w-screen h-screen">
      <Home />
      <div>
        <Toaster />
      </div>
    </div>
  );
}

export default App;
