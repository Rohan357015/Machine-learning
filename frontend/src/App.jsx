import { useState } from "react";
import { getMoviePoster } from "./lib.js";
import HeroPage from "./heroPage.jsx";
import MovieInfo from "./movieInfo.jsx";
import { Routes, Route } from "react-router-dom";

function App() {
 

  return (
   <div>
    <Routes>
      <Route path="/" element={<HeroPage />} />
      <Route path="/movie/:id" element={<MovieInfo />} />
    </Routes>
   </div>
  );
}

export default App;
