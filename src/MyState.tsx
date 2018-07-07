import { ILowestCostPeriodForLoadResult } from './App';
export class MyState {
  public batteryType: string = "BT37";
  public charge: number = 0;
  public minimumCharge: number = 0;
  public power: number = 0;
  public result: ILowestCostPeriodForLoadResult;
}