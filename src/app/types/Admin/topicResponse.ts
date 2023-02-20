import {ParameterStructure} from "../parameterStructure";
import {TopicReference} from "../topicReference";

export interface TopicResponse{
  moduleId:number
  topicId:number,
  topicName:string,
  updatedAt:number,
  active:boolean,
  comments?:string
  categoryId : number
  parameters ?: ParameterStructure[]
  references ?: TopicReference[]
}
