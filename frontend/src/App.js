import React from "react";
import OpenAPISpecReader from "./components/OpenAPISpecReader";
import Login from "./login";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Auth0Provider, withAuthenticationRequired } from "@auth0/auth0-react";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./components/NotFound";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Button,
  Typography,
  Box,
  CssBaseline,
  StyledEngineProvider,
} from "@mui/material";

import { ThemeProvider } from "@emotion/react";
import lightTheme from "./themes/lightTheme";

const ProtectedRoute = ({ component, ...args }) => {
  const Component = withAuthenticationRequired(component, args);
  return <Component />;
};

function App() {
  const { user, loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  console.log("isAuthenticated ", isAuthenticated);

  if (isLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <CircularProgress color="secondary" />
      </Box>
    );
  }
  return (
    <React.Fragment>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={lightTheme}>
          <CssBaseline />
          <Box display={"flex"} flexDirection={"column"}>
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route
                  path="/home"
                  element={<ProtectedRoute component={OpenAPISpecReader} />}
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          </Box>
        </ThemeProvider>
      </StyledEngineProvider>
    </React.Fragment>
  );
}

export default App;
