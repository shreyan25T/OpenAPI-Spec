// import { useAuth0 } from "@auth0/auth0-react";
// import React from "react";

// const LoginButton = () => {
//   const { user, loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

//   return <button onClick={() => loginWithRedirect()}>Log In</button>;
// };

// export default LoginButton;

import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { Button, Typography, Box } from "@mui/material";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

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
      <Button variant="contained" onClick={() => loginWithRedirect()}>
        Log In
      </Button>
    </Box>
  );
};

export default LoginButton;
