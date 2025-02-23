import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faFileAlt,
  faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./LiveCam.css";

function LiveCam() {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const handleBack = () => {
    navigate("/");
  };

  useEffect(() => {
    const getVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam: ", err);
      }
    };

    getVideo();
  }, []);

  return (
    <div className="live-cam-container">
      <button className="back-button" onClick={handleBack}>
        <FontAwesomeIcon icon={faArrowLeft} className="back-icon" />
        Back
      </button>
      <div className="content">
        <video
          ref={videoRef}
          className="video-placeholder"
          autoPlay
          playsInline
        ></video>
        <div className="transcript-section">
          <h3>
            <FontAwesomeIcon icon={faFileAlt} className="transcript-icon" />
            Transcript
          </h3>
          <div className="transcript-placeholder"></div>
          <div className="controls">
            <button className="text-to-speech-button">
              <FontAwesomeIcon icon={faVolumeUp} className="speech-icon" />
              Text-to-Speech
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveCam;
