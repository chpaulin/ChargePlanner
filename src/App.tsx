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
        <h3>Welcome to Tesla Charge Planner</h3>
        <div className="container">
          <div className="row">
          <div className="col-lg-4"/>
            <div className="col-lg-4">
              <form>                
                <div className="form-group">
                  {/* <label htmlFor="charge" className="small-caps">State of charge (%)</label> */}
                  <input type="number" className="form-control form-control-lg" name="charge" onChange={this.handleInputChange} placeholder="State of charge (%)" />
                </div>
                <div className="form-group">
                  {/* <label htmlFor="chargeGoal" className="small-caps"></label> */}
                  <input type="number" className="form-control form-control-lg" name="chargeGoal" onChange={this.handleInputChange} placeholder="Charge to (%)" />
                </div>
                <div className="form-group">
                  {/* <div className="field-label"></div> */}
                  <input type="text" className="form-control form-control-lg" name="power" onChange={this.handleInputChange} placeholder="Charging power (kW)" />
                </div>
                <button type="button" onClick={this.calculate} className="btn btn-primary btn-lg">Calculate</button>

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


              </form>
            </div>
            <div className="col-lg-4"/>
          </div>
        </div>
      </div>
    );
  }

  private getTimeString = (time: string): string => {

    const date = new Date(time);

    return date.toLocaleTimeString("sv-SE", { timeZone: "Europe/Stockholm" } as Intl.DateTimeFormatOptions)
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

    const energy = 0.72 * (this.state.chargeGoal - this.state.charge);

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
