import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import logo from "../assests/TA-Logo.png";
import { useAuth0 } from "@auth0/auth0-react";

const Navbar = () => {
  const { logout } = useAuth0();
  return (
    <AppBar position="static">
      <Toolbar>
        <Box
          component="img"
          sx={{ height: 45, marginRight: 3 }}
          alt="Logo"
          src={logo}
        />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          OPENAPI SPEC APP
        </Typography>
        <Button
          color="inherit"
          onClick={() =>
            logout({ logoutParams: { returnTo: window.location.origin } })
          }
        >
          Log Out
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
