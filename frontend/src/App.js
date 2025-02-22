import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import InputSelection from "./InputSelection";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/options" element={<InputSelection />} />
      </Routes>
    </Router>
  );
}

export default App;
