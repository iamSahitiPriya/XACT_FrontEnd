import {CategoryStructure} from "./categoryStructure";

export interface UserCategoryResponse{
  assessmentCategories:CategoryStructure[],
  userAssessmentCategories:CategoryStructure[]
}
