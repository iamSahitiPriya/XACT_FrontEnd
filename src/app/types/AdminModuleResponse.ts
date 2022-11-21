import {CategoryData} from "./category";
export interface AdminModuleResponse {
   category:CategoryData;
  moduleId:number,
  moduleName:string,
  active : boolean;
  updatedAt : number,
  comments ?: string,
}
