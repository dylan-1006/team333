import React from "react";
import { useNavigate } from "react-router-dom";
import "./InputSelection.css";

function InputSelection() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="input-selection-container">
      <button className="back-button" onClick={handleBack}>
        Back
      </button>
      <div className="option-cards">
        <div className="option-card">
          <div className="circle"></div>
          <p>Go Live</p>
        </div>
        <div className="option-card">
          <div className="circle"></div>
          <p>Upload For Translation</p>
        </div>
      </div>
      <button className="continue-button">Continue</button>
    </div>
  );
}

export default InputSelection;