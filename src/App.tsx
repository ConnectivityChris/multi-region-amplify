import React from 'react';
import logo from './logo.svg';
import './App.css';
import exports from './aws-exports';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <b>The Region is: {exports.aws_project_region}</b>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  );
}

export default App;
