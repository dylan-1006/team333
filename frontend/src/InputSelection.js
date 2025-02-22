import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideo,
  faCloudArrowUp,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./InputSelection.css";

function InputSelection() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);

  const handleBack = () => {
    navigate("/");
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="input-selection-container">
      <button className="back-button" onClick={handleBack}>
        <FontAwesomeIcon icon={faArrowLeft} className="back-icon" />
        Back
      </button>
      <div className="option-cards">
        <div
          className={`option-card ${
            selectedOption === "live" ? "selected" : ""
          }`}
          onClick={() => handleSelect("live")}
        >
          <div className="circle">
            <FontAwesomeIcon icon={faVideo} className="icon" />
          </div>
          <p>Go Live</p>
        </div>
        <div
          className={`option-card ${
            selectedOption === "upload" ? "selected" : ""
          }`}
          onClick={() => handleSelect("upload")}
        >
          <div className="circle">
            <FontAwesomeIcon icon={faCloudArrowUp} className="icon" />
          </div>
          <p>Upload For Translation</p>
        </div>
      </div>
      <button className="continue-button">Continue</button>
    </div>
  );
}

export default InputSelection;
