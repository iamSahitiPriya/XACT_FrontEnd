export interface ParameterRecommendationResponse{
  "assessmentId":number;
  "parameterId":number;
  "recommendationId"?:number;
  "recommendation"?:string;
  "impact"?:string;
  "effort"?:string;
  "deliveryHorizon"?:string;
}
