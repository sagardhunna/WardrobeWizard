import * as React from "react";
import './inventoryDisplay.css';
import { useEffect } from "react";

export default function InventoryDisplay({ inventoryImages }) {

  return (
    <div className="image-cards">
      
      {inventoryImages.map((item) => (
          <img
            src={`${item.image_url}`}
            loading="lazy"
            style={{ border: "solid black", margin: '1%' }}
            draggable="false"
          />
      ))}
    </div>
  );
}
