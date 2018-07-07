import { LowestCostPeriodForLoadResult } from './LowestCostPeriodForLoadResult';
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
        </header>
        <div className="siimple-form">
          <div className="siimple-form-title">Welcome to Tesla Charge Planner</div>
          <div className="siimple-content siimple-content--extra-extra-small">
            {/* <div className="siimple-form-field">
            <div className="siimple-form-field-label">Battery type</div>
            <select name="batteryType" className="siimple-input siimple-select--fluid" value={this.state.batteryType} onChange={this.handleInputChange}>
              <option value="BT37">BT37</option>
              <option value="BT85">BT85</option>
              <option value="BT70">BT70 </option>
              <option value="BTX4">BTX4</option>
              <option value="BTX5">BTX5</option>
              <option value="BTX6">BTX6</option>
              <option value="BTX8">BTX8</option>
            </select>
          </div> */}
            <div className="siimple-form-field">
              <div className="siimple-form-field-label">State of charge (%)</div>
              <input type="text" className="siimple-input siimple-input--fluid" name="charge" onChange={this.handleInputChange} placeholder="50" />
            </div>
            <div className="siimple-form-field">
              <div className="siimple-form-field-label">Charge to (%)</div>
              <input type="text" className="siimple-input siimple-input--fluid" name="chargeGoal" onChange={this.handleInputChange} placeholder="90" />
            </div>
            <div className="siimple-form-field">
              <div className="siimple-form-field-label">Charging power (kW)</div>
              <input type="text" className="siimple-input siimple-input--fluid" name="power" onChange={this.handleInputChange} placeholder="11" />
            </div>
            <button onClick={this.calculate} className="siimple-btn siimple-btn--teslared">Calculate</button>

            <div className="Result" >
              <div hidden={!this.state.isCalculating}>
                <div className="siimple-spinner siimple-spinner--teslared siimple-spinner--large" />
              </div>
              <div hidden={this.state.result === undefined}>
                <div className="siimple-card Result">
                  <div className="siimple-card-header">Cheepest time to charge</div>
                  <div className="siimple-card-body">Charging time: {this.state.result !== undefined ? this.getTimeString(this.state.result.start) : 0} - {this.state.result !== undefined ? this.getTimeString(this.state.result.stop) : 0}</div>
                  <div className="siimple-card-body">Average cost per kWh: {this.state.result !== undefined ? Math.round(this.state.result.averagePricePerUnit * 100) : 0} öre</div>
                  <div className="siimple-card-body">Energy: {this.state.result !== undefined ? Math.round(this.state.result.energyUnits * 100) / 100 : 0}kWh</div>
                  <div className="siimple-card-body">Cost: {this.state.result !== undefined ? this.state.result.cost : 0} kr</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    );
  }

  private getTimeString = (time: string): string => {

    const date = new Date(time);

    return date.toLocaleTimeString("sv-SE", {timeZone: "Europe/Stockholm"} as Intl.DateTimeFormatOptions)
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

    this.state.isCalculating = true;

    this.forceUpdate();

    const energy = 0.72 * (90 - this.state.charge);

    const url = `http://spotpriceapi.azurewebsites.net/operations/GetLowestCostPeriodForLoad?area=SE3&energy=${energy}&power=${this.state.power}`;

    const response = await fetch(url,
      {
        headers: {
          'Accept': 'application/json'
        },
        method: "GET"
      } as RequestInit);

    this.state.result = await response.json() as LowestCostPeriodForLoadResult;

    this.state.isCalculating = false;

    this.forceUpdate();
  }
}

export default App;
