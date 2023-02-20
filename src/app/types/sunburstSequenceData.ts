import {SunburstSequenceChild} from "./sunburstSequenceChild";

export interface SunburstSequenceData{
  children: SunburstSequenceChild []
  name: string
  rating?: number
  value?:number
}
