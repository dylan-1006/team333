import React, { useRef, useEffect, useState } from 'react';
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { HAND_CONNECTIONS } from '@mediapipe/hands';

function HandGestureRecognition() {
  const videoElement = useRef(null);
  const canvasElement = useRef(null);
  const [isLive, setIsLive] = useState(false);
  const [recognizedText, setRecognizedText] = useState('Click Go Live to start');

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });
      
      if (videoElement.current) {
        videoElement.current.srcObject = stream;
        await videoElement.current.play();
        
        const hands = new Hands({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
          }
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        hands.onResults((results) => {
          if (!canvasElement.current) return;
          
          const canvasCtx = canvasElement.current.getContext('2d');
          canvasCtx.save();
          canvasCtx.clearRect(0, 0, canvasElement.current.width, canvasElement.current.height);
          canvasCtx.drawImage(results.image, 0, 0, canvasElement.current.width, canvasElement.current.height);
          
          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            for (const landmarks of results.multiHandLandmarks) {
              drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
                color: '#00FF00',
                lineWidth: 5
              });
              drawLandmarks(canvasCtx, landmarks, {
                color: '#FF0000',
                lineWidth: 2
              });

              // Simple gesture detection
              const wrist = landmarks[0];
              const indexTip = landmarks[8];
              const middleTip = landmarks[12];
              
              if (indexTip.y < wrist.y && middleTip.y < wrist.y) {
                setRecognizedText("Peace Sign");
              } else if (indexTip.y < wrist.y) {
                setRecognizedText("Pointing");
              } else {
                setRecognizedText("Hand Detected");
              }
            }
          } else {
            setRecognizedText("No hands detected");
          }
          canvasCtx.restore();
        });

        const camera = new Camera(videoElement.current, {
          onFrame: async () => {
            await hands.send({ image: videoElement.current });
          },
          width: 640,
          height: 480
        });

        await camera.start();
        setIsLive(true);
        console.log("Camera started successfully");
      }
    } catch (error) {
      console.error("Error starting camera:", error);
      setRecognizedText("Error: Cannot access camera");
    }
  };

  const stopCamera = () => {
    if (videoElement.current && videoElement.current.srcObject) {
      const tracks = videoElement.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoElement.current.srcObject = null;
      setIsLive(false);
      setRecognizedText('Camera stopped');
    }
  };

  return (
    <div className="gesture-container">
      <div className="video-container">
        <video 
          ref={videoElement}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          playsInline
        />
        <canvas 
          ref={canvasElement}
          width="640"
          height="480"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%'
          }}
        />
      </div>
      <div className="text-container">
        <h2>Hand Gesture Recognition</h2>
        <div className="recognized-text-box">
          {recognizedText}
        </div>
        <div className="button-container">
          <button 
            onClick={isLive ? stopCamera : startCamera}
            className="control-button"
          >
            {isLive ? 'Stop Camera' : 'Start Camera'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default HandGestureRecognition;