import React from "react";
import OpenAPISpecReader from "./components/OpenAPISpecReader";
import Navbar from "./components/Navbar";
import LoginButton from "./login";
import { useAuth0 } from "@auth0/auth0-react";
import { Button, Typography, Box } from "@mui/material";
import isAuthenticated from "./login";
import isLoading from "./login";

function App() {
  const { user, loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  console.log("isAuthenticated ", isAuthenticated);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <React.Fragment>
      {user ? (
        <React.Fragment>
          <Navbar />
          <h1>Hi {user.name}</h1>
          <OpenAPISpecReader />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <LoginButton />
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default App;
