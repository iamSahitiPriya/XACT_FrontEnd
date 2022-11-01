
import {TopicStructure} from "./topicStructure";

export interface ModuleResponse {
  moduleId:number,
  moduleName:string,
  categoryName : string,
  updatedAt : number,
  comments ?: string,
  topics:TopicStructure[]
}
