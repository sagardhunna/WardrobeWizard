import React from "react";
import Button from "@mui/material/Button";

function LoginPopover() {

  const SERVER = import.meta.env.VITE_SERVER;

  async function login() {
    try {
      window.location.href = "http://127.0.0.1:5000/login/google";
    } catch (error) {
      console.log({'Error:':error})
    }
  }

  return (
      <Button sx={{color:'#504B38', backgroundColor:'#EBE5C2', border:'solid'}}onClick={() => login()}>Log In</Button>
  )
}

export default LoginPopover;
