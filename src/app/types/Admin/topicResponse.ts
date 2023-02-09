import {ModuleResponse} from "./moduleResponse";

export interface TopicResponse{
  moduleId:number
  topicId:number,
  topicName:string,
  updatedAt:number,
  active:boolean,
  comments:string
  categoryId : number
}
