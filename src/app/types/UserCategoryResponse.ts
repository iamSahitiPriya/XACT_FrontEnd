import {CategoryStructure} from "./categoryStructure";
import {AssessmentCategoryStructure} from "./AssessmentCategoryStructure";

export interface UserCategoryResponse{
  assessmentCategories:AssessmentCategoryStructure[],
  userAssessmentCategories:CategoryStructure[]
}
