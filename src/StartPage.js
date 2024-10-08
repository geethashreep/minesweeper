import React from 'react';
import { useNavigate } from "react-router-dom";
import './StartPage.css';

const StartScreen = () => {
  const navigate = useNavigate();

  const startGame = () => {
    navigate('/game');
  };

  return (
    <div className="start-screen">
        <div class="content">
      <p>Welcome to the ultimate Minesweeping Adventure! Are you ready to dig deep and uncover some fun?</p>
      <button id="start" onClick={startGame}>Ready, Set, Sweep!!</button>
      </div>
    </div>
  );
};

export default StartScreen;