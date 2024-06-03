import React from "react";
import OpenAPISpecReader from "./components/OpenAPISpecReader";
import Login from "./login";
import { useAuth0 } from "@auth0/auth0-react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Auth0Provider, withAuthenticationRequired } from "@auth0/auth0-react";
import ErrorBoundary from "./components/error/ErrorBoundary";
import NotFound from "./components/error/NotFound";
import CircularProgress from "@mui/material/CircularProgress";
import DashBoard from "./components/Dashboard";
import Selenium from "./components/Selenium";
import PytestOption from "./components/PytestOption";
import PytestManual from "./components/PytestManual";
import PytestUpload from "./components/PytestUpload";

import { Box, CssBaseline, StyledEngineProvider } from "@mui/material";

import { ThemeProvider } from "@emotion/react";
import lightTheme from "./themes/lightTheme";
import SpecLocustReader from "./components/SpecLocustReader";

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
                  element={<ProtectedRoute component={PytestOption} />}
                />
                <Route
                  path="/home/spec"
                  element={<ProtectedRoute component={PytestUpload} />}
                />
                <Route
                  path="/home/manual"
                  element={<ProtectedRoute component={PytestManual} />}
                />
                <Route
                  path="/locust"
                  element={<ProtectedRoute component={SpecLocustReader} />}
                />
                <Route
                  path="/selenium"
                  element={<ProtectedRoute component={Selenium} />}
                />
                <Route
                  path="/dashboard"
                  element={<ProtectedRoute component={DashBoard} />}
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
