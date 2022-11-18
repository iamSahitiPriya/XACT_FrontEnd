import {CategoryData} from "./category";

export interface ModuleResponse{
  category: CategoryData,
  categoryId: number,
  categoryName: string,
  comments:string,
  updatedAt:number,
  active:boolean
}
