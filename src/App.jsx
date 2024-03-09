import React, { useEffect, useState } from "react";
import DogImages from "./components/Gallery"; // Import the new CatImages component
import "./App.css"; // Make sure to import your CSS file

const App = () => {
  return (
    <div className='whole-page'>
      <h1>Explore Dog Images! </h1>
      <DogImages />
    </div>
  );
};

export default App;
