import React, { useState, useEffect } from "react";
import "./inventory.css";
import InventoryDisplay from "../../components/InventoryDisplay/InventoryDisplay";
import { Button } from "@mui/material";

function Inventory() {
  const [inventory, setInventory] = useState(undefined);
  const [userID, setUserID] = useState(-1);
  const [tops, setTops] = useState([]);
  const [bottoms, setBottoms] = useState([]);
  const [shoes, setShoes] = useState([]);
  const [hats, setHats] = useState([]);

  const SERVER = import.meta.env.VITE_SERVER;

  async function getUserID() {
    try {
      let options = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      };
      let promise = await fetch(`${SERVER}/getData`, options);
      let response = await promise.json();

      const userEmail = response.data.userinfo.email;

      options = {
        method: "POST",
        body: JSON.stringify({ user_email: userEmail }),
        headers: { "Content-Type": "application/json" },
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userID }),
      };

      const promise = await fetch(`${SERVER}/getImages`, options);
      const response = await promise.json();
      console.log("Response from getInventory:", response);
      setInventory(response);
    } catch (error) {
      console.log("Error in getInventory:", error);
    }
  }

  function organizeData(data) {
    if (!data) {
      console.log("No images in inventory for this user...");
    } else {
      let tempTops = [], tempBottoms = [], tempShoes = [], tempHats = [];
      data.forEach((element) => {
        if (element.image_category === "Top") tempTops.push(element);
        else if (element.image_category === "Bottom") tempBottoms.push(element);
        else if (element.image_category === "Shoes") tempShoes.push(element);
        else if (element.image_category === "Hat") tempHats.push(element);
        else console.log("element DNE");
      });
      setTops(tempTops);
      setBottoms(tempBottoms);
      setShoes(tempShoes);
      setHats(tempHats);
    }
  }

  useEffect(() => {
    getUserID();
  }, []);

  useEffect(() => {
    if (userID !== -1) {
      getInventory();
      setUserID(-1);
    }
  }, [userID]);

  useEffect(() => {
    if (inventory !== undefined) organizeData(inventory);
  }, [inventory]);

  return (
    <div className="inventory-container">
      <h1 className="inventory-title">Here is your inventory</h1>
      <div className="inventory-grid">
        <div className="inventory-category">
          <h2>Tops</h2>
          {tops && <InventoryDisplay inventoryImages={tops} />}
        </div>
        <div className="inventory-category">
          <h2>Bottoms</h2>
          {bottoms && <InventoryDisplay inventoryImages={bottoms} />}
        </div>
        <div className="inventory-category">
          <h2>Shoes</h2>
          {shoes && <InventoryDisplay inventoryImages={shoes} />}
        </div>
        <div className="inventory-category">
          <h2>Hats</h2>
          {hats && <InventoryDisplay inventoryImages={hats} />}
        </div>
      </div>
    </div>
  );
}

export default Inventory;
