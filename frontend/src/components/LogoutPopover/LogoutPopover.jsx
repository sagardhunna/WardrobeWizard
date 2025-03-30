import React from "react";
import Button from "@mui/material/Button";
import { useLocation } from 'react-router-dom';


function LogoutPopover({ isSpecificPage }) {

  const SERVER = import.meta.env.VITE_SERVER;

  const logout = async () => {
    try {
        
      } catch (error) {
        console.error('Error during logout', error);
      }
  }

  if (isSpecificPage) {
    return null; // Do not render the Logout button if on the home page ("/")
  }

  return (
    <Button sx={{ color: "#504B38" }} onClick={logout}>
      Log Out
    </Button>
  )
}

export default LogoutPopover;
