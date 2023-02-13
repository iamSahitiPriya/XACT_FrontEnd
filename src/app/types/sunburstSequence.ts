import {SunburstSequenceTarget} from "./sunburstSequenceTarget";
import {SunburstSequenceData} from "./sunburstSequenceData";

export interface SunburstSequence{
  children : SunburstSequence
  current : SunburstSequence
  data : SunburstSequenceData
  depth: number
  height : number
  parent : SunburstSequence
  target: SunburstSequenceTarget
  value: number
  x0:number
  x1:number
  y0:number
  y1:number

}
