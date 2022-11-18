import {CategoryData} from "./category";

export interface ModuleResponse{
  category: CategoryData,
  moduleId: number,
  moduleName: string,
  comments:string,
  updatedAt:number,
  active:boolean
}
