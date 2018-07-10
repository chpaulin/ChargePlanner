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
  List
} from "semantic-ui-react";
import "./App.css";

import logo from "./logo.svg";

class App extends React.Component {
  public state: MyState;

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
        <div className="inner center">
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
          <Form size="huge" autoComplete="off">
            <Form.Input
              label="Charge state"
              placeholder="Charge state"
              name="charge"
              control="input"
              type="number"
              onChange={this.handleInputChange}
            />
            <Form.Field
              label="Charge to"
              placeholder="Charge to"
              name="chargeGoal"
              control="input"
              type="number"
              onChange={this.handleInputChange}
            />
            <Form.Field
              label="Charging power"
              placeholder="Charging power"
              name="power"
              control="input"
              type="number"
              onChange={this.handleInputChange}
            />
            <Button
              size="huge"
              onClick={this.calculate}
              active={this.canCalculate()}
            >
              Calculate
                  </Button>
          </Form>
          <Segment className={this.state.result === undefined ? "hidden" : ""}>
            <Label as='a' color='red' ribbon size="huge">
              Cheapest time to charge
            </Label>
            <List size="huge" divided>

              {/* <Table.Header>
                <List.Item>
                  <Table.HeaderCell colSpan='2'>Cheapest time to charge</Table.HeaderCell>
                </List.Item>
              </Table.Header> */}

              <List.Item>
                <List.Header>Charging time</List.Header>
                <List.Item>{this.state.result !== undefined
                  ? this.getTimeString(this.state.result.start)
                  : 0}{" "}
                  -{" "}
                  {this.state.result !== undefined
                    ? this.getTimeString(this.state.result.stop)
                    : 0}</List.Item>
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
    } as Intl.DateTimeFormatOptions);
  };

  private handleInputChange = (event: any) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  };

  private calculate = async () => {
    this.state.isCalculating = true;

    this.forceUpdate();

    const energy = 0.72 * (this.state.chargeGoal - this.state.charge);

    const url = `http://spotpriceapi.azurewebsites.net/operations/GetLowestCostPeriodForLoad?area=SE3&energy=${energy}&power=${
      this.state.power
      }`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/json"
      },
      method: "GET"
    } as RequestInit);

    this.state.result = (await response.json()) as LowestCostPeriodForLoadResult;

    this.state.isCalculating = false;

    this.forceUpdate();
  };
}

export default App;
