import {ParameterStructure} from "./parameterStructure";
import {TopicReference} from "./topicReference";

export interface TopicStructure{
  topicId:number ,
  topicName:string,
  module:number,
  parameters:ParameterStructure[],
  references:TopicReference[],
}
