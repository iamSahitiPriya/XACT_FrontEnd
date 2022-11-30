import {ModuleResponse} from "./moduleResponse";

export interface TopicResponse{
  module:ModuleResponse
  topicId:number,
  topicName:string,
  updatedAt:number,
  active:boolean,
  comments:string
}
