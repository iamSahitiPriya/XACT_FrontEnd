import {ContributorStructure} from "./Contributor/ContributorStructure";

export interface ModuleData{
  moduleId:number,
  moduleName:string,
  categoryName : string,
  categoryId : number,
  categoryStatus: boolean,
  active : boolean;
  contributors:ContributorStructure[]
  updatedAt : number,
  comments ?: string,
  isEdit ?: boolean
}
