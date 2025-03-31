import React from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function LogoutPopover({ isSpecificPage }) {

  const SERVER = import.meta.env.VITE_SERVER;

  const logout = async () => {
    try {
        const options = {
            method: "POST",
            credentials: "include",
        }

        const promise = await fetch(`${SERVER}/logout`, options)
        const response = await promise.json()

        console.log("RESPONSE FROM LOGOUT:", response)
        handleLogout()
      } catch (error) {
        console.error('Error during logout', error);
      }
  }

  if (isSpecificPage) {
    return null; // Do not render the Logout button if on the home page ("/")
  }

  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const navigate = useNavigate(); // useNavigate hook for programmatic navigation

  useEffect(() => {
    print("isLoggedIn:", isLoggedIn)
    if (!isLoggedIn) {
      navigate("/"); // Redirect to login page if not logged in
    }
  }, [isLoggedIn, navigate]); // This hook runs every time isLoggedIn changes

  const handleLogout = () => {
    setIsLoggedIn(false); // This will cause the redirect when isLoggedIn is false
  };

  return (
    <Button sx={{ color: "#504B38" }} onClick={logout}>
      Log Out
    </Button>
  )
}

export default LogoutPopover;
