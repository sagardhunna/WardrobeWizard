import React, { useState } from 'react'
import LoginPopover from "../../components/LoginPopover/LoginPopover"
import { Button } from '@mui/material';

function Login() {
    const [info, setInfo] = useState('');

    const SERVER = import.meta.env.VITE_SERVER;

    const getData = async () => {
        try {
            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }
            const promise = await fetch(`${SERVER}/getData`, options)
            const response = await promise.json()
            console.log("Response from getData:", response)
            
        } catch (error) {
            console.log("Error in getData:", error)
        }
    }

  return (
    <>
        <h1>This is our log in page</h1>
        <LoginPopover />
        <Button onClick={getData}>GetData</Button>

    </>
  )
}

export default Login