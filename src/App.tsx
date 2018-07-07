import { MyState } from './MyState';

import * as React from 'react';
import './App.css';

import logo from './logo.svg';

class App extends React.Component {

  public state: MyState;

  constructor(props: any) {
    super(props);

    this.state = new MyState();
  }

  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Tesla Charge Planner</h1>
          <div>
            <label>Battery type: </label>
            <select name="batteryType" value={this.state.batteryType} onChange={this.handleInputChange}>
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
            <input type="text" name="charge" value={this.state.charge} onChange={this.handleInputChange} />
          </div>
          <div>
            <label>Minimum charge state: </label>
            <input type="text" name="minimumCharge" onChange={this.handleInputChange} />
          </div>
          <div>
            <label>Power: </label>
            <input type="text" name="power" value={this.state.power} onChange={this.handleInputChange} />
          </div>
          <button onClick={this.calculate}>
            Calculate
          </button>
          <div className="Result" hidden={this.state.result === undefined}>
            <h3>Result</h3>
            <div>Cost: {this.state.result !== undefined ? this.state.result.cost : 0}kr</div>
            <div>Energy: {this.state.result !== undefined ? Math.round(this.state.result.energyUnits * 100) / 100 : 0}kWh</div>
            <div>Charging time: {this.state.result !== undefined ? this.state.result.start : 0} - {this.state.result !== undefined ? this.state.result.start : 0}</div>
          </div>
        </header>
      </div>
    );
  }

  private handleInputChange = (event: any) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  private calculate = async () => {

    const power = 7;
    const energy = 0.72 * (90 - this.state.charge);

    const url = `http://spotpriceapi.azurewebsites.net/operations/GetLowestCostPeriodForLoad?area=SE3&energy=${energy}&power=${power}`;

    const response = await fetch(url,
      {
        headers: {
          'Accept': 'application/json'
        },
        method: "GET"
      } as RequestInit);

    this.state.result = await response.json() as ILowestCostPeriodForLoadResult;

    this.forceUpdate();
  }
}

export interface ILowestCostPeriodForLoadResult {
  cost: number;
  energyUnits: number;
  averagePricePerUnit: number;
  unitType: string;
  currency: string;
  start: Date;
  stop: Date;
}

export default App;
