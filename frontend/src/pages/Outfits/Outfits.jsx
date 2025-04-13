import React, { useEffect } from "react";
import "./outfits.css";
import { useState } from "react";

function Outfits() {
  const [userID, setUserID] = useState(-1);
  const [outfits, setOutfits] = useState([]);

  const SERVER = import.meta.env.VITE_SERVER;

  async function getUserID() {
    try {
      let options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      };
      let promise = await fetch(`${SERVER}/getData`, options);
      let response = await promise.json();

      const userEmail = response.data.userinfo.email;

      options = {
        method: "POST",
        body: JSON.stringify({
          user_email: userEmail,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };

      promise = await fetch(`${SERVER}/getUserID`, options);
      response = await promise.json();

      setUserID(response.user_id);
    } catch (error) {
      console.log("Error in getUserID", error);
    }
  }

  useEffect(() => {
    getUserID();
  }, []);

  useEffect(() => {
    if (userID != -1) {
      getOutfits()
    }
  }, [userID]);

  async function getOutfits() {
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          user_id: userID,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };

      const promise = await fetch(`${SERVER}/getOutfits`, options);
      const response = await promise.json();
      console.log("response:", response);
      setOutfits(response)
    } catch (error) {
      console.log("Error:", error);
    }
  }

  return (
    <div className="outfit-gallery-page">
      <h1 className="outfit-gallery-title">Your Saved Outfits</h1>
      <div className="gallery-container">
        {outfits.map((outfit, index) => (
          <div className="outfit-card" key={index}>
            {outfit.map((imgSrc, i) => (
              <div className="outfit-piece" key={i}>
                <img src={imgSrc} alt={`outfit-${index}-piece-${i}`} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Outfits;
