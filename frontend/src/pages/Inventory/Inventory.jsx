import React from "react";
import { useState, useEffect } from "react";
import "./inventory.css";
import { adaptV4Theme, Button } from "@mui/material";
import InventoryDisplay from "../../components/InventoryDisplay/InventoryDisplay";

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

  function organizeData(data) {
    if (!data) {
      console.log("No images in inventory for this user...");
    } else {
      console.log("Data:", data);
      let tempTops = [];
      let tempBottoms = [];
      let tempShoes = [];
      let tempHats = [];

      data.forEach((element) => {
        if (element.image_category == "Top") {
          tempTops.push(element);
        } else if (element.image_category == "Bottom") {
          tempBottoms.push(element);
        } else if (element.image_category == "Shoes") {
          tempShoes.push(element);
        } else if (element.image_category == "Hat") {
          tempHats.push(element);
        } else {
          console.log("element DNE");
        }
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
    if (userID != -1) {
      getInventory();
      setUserID(-1);
    }
  }, [userID]);

  useEffect(() => {
    console.log("organizing data but we dont have invenotry");
    if (inventory != undefined) {
      console.log("organizing data but we have invenotry");
      console.log("Inventory:", inventory)
      organizeData(inventory);
    }
  }, [inventory]);

  return (
    <div className="main-container">
      <h1
        style={{
          backgroundColor: "#EBE5C2",
          padding: "1%",
          border: "solid black",
        }}
      >
        Here is your inventory
      </h1>

      <div className="inventory-cards">
        <div className="tops">
          <h1>Tops</h1>
          {tops && <InventoryDisplay inventoryImages={tops} />}
        </div>
        <div className="bottoms">
          <h1>Bottoms</h1>
          {bottoms && <InventoryDisplay inventoryImages={bottoms} />}
        </div>
        <div className="shoes">
          <h1>Shoes</h1>
          {shoes && <InventoryDisplay inventoryImages={shoes} />}
        </div>
        <div className="hats">
          <h1>Hats</h1>
          {hats && <InventoryDisplay inventoryImages={hats} />}
        </div>
      </div>
    </div>
  );
}

export default Inventory;
