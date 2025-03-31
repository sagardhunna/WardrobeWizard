import React from "react";
import Tutorial from "../../components/Tutorial/Tutorial";
import "./home.css";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

function Home() {

  const SERVER = import.meta.env.VITE_SERVER;

  const [userEmail, setUserEmail] = useState('UNDEFINED')

  useEffect(() => {
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
        setUserEmail(response.data.userinfo.email)
        console.log("Response from getData:", response.data);
      } catch (error) {
        console.log("Error in getData:", error);
      }
    };

    getData()
  }, [])

  useEffect(() => { 
    console.log("email is:", userEmail)
    const createUser = async () => {
      try {
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userEmail
          })
        }

        const promise = await fetch(`${SERVER}/createUser`, options)
        const response = await promise.json()

        console.log("response from createUser:", response)
      } catch (error) { 
        console.log("Error in createUser():", error)
      }
    }

    const checkHasAccount = async () => {
      try {
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userEmail
          })
        }

        const promise = await fetch(`${SERVER}/hasAccount`, options)
        const response = await promise.json()
        console.log("response from checkHasAccount():", response.hasAccount)
        return response.hasAccount
      } catch (error) {
        console.log("Error in checkHasAccount:", error)
      }
    }
    const hasAccount = checkHasAccount()

    if (hasAccount) {
      console.log("USER HAS ACCOUNT, WE WILL NOT CREATE ONE")
    } else {
      createUser()
    }
  }, [userEmail])


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
