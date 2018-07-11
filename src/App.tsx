import { Battery } from "./Battery";
import { LowestCostPeriodForLoadResult } from "./LowestCostPeriodForLoadResult";
import { MyState } from "./MyState";
import * as React from "react";
import {
  Button,
  Loader,
  Form,
  Header,
  Dimmer,
  Label,
  Segment,
  List,
  Dropdown,
  // Grid
} from "semantic-ui-react";
import "./App.css";

import logo from "./logo.svg";

class App extends React.Component {
  public state: MyState;
  private batteryTypes: Battery[] = new Array<Battery>(
    {
      text: "60 kWh",
      value: 56.3
    },
    {
      text: "60 kWh (75)",
      value: 60
    },
    {
      text: "70 kWh",
      value: 65.7
    },
    {
      text: "75 kWh",
      value: 71.6
    },
    {
      text: "85 kWh",
      value: 73.4
    },
    {
      text: "90 kWh",
      value: 79.8
    },
    {
      text: "100 kWh",
      value: 95.7
    }
  );

  constructor(props: any) {
    super(props);

    this.state = new MyState();
  }

  public render() {

    return (
      <div className="content">
        <Dimmer active={this.state.isCalculating}>
          <Loader size="massive" />
        </Dimmer>
        <div className="header">
          <img src={logo} className="App-logo" alt="logo" />

          <Header as="h2">Welcome to Tesla Charge Planner</Header>
          <br />
          <br />
        </div>
        <div className="outer center">
          <div className={`inner ${this.state.result !== undefined ? "hidden" : ""}`}>

            <Form size="huge" autoComplete="off">
              <Form.Field>
                <label>Battery</label>
                <Dropdown name="batteryCapacity" placeholder='Select battery size' fluid selection options={this.batteryTypes} onChange={this.handleDropdownChange} />
              </Form.Field>

              <Form.Field
                label="Charge state"
                placeholder="Enter charge state"
                name="charge"
                control="input"
                type="number"
                onChange={this.handleInputChange}
              />
              <Form.Field
                label="Charge to"
                placeholder="Enter charging goal"
                name="chargeGoal"
                control="input"
                type="number"
                onChange={this.handleInputChange}
              />
              <Form.Field
                label="Charging power"
                placeholder="Enter charging power"
                name="power"
                control="input"
                type="number"
                onChange={this.handleInputChange}
              />
              <Button
                size="huge"
                onClick={this.calculate}
                active={this.canCalculate()}
                className={this.canCalculate() ? "red" : ""}
                fluid
              >Calculate</Button>
            </Form>
          </div>
          <div className={`inner ${this.state.result === undefined ? "hidden" : ""}`}>
            <Segment className={this.state.result === undefined ? "hidden" : ""}>
              <Label as='a' color='red' ribbon size="huge">
                Cheapest time to charge
            </Label>
              <List size="huge" divided>
                <List.Item>
                  <List.Header>Start charging</List.Header>
                  <List.Item>{this.state.result !== undefined
                    ? this.getTimeString(this.state.result.start)
                    : ""}
                  </List.Item>
                </List.Item>
                <List.Item>
                  <List.Header>Duration</List.Header>
                  <List.Item>{this.state.result !== undefined
                    ? this.getDurationString(this.state.result.start, this.state.result.stop)
                    : ""}
                  </List.Item>
                </List.Item>
                <List.Item>
                  <List.Header>Average price</List.Header>
                  <List.Item>{this.state.result !== undefined
                    ? Math.round(
                      this.state.result.averagePricePerUnit * 100
                    )
                    : 0} öre/kWh</List.Item>
                </List.Item>
                <List.Item>
                  <List.Header>Energy</List.Header>
                  <List.Item> {this.state.result !== undefined
                    ? Math.round(this.state.result.energyUnits * 100) /
                    100
                    : 0} kWh</List.Item>
                </List.Item>
                <List.Item>
                  <List.Header>Charging cost</List.Header>
                  <List.Item>{this.state.result !== undefined
                    ? this.state.result.cost
                    : 0} kr</List.Item>
                </List.Item>
              </List>
            </Segment>
            <Button
                size="huge"
                onClick={this.reset}
                className="red"
                fluid
              >New calculation...</Button>
          </div>
        </div>        
      </div>
    );
  }

  private canCalculate = (): boolean => {
    return this.state.charge > 0 && this.state.chargeGoal > 0 && this.state.power > 0;
  };

  private getTimeString = (time: string): string => {
    const date = new Date(time);

    return date.toLocaleTimeString("sv-SE", {
      timeZone: "Europe/Stockholm"
    } as Intl.DateTimeFormatOptions).substr(0, 5);
  };

  private getDurationString = (start: string, stop: string): string => {
    const dateStart = Date.parse(start);
    const dateStop = Date.parse(stop);

    const duration = dateStop - dateStart;

    let minutes =  Math.ceil(duration / 60000);
    const hours =  Math.floor(minutes / 60);
    minutes -= hours * 60; 

    return `${hours}h ${minutes}m`;
  };

  private handleDropdownChange = (event: any, data: any) => {
    const name = data.name;
    const value = data.value;

    this.setState({
      [name]: value
    });
  };


  private handleInputChange = (event: any) => {
    const target = event.target;
    let value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  };

  private reset = async () => {
    this.setState({
      result: undefined
    });
  };

  private calculate = async () => {
    this.setState({
      isCalculating: true
    });

    const energy = (this.state.batteryCapacity / 100) * (this.state.chargeGoal - this.state.charge);

    const url = `http://spotpriceapi.azurewebsites.net/operations/GetLowestCostPeriodForLoad?area=SE3&energy=${energy}&power=${
      this.state.power
      }`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/json"
      },
      method: "GET"
    } as RequestInit);

    this.setState({
      result: (await response.json()) as LowestCostPeriodForLoadResult,
      isCalculating: false
    });
  };
}

export default App;
