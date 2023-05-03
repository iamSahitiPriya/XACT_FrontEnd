import {TopicStructure} from "../topicStructure";
import {ContributorStructure} from "../Contributor/ContributorStructure";

export interface ModuleResponse{
  categoryId: number,
  moduleId:number,
  moduleName:string,
  comments ?:string,
  updatedAt:number,
  contributors?:ContributorStructure[]
  active:boolean,
  topics ?: TopicStructure[]
}
