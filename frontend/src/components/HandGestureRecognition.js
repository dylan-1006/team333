import React, { useRef, useEffect, useState } from "react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { HAND_CONNECTIONS } from "@mediapipe/hands";
import "./HandGestureRecognition.css";

function HandGestureRecognition() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);
  const handsRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [gesture, setGesture] = useState("Waiting for gesture...");
  const gestureTimeoutRef = useRef(null);
  const lastGestureRef = useRef(null);
  const gestureCountRef = useRef(0);
  const [isTTSActive, setIsTTSActive] = useState(false);
  const ttsTimeoutRef = useRef(null);
  const lastSpokenGestureRef = useRef(null);
  const lastSpokenTimeRef = useRef(0);

  useEffect(() => {
    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      if (gestureTimeoutRef.current) {
        clearTimeout(gestureTimeoutRef.current);
      }
      if (handsRef.current) {
        handsRef.current.close();
      }
    };
  }, []);

  const detectGesture = (landmarks) => {
    // Get all important landmarks
    const wrist = landmarks[0];

    // Thumb landmarks
    const thumbCMC = landmarks[1]; // Thumb base
    const thumbMCP = landmarks[2]; // Thumb first joint
    const thumbIP = landmarks[3]; // Thumb second joint
    const thumbTip = landmarks[4]; // Thumb tip

    // Index finger landmarks
    const indexMCP = landmarks[5]; // Index base
    const indexPIP = landmarks[6]; // Index first joint
    const indexDIP = landmarks[7]; // Index second joint
    const indexTip = landmarks[8]; // Index tip

    // Middle finger landmarks
    const middleMCP = landmarks[9]; // Middle base
    const middlePIP = landmarks[10]; // Middle first joint
    const middleDIP = landmarks[11]; // Middle second joint
    const middleTip = landmarks[12]; // Middle tip

    // Ring finger landmarks
    const ringMCP = landmarks[13]; // Ring base
    const ringPIP = landmarks[14]; // Ring first joint
    const ringDIP = landmarks[15]; // Ring second joint
    const ringTip = landmarks[16]; // Ring tip

    // Pinky landmarks
    const pinkyMCP = landmarks[17]; // Pinky base
    const pinkyPIP = landmarks[18]; // Pinky first joint
    const pinkyDIP = landmarks[19]; // Pinky second joint
    const pinkyTip = landmarks[20]; // Pinky tip

    // Helper functions
    const distance = (point1, point2) => {
      return Math.sqrt(
        Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
      );
    };

    const isFingerRaised = (tip, mcp, threshold = 0.02) => {
      return tip.y < mcp.y - threshold;
    };

    const isFingerStraight = (tip, dip, pip, mcp, tolerance = 0.2) => {
      const totalLength =
        distance(mcp, pip) + distance(pip, dip) + distance(dip, tip);
      const directLength = distance(mcp, tip);
      return directLength / totalLength > 1 - tolerance;
    };

    // Check finger states
    const indexRaised = isFingerRaised(indexTip, indexMCP);
    const middleRaised = isFingerRaised(middleTip, middleMCP);
    const ringRaised = isFingerRaised(ringTip, ringMCP);
    const pinkyRaised = isFingerRaised(pinkyTip, pinkyMCP);

    const indexStraight = isFingerStraight(
      indexTip,
      indexDIP,
      indexPIP,
      indexMCP
    );
    const middleStraight = isFingerStraight(
      middleTip,
      middleDIP,
      middlePIP,
      middleMCP
    );
    const ringStraight = isFingerStraight(ringTip, ringDIP, ringPIP, ringMCP);
    const pinkyStraight = isFingerStraight(
      pinkyTip,
      pinkyDIP,
      pinkyPIP,
      pinkyMCP
    );

    // Thumb specific checks
    const thumbRaised = thumbTip.y < wrist.y - 0.1;
    const thumbOut = thumbTip.x > indexMCP.x;
    const thumbStraight = isFingerStraight(
      thumbTip,
      thumbIP,
      thumbMCP,
      thumbCMC,
      0.3
    );

    // Calculate finger spread once at the beginning
    const fingerSpread = distance(indexTip, pinkyTip);

    // Debug logging
    console.log("Hand state:", {
      raised: {
        index: indexRaised,
        middle: middleRaised,
        ring: ringRaised,
        pinky: pinkyRaised,
      },
      straight: {
        index: indexStraight,
        middle: middleStraight,
        ring: ringStraight,
        pinky: pinkyStraight,
      },
      thumb: { raised: thumbRaised, out: thumbOut, straight: thumbStraight },
      spreads: { total: fingerSpread },
    });

    // HELLO - Open palm with spread fingers
    const allFingersRaised = [indexTip, middleTip, ringTip, pinkyTip].every(
      (tip) => tip.y < wrist.y - 0.1
    );

    if (allFingersRaised && thumbOut && fingerSpread > 0.2) {
      return "Hello";
    }

    // YES - Closed fist
    if (
      !indexRaised &&
      !middleRaised &&
      !ringRaised &&
      !pinkyRaised &&
      !thumbRaised
    ) {
      return "Yes";
    }

    // NO - Three fingers (thumb, index, middle)
    if (
      indexRaised &&
      middleRaised &&
      !ringRaised &&
      !pinkyRaised &&
      thumbOut &&
      indexStraight &&
      middleStraight
    ) {
      return "No";
    }

    // THANKS - Four fingers together
    if (
      indexRaised &&
      middleRaised &&
      ringRaised &&
      pinkyRaised &&
      fingerSpread < 0.15
    ) {
      return "Thanks";
    }

    // GOOD AFTERNOON - Thumbs up
    if (
      thumbRaised &&
      thumbStraight &&
      !indexRaised &&
      !middleRaised &&
      !ringRaised &&
      !pinkyRaised
    ) {
      return "Good Afternoon";
    }

    return null;
  };

  const updateGesture = (newGesture) => {
    if (!newGesture) {
      if (gesture === "Adjusting..." || gesture === "Show a gesture...") {
        return;
      }
      setGesture("Show a gesture...");
      return;
    }

    // Always update immediately for better responsiveness
    setGesture(newGesture);

    // Reset the timeout
    if (gestureTimeoutRef.current) {
      clearTimeout(gestureTimeoutRef.current);
    }

    // Keep the gesture displayed
    gestureTimeoutRef.current = setTimeout(() => {
      setGesture("Show a gesture...");
    }, 3000);
  };

  const startCamera = async () => {
    try {
      // Stop any existing streams
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      if (handsRef.current) {
        handsRef.current.close();
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: "user",
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        // Wait for video metadata to load
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = () => {
            resolve();
          };
        });

        await videoRef.current.play();

        handsRef.current = new Hands({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
          },
        });

        handsRef.current.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        handsRef.current.onResults((results) => {
          if (!canvasRef.current) return;

          const canvasCtx = canvasRef.current.getContext("2d");
          canvasCtx.save();
          canvasCtx.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
          canvasCtx.drawImage(
            results.image,
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );

          if (
            results.multiHandLandmarks &&
            results.multiHandLandmarks.length > 0
          ) {
            // Draw hand landmarks
            drawConnectors(
              canvasCtx,
              results.multiHandLandmarks[0],
              HAND_CONNECTIONS,
              {
                color: "#00FF00",
                lineWidth: 5,
              }
            );
            drawLandmarks(canvasCtx, results.multiHandLandmarks[0], {
              color: "#FF0000",
              lineWidth: 2,
              radius: 3,
            });

            const detectedGesture = detectGesture(
              results.multiHandLandmarks[0]
            );
            updateGesture(detectedGesture);
          } else {
            updateGesture(null);
          }
          canvasCtx.restore();
        });

        cameraRef.current = new Camera(videoRef.current, {
          onFrame: async () => {
            if (handsRef.current) {
              await handsRef.current.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480,
        });

        await cameraRef.current.start();
        setIsStreaming(true);
      }
    } catch (err) {
      console.error("Error:", err);
      setGesture("Camera error: " + err.message);
    }
  };

  const stopCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.stop();
    }
    if (handsRef.current) {
      handsRef.current.close();
    }
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    setGesture("Camera stopped");
  };

  const speakGesture = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      console.error("Text-to-Speech not supported in this browser.");
    }
  };

  useEffect(() => {
    const currentTime = Date.now();

    if (
      isTTSActive &&
      gesture &&
      gesture !== "Show a gesture..." &&
      gesture !== "Waiting for gesture..." &&
      (gesture !== lastSpokenGestureRef.current ||
        currentTime - lastSpokenTimeRef.current >= 10000)
    ) {
      if (ttsTimeoutRef.current) {
        clearTimeout(ttsTimeoutRef.current);
      }

      speakGesture(gesture);
      lastSpokenGestureRef.current = gesture;
      lastSpokenTimeRef.current = currentTime;

      ttsTimeoutRef.current = setTimeout(() => {
        // Allow the next gesture to be spoken after 5 seconds
      }, 5000);
    }

    return () => {
      if (ttsTimeoutRef.current) {
        clearTimeout(ttsTimeoutRef.current);
      }
    };
  }, [gesture, isTTSActive]);

  const toggleTTS = () => {
    if (isTTSActive) {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      if (ttsTimeoutRef.current) {
        clearTimeout(ttsTimeoutRef.current);
      }
    }
    setIsTTSActive(!isTTSActive);
  };

  return (
    <div className="gesture-container">
      <div className="video-wrapper">
        <video
          ref={videoRef}
          className="input-video"
          style={{ transform: "scaleX(-1)" }}
          playsInline
        />
        <canvas
          ref={canvasRef}
          className="output-canvas"
          width={640}
          height={480}
          style={{ transform: "scaleX(-1)" }}
        />
      </div>
      <div className="controls">
        <div className="gesture-text">{gesture}</div>
        <button
          onClick={isStreaming ? stopCamera : startCamera}
          className="camera-button"
        >
          {isStreaming ? "Stop Camera" : "Start Camera"}
        </button>
        <button onClick={toggleTTS} className="tts-button">
          {isTTSActive ? "Stop Speech" : "Text-to-Speech"}
        </button>
      </div>
      <div className="instructions">
        <p>Tips for better detection:</p>
        <ul>
          <li>Keep your hand steady</li>
          <li>Make clear, exaggerated gestures</li>
          <li>Ensure good lighting</li>
          <li>Keep your hand about 1-2 feet from the camera</li>
          <li>Face your palm toward the camera</li>
        </ul>
        <div className="tips"></div>
      </div>
    </div>
  );
}

export default HandGestureRecognition;
