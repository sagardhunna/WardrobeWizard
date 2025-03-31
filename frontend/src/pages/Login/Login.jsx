import React, { useState } from 'react'
import LoginPopover from "../../components/LoginPopover/LoginPopover"
import { Button } from '@mui/material';

function Login() {
    const [info, setInfo] = useState('');

  return (
    <>
        <h1>This is our log in page</h1>
        <LoginPopover />
    </>
  )
}

export default Login