import React from "react";
import { useState, useEffect } from "react";
import InventoryDisplay from "../../components/InventoryDisplay/InventoryDisplay";
import "./inventory.css";

function Inventory() {
  const [inventory, setInventory] = useState([]);

  const SERVER = import.meta.env.VITE_SERVER;

  async function getInventory() {
    try {
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const promise = await fetch(`${SERVER}/getImages`, options);
      const response = await promise.json();
      console.log(response);
      setInventory(response);
    } catch (error) {
      console.log("Error in getInventory:", error);
    }
  }

  useEffect(() => {
    getInventory();
  }, []);

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
