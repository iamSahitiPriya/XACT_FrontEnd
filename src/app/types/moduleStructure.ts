import {TopicStructure} from "./topicStructure";

export interface ModuleStructure{
  moduleId:number,
  moduleName:string,
  category:number,
  topics:TopicStructure[]
}
