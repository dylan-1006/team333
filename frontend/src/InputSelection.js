import React from "react";
import "./InputSelection.css";

function InputSelection() {
  return (
    <div className="input-selection-container">
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
