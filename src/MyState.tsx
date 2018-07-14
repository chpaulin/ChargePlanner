import { LowestCostPeriodForLoadResult } from "./LowestCostPeriodForLoadResult";

export class MyState {
  public location: string;
  public batteryCapacity: number;
  public charge: number;
  public chargeGoal: number;
  public power: number;
  public result: LowestCostPeriodForLoadResult;
  public isCalculating: boolean = false;
}