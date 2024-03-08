import React, { useEffect, useState } from "react";
import CatImages from "./components/Gallery"; // Import the new CatImages component
import "./App.css"; // Make sure to import your CSS file

const App = () => {
  return (
    <div className='whole-page'>
      <h1>Explore Cat Images! 🐱</h1>
      <CatImages />
    </div>
  );
};

export default App;
