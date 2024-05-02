import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { Button, Typography, Box } from "@mui/material";
import sidelogo from "./assests/leftlogo.svg";

const Login = () => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/dashboard",
      },
    });
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <img src={sidelogo} alt="Side Logo" style={{ marginRight: "10px" }} />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        maxWidth="400px"
      >
        <Typography variant="h5" gutterBottom>
          Welcome to OpenApi Spec
        </Typography>
        <Button variant="contained" color="secondary" onClick={handleLogin}>
          Log In
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
