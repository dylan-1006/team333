import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import InputSelection from "./InputSelection";
import LiveCam from "./LiveCam";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/options" element={<InputSelection />} />
        <Route path="/livewebcam" element={<LiveCam />} />
      </Routes>
    </Router>
  );
}

export default App;
