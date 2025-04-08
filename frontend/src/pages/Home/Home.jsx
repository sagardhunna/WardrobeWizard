import React, { use } from "react";
import Tutorial from "../../components/Tutorial/Tutorial";
import "./home.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const SERVER = import.meta.env.VITE_SERVER;

  const [userEmail, setUserEmail] = useState("UNDEFINED");
  const [hasAccount, setHasAccount] = useState(null);

  // we call get Data to get the users email upon login and this should alter their email
  useEffect(() => {
    console.log("User email prior to getting data:", userEmail)
    const getData = async () => {
      try {
        const options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        };
        const promise = await fetch(`${SERVER}/getData`, options);
        const response = await promise.json();
        setUserEmail(response.data.userinfo.email);
        console.log("Response from getData:", response.data);
      } catch (error) {
        console.log("Error in getData:", error);
      }
    };

    getData();
  }, []);

  // if email is altered, we check if this user has an account in our db
  // we set that as a boolean in our state variable
  useEffect(() => {
    const checkHasAccount = async () => {
      try {
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userEmail,
          }),
        };
        console.log("user email about to chekc has account:", userEmail)
        const promise = await fetch(`${SERVER}/hasAccount`, options);
        const response = await promise.json();
        console.log("response from checkHasAccount():", response.hasAccount);
        setHasAccount(response.hasAccount)
      } catch (error) {
        console.log("Error in checkHasAccount:", error);
      }
    };

    if (userEmail != "UNDEFINED") {
      checkHasAccount();
    }
  }, [userEmail]);

  const createUser = async () => {
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
        }),
      };

      const promise = await fetch(`${SERVER}/createUser`, options);
      const response = await promise.json();

      console.log("response from createUser:", response);
    } catch (error) {
      console.log("Error in createUser():", error);
    }
  };

  // once the state of has account has changed, we will check a couple conditions of whether to create the user an account or do nothing
  useEffect(() => {
    if (userEmail == "UNDEFINED") {
      console.log("USER EMAIL IS UNDEFINED");
    } else if (hasAccount) {
      console.log("USER HAS ACCOUNT, WE WILL NOT CREATE ONE");
    } else {
      createUser();
    }
  }, [hasAccount]);

  return (
    <div style={{ color: "#504B38" }} className="home-container">
      <div className="left-side">
        <h1>Welcome To Wardrobe Wizard!</h1>
        <p>
          PUT A DESCRIPTION OF ALL THE STUFF WE THAT WE ARE DOING IN THIS APP{" "}
          <br />
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum
          dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
          velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
          occaecat cupidatat non proident, sunt in culpa qui officia deserunt
          mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
          irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
          fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
          sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem
          ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
          veniam, quis nostrud exercitation ullamco laboris nisi ut
        </p>
      </div>
      <Tutorial />
    </div>
  );
}

export default Home;
