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
      };

      const promise = await fetch(`${SERVER}/logout`, options);
      const response = await promise.json();

      console.log("RESPONSE FROM LOGOUT:", response);
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  if (isSpecificPage) {
    return null; // Do not render the Logout button if on the home page ("/")
  }

  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const navigate = useNavigate(); // useNavigate hook for programmatic navigation

  useEffect(() => {
    console.log("isLoggedIn:", isLoggedIn);
    if (!isLoggedIn) {
      navigate("/"); // Redirect to login page if not logged in
    }
  }, [isLoggedIn, navigate]); // This hook runs every time isLoggedIn changes


  const ONE_HOUR = 60 * 60 * 1000; // milliseconds


  useEffect(() => {
    const isExpired = async () => {
      const expiration_time = await getExpiration()
      const current_time = Date.now() / 1000;

      if (current_time > expiration_time) {
        return true
      } else {
        return false
      }
    }

    const getExpiration = async () => {
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
        console.log("Response from getExpiration:", response.data.expires_at); // 1743466257
        return response.data.expires_at
      } catch (error) {
        console.log("Error in getExpiration:", error);
      }
    };

    const interval = setInterval(() => {
      const tokenIsExpired = isExpired()
      
      if (tokenIsExpired) {
        handleLogout()
      }
    }, ONE_HOUR);
  
    // Cleanup on unmount
    return () => clearInterval(interval);

  }, [])


  const handleLogout = () => {
    setIsLoggedIn(false); // This will cause the redirect when isLoggedIn is false
    logout()
  };

  return (
    <Button sx={{ color: "#504B38" }} onClick={handleLogout}>
      Log Out
    </Button>
  );
}

export default LogoutPopover;
