import React from "react";
import { useState, useEffect } from "react";
import InventoryDisplay from "../../components/InventoryDisplay/InventoryDisplay";
import "./inventory.css";

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [userID, setUserID] = useState(-1);

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
        method: 'POST',
        body: JSON.stringify({
          user_email: userEmail,
        }),
        headers: {
          "Content-Type": "application/json",
        }
      }

      promise = await fetch(`${SERVER}/getUserID`, options)
      response = await promise.json()

      setUserID(response.user_id)
    } catch (error) {
      console.log("Error in getUserID", error)
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
          user_id: userID
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
      getInventory()
      setUserID(-1)
    }
  }, [userID])

  return (
    <><h1
      style={{
        backgroundColor: "#EBE5C2",
        padding: "0.5%",
        border: "solid",
      }}
    >
      Here is your inventory
    </h1><div className="inventory-container">
        <div className="images-container">
          <InventoryDisplay inventoryImages={inventory} />
        </div>
      </div></>
  );
}

export default Inventory;
