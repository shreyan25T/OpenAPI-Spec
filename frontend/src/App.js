import React from 'react';
import OpenAPISpecReader from './components/OpenAPISpecReader';
import Navbar from './components/Navbar';

function App() {
  return (
    <React.Fragment>
      <Navbar/>
      <h1>OpenAPI Spec Reader</h1>
      <OpenAPISpecReader />
      </React.Fragment>
  );
}

export default App;
