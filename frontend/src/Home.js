import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <header className="header">
        <div className="logo">
          <img
            src={`${process.env.PUBLIC_URL}/logo.png`}
            alt="Logo"
            className="logo-image"
          />
          SignSpeak
        </div>
        <div className="buttons">
          <button className="contact-button">Contact Us</button>
          <button className="download-button">Download</button>
        </div>
      </header>
      <main className="main-content">
        <div className="text-content">
          <h1>
            Bridging Communication,
            <br />
            One Sign at a Time.
          </h1>
          <p>
            SignSpeak is a real-time sign language translation web tool powered
            by AI & Machine Learning. Whether you're deaf, hard of hearing, or
            learning sign language, our tool makes communication seamless,
            accessible, and instant.
          </p>
          <button
            onClick={() => navigate("/options")}
            className="get-started-button"
          >
            Get Started
          </button>
        </div>
        <div className="image-content">
          <img
            src={`${process.env.PUBLIC_URL}/home_page_image.jpg`}
            alt="Sign Language Illustration"
            className="illustration"
          />
        </div>
      </main>
    </div>
  );
}

export default Home;
