import {TopicResponse} from "./topicResponse";

export interface ParameterResponse{
  topic: TopicResponse,
  parameterId : number,
  parameterName : string,
  comments:string,
  updatedAt:number,
  active:boolean
}
