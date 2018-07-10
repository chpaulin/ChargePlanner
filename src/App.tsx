import { LowestCostPeriodForLoadResult } from "./LowestCostPeriodForLoadResult";
import { MyState } from "./MyState";

import * as React from "react";
import {
  Button,
  Loader,
  Grid,
  Container,
  Form,
  Header,
  Dimmer
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
      <Container fluid>
        <Dimmer active={this.state.isCalculating}>
          <Loader size="massive" />
        </Dimmer>
        <Grid centered padded columns={3}>
          <Grid.Row>
            <Grid.Column />
            <Grid.Column textAlign="center">
              <img src={logo} className="App-logo" alt="logo" />

              <Header as="h3">Welcome to Tesla Charge Planner</Header>
              <br />
              <br />
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
              <Container textAlign="left">
                <Form size="huge">
                  <Form.Field
                    label="Charge state"
                    placeholder="Charge state"
                    name="charge"
                    control="input"
                    onChange={this.handleInputChange}
                  />
                  <Form.Field
                    label="Charge to"
                    placeholder="Charge to"
                    name="chargeGoal"
                    control="input"
                    onChange={this.handleInputChange}
                  />
                  <Form.Field
                    label="Charging power"
                    placeholder="Charging power"
                    name="power"
                    control="input"
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
                <div className="Result">
                  <div hidden={this.state.result === undefined}>
                    <div className="siimple-card Result">
                      <div className="siimple-card-header">
                        Cheepest time to charge
                      </div>
                      <div className="siimple-card-body">
                        Charging time:{" "}
                        {this.state.result !== undefined
                          ? this.getTimeString(this.state.result.start)
                          : 0}{" "}
                        -{" "}
                        {this.state.result !== undefined
                          ? this.getTimeString(this.state.result.stop)
                          : 0}
                      </div>
                      <div className="siimple-card-body">
                        Average cost per kWh:{" "}
                        {this.state.result !== undefined
                          ? Math.round(
                              this.state.result.averagePricePerUnit * 100
                            )
                          : 0}{" "}
                        öre
                      </div>
                      <div className="siimple-card-body">
                        Energy:{" "}
                        {this.state.result !== undefined
                          ? Math.round(this.state.result.energyUnits * 100) /
                            100
                          : 0}kWh
                      </div>
                      <div className="siimple-card-body">
                        Cost:{" "}
                        {this.state.result !== undefined
                          ? this.state.result.cost
                          : 0}{" "}
                        kr
                      </div>
                    </div>
                  </div>
                </div>
              </Container>
            </Grid.Column>
            <Grid.Column />
          </Grid.Row>
        </Grid>
      </Container>
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
