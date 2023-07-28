import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Test from './test';
import Header from './Components/Dashboard/Header/Header';
import Wraper from './Components/Dashboard/Wraper/Wraper';
import Login from './layout/Auth/Login';
import { HashRouter } from 'react-router-dom';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <HashRouter>
      <App />
    </HashRouter>

  </>
);
