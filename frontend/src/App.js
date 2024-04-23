import React from "react";
import OpenAPISpecReader from "./components/OpenAPISpecReader";
import Login from "./login";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Routes, Route,useNavigate} from 'react-router-dom';
import { Auth0Provider, withAuthenticationRequired } from '@auth0/auth0-react';
import NotFound from "./components/NotFound";

const ProtectedRoute = ({ component, ...args }) => {
  const Component = withAuthenticationRequired(component, args);
  return <Component />;
};

function App() {
  const { user, loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  console.log("isAuthenticated ", isAuthenticated);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <React.Fragment>
      <Routes>
        <Route path="/"  element={<Login />} />
        <Route path="/home"  element={<ProtectedRoute component={OpenAPISpecReader} />} />

      </Routes>
    </React.Fragment>
  );
}

export default App;
