import { LowestCostPeriodForLoadResult } from "./LowestCostPeriodForLoadResult";

export class MyState {
  public batteryCapacity: number = 0;
  public charge: number = 0;
  public chargeGoal: number = 90;
  public power: number = 0;
  public result: LowestCostPeriodForLoadResult;
  public isCalculating: boolean = false;
}