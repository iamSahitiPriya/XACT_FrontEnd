import {QuestionStructure} from "./questionStructure";
import {ParameterReference} from "./parameterReference";

export interface ParameterStructure{
  parameterId:number,
  parameterName:string,
  topic:number,
  questions:QuestionStructure[],
  references:ParameterReference[]
}
