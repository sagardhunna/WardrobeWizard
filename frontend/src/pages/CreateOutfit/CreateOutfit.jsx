import React from "react";
import "./createOutfit.css";
import { useState, useEffect } from "react";
import useAuthRedirect from "../../hooks/useAuthRedirect";

const CreateOutfit = () => {
  useAuthRedirect();

  const [hat, setHat] = useState(undefined);
  const [top, setTop] = useState(undefined);
  const [bottom, setBottom] = useState(undefined);
  const [shoes, setShoes] = useState(undefined);
  const [inventory, setInventory] = useState();
  const [userID, setUserID] = useState();
  const [outfit, setOutfit] = useState(["", "", "", ""]);

  const [category, setCategory] = useState("hat");

  const setImage = (img) => {
    if (category === "hat") {
      setHat(img);
      outfit[0] = img;
    } else if (category === "top") {
      setTop(img);
      outfit[1] = img;
    } else if (category === "bottom") {
      setBottom(img);
      outfit[2] = img;
    } else if (category === "shoes") {
      setShoes(img);
      outfit[3] = img;
    }
  };

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

  async function getInventory() {
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userID,
        }),
      };

      const promise = await fetch(`${SERVER}/getImages`, options);
      const response = await promise.json();
      console.log("Response from getInventory:", response);
      setInventory(response);
    } catch (error) {
      console.log("Error in getInventory:", error);
    }
  }

  useEffect(() => {
    getUserID();
  }, []);

  useEffect(() => {
    if (userID != -1) {
      getInventory();
    }
  }, [userID]);

  
  async function saveOutfit() {
    console.log("User id is:", userID)
    console.log("outfit:", outfit)
    try {
      const options = {
        method: "POST", 
        body: JSON.stringify({
          user_id: userID,
          complete_outfit: outfit,
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      }

      const promise = await fetch(`${SERVER}/saveOutfit`, options)
      const response = await promise.json()

      console.log("Response from saveOutfit:", response)
    } catch (error) {
      console.log("Error:", error)
    }

  }

  return (
    <div className="create-outfit-container">
      <div className="outfit-and-selector">
        <div className="outfit-creation">
          {[hat, top, bottom, shoes].map((item, index) => (
            <div className="outfit-slot" key={index}>
              <img src={item} alt={`slot-${index}`} draggable="false" />
            </div>
          ))}
          <button className="save-button" onClick={saveOutfit} disabled={!(hat && top && bottom && shoes)}>
            Save Outfit
          </button>
        </div>
        <div className="clothing-selection">
          <h2 style={{ color: '#504B38'}}>Select a Category To Place The Image</h2>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="dropdown"
            style={{ backgroundColor: '#504B38'}}
          >
            <option value="hat">Hat</option>
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
            <option value="shoes">Shoes</option>
          </select>

          <div className="image-gallery">
            {inventory &&
              inventory.map((item, i) => (
                <img
                  key={i}
                  src={item.image_url}
                  alt={`clothing-${i}`}
                  onClick={() => setImage(item.image_url)}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOutfit;
