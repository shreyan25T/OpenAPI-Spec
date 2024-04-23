import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { Button, Typography, Box } from "@mui/material";

const Login = () => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/home",
      },
    });
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <Typography variant="h4" gutterBottom>
        Welcome to OpenApi Spec
      </Typography>
      <Button variant="contained" onClick={handleLogin}>
        Log In
      </Button>
    </Box>
  );
};

export default Login;
