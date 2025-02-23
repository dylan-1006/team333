import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import InputSelection from "./InputSelection";
import LiveCam from "./LiveCam";
import HandGestureRecognition from './components/HandGestureRecognition';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/options" element={<InputSelection />} />
        <Route path="/livewebcam" element={<HandGestureRecognition />} />
      </Routes>
    </Router>
  );
}

export default App;
