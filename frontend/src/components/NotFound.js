import React from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const NotFound = () => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    minHeight="100vh"
  >
    <Typography variant="h4" gutterBottom>
      404 - Not Found!
    </Typography>
    <Link to="/" variant="contained">
      Go Home
    </Link>
  </Box>
);

export default NotFound;
