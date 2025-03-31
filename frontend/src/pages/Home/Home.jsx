import React from "react";
import Tutorial from "../../components/Tutorial/Tutorial";
import { useState, useEffect } from "react";
import "./home.css";

function Home() {

  const SERVER = import.meta.env.VITE_SERVER;

  useEffect(() => {
    const checkIsLoggedIn = async () => {
      try {
        const options = {
          method: "GET",
        }
        const promise = await fetch(`${SERVER}/isLoggedIn`)
        const response = await promise.json()

        console.log("Response from checkIsLoggedIn:", response.isLoggedIn)
      } catch (error) {
        console.log("Error in is logged in:", error)
      }
    }

    const intervalId = setInterval(() => {
      checkIsLoggedIn();
    }, 5000)

    return () => clearInterval(intervalId);

  },[])


  return (
    <div style={{ color: "#504B38" }} className="home-container">
      <div className="left-side">
        <h1>Welcome To Wardrobe Wizard!</h1>
        <p>
            PUT A DESCRIPTION OF ALL THE STUFF WE THAT WE ARE DOING IN THIS APP <br/>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut

        </p>
      </div>
      <Tutorial />
    </div>
  );
}

export default Home;
