import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Header from './components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import Leaderboard from './components/Leaderboard';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Header />
    <Leaderboard />
  </React.StrictMode>
);

