import React from "react";
import Button from "@mui/material/Button";
import { useGoogleLogin } from '@react-oauth/google';

function LoginPopover() {
  // retrieves data from session token to get name and email of user, which would then allow us to call the create user function which creates a user
  async function handleLogin() {
      try {
          const promise = await fetch(`${SERVER}/profile`, {
              method: 'GET',
              credentials: 'include'
          });

          const response = await promise.json()
          console.log("Response in print data:", response)
          const user = {
              name: response.user.name,
              email: response.user.email,
          }

          createUser(user.email, user.name)
          getUserID(user.email)
      } catch (error) {
          console.log(`Encountered error: ${error}`)
      }
  }   

  // ALL FUNCTIONS ABOVE HERE CAN BE ON A DIFFERENT PAGE JUST DONT KNOW WHERE
  
  // creates a session token as a cookie, then calls handleLogin() to either add the user to our database/make sure they exist
  const handleSuccess = async (authorizationCode) => {
      console.log("NOW HANDLING SUCCESSFUL LOGIN")
      const options = {
          method: 'POST', 
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              code: authorizationCode
          }),
          credentials: 'include'
      };

      try {
          const promise =  await fetch(`${SERVER}/api/auth/google`, options);
          console.log(`SUCCESSFULLY RESOLVED PROMISE: ${promise}`)
          const response = await promise.json();
          console.log(`Successful login -- response: ${response}`)
          handleLogin()
      } catch (error) {
          console.log(`Encountered an error while handling success: ${error}`)
      }

  }

  // logs user in with google and calls handleSuccess which creates a session token as a cookie
  const login = useGoogleLogin({
      flow: 'auth-code',
      onSuccess: codeResponse => {
          console.log(`Pressed login: ${codeResponse.code}`)
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
