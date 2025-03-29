import React from "react";
import "./tutorial.css";

function Tutorial() {
  return (
    <div className="tutorial-container">
      <h1>Tutorial</h1>

      <iframe
        width="758"
        height="427"
        src="https://www.youtube.com/embed/w77zPAtVTuI"
        title="Bean Time-Lapse - 25 days | Soil cross section"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen>
        </iframe>
    </div>
  );
}

export default Tutorial;
