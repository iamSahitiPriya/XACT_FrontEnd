import {ModuleResponse} from "./moduleResponse";

export interface TopicResponse {
  module: ModuleResponse,
  topicId: number,
  topicName: string,
  comments:string,
  updatedAt:number,
  active:boolean
}
