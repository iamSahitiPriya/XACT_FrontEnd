import {TopicStructure} from "../topicStructure";

export interface ModuleResponse{
  categoryId: number,
  moduleId:number,
  moduleName:string,
  comments ?:string,
  updatedAt:number,
  active:boolean,
  topics ?: TopicStructure[]
}
