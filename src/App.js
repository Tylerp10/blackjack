import React from "react";
import Register from "./components/register";
import Signin from "./components/signin";
import Game from "./components/game";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />}></Route>
        <Route path="/signin" element={<Signin />}></Route>
        <Route path="/game" element={<Game />}></Route>
      </Routes>
    </BrowserRouter>  
  )
}

export default App;
