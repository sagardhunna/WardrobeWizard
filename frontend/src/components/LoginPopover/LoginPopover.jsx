import React from "react";
import Button from "@mui/material/Button";
import { useGoogleLogin } from '@react-oauth/google';

function LoginPopover() {

  const SERVER = import.meta.env.VITE_SERVER;

  async function testAPICAll(code) {
    try {
      const options = {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "auth-code": code
        })
      }

      const promise = await fetch(`${SERVER}/authToAccess`, options)
      const response = await promise.json()
      console.log("Response:", response)
    } catch (err) {
      console.log("Error is:", err)
    }
  }

  // logs user in with google and provides us with a code, this code will then be used to exchange for access and refresh tokens to keep the user logged in for a certain period of time
  const login = useGoogleLogin({
      flow: 'auth-code',
      onSuccess: codeResponse => {
          console.log(`Pressed login: ${codeResponse.code}`)
          testAPICAll(codeResponse.code)
      },
      onError: () => {
          console.log("FAILED TO LOGIN")
      }
  })

  return (
      <Button sx={{color:'#504B38'}}onClick={() => login()}>Log In</Button>
  )
}

export default LoginPopover;
