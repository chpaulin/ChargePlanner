import * as React from 'react';
import './App.css';

import logo from './logo.svg';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Tesla Charge Planner</h1>
          <div>
            <label>Battery type: </label>
            <select name="batteryType">
              <option value="BT37">BT37</option>
              <option value="BT85">BT85</option>
              <option value="BT70">BT70 </option>
              <option value="BTX4">BTX4</option>
              <option value="BTX5">BTX5</option>
              <option value="BTX6">BTX6</option>
              <option value="BTX8">BTX8</option>
          </select>
          </div>
          <div>
            <label>State of charge (%): </label>
            <input type="text" name="charge"/>
          </div>
          <div>
            <label>Minimum charge state: </label>
            <input type="text" name="minCharge"/>
          </div>
          <div>
            <label>Power: </label>
            <input type="text" name="power"/>
          </div>
          <div className="Result">
            <h3>Result</h3>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
