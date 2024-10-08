import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StartScreen from './StartPage';
import Board from './Board';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartScreen />} />
        <Route path="/game" element={<Board size={10} mines={15} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;