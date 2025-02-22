import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./LiveCam.css";

function LiveCam() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/options");
  };

  return (
    <div className="live-cam-container">
      <button className="back-button" onClick={handleBack}>
        <FontAwesomeIcon icon={faArrowLeft} className="back-icon" />
        Back
      </button>
      {/* Add your live cam content here */}
    </div>
  );
}

export default LiveCam;
