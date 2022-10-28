/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {AssessmentStructure} from "../../types/assessmentStructure";
import {AssessmentRequest} from "../../types/assessmentRequest";
import {SaveRequest} from "../../types/saveRequest";
import {AssessmentNotes} from "../../types/assessmentNotes";
import {TopicRating} from "../../types/topicRating";
import {ParameterRating} from "../../types/parameterRating";
import {ReportDataStructure} from "../../types/ReportDataStructure";
import {AdminAssessmentRequest} from "../../types/Admin/adminAssessmentRequest";
import {CategoryResponse} from "../../types/categoryResponse";
import {TopicLevelRecommendationTextRequest} from "../../types/topicLevelRecommendationTextRequest";
import {ParameterLevelRecommendationTextRequest} from "../../types/parameterLevelRecommendationTextRequest";
import {AdminAssessmentResponse} from "../../types/Admin/adminAssessmentResponse";
import {UserCategoryResponse} from "../../types/UserCategoryResponse";
import {UserAssessmentModuleRequest} from "../../types/UserAssessmentModuleRequest";
import {OrganisationResponse} from "../../types/OrganisationResponse";


@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  constructor(private http: HttpClient) {
  }

  public getAssessments(): Observable<AssessmentStructure[]> {
    return this.http.get<AssessmentStructure[]>(environment.BaseURI + environment.ASSESSMENT_URI);
  }

  public addAssessments(assessmentData: AssessmentRequest): Observable<any> {
    const headers = {'content-type': 'application/json'}
    return this.http.post(environment.BaseURI + environment.ASSESSMENT_URI, assessmentData, {'headers': headers})
  }

  public getCategories(assessmentId:number): Observable<UserCategoryResponse> {
    return this.http.get<UserCategoryResponse>(environment.BaseURI + environment.CATEGORY_URI + "/" + assessmentId+"/categories/all")
  }

  public getOnlySelectedCategories(assessmentId:number): Observable<UserCategoryResponse> {
    return this.http.get<UserCategoryResponse>(environment.BaseURI + environment.CATEGORY_URI + "/" + assessmentId+"/categories")
  }


  public saveAssessment(assessmentAnswer: SaveRequest) {
    const headers = {'content-type': 'application/json'}
    return this.http.post(environment.BaseURI + environment.SAVE_ASSESSMENT_URI + "/" + assessmentAnswer.assessmentId, assessmentAnswer.topicRequest, {'headers': headers})
  }

  generateReport(assessmentId: number) {
    return this.http.get(environment.BaseURI + environment.ASSESSMENT_REPORT_URI + assessmentId, {responseType: 'blob'})
  }

  finishAssessment(assessmentId: number): Observable<AssessmentStructure> {
    return this.http.put<AssessmentStructure>(environment.BaseURI + environment.ASSESSMENT_URI + "/" + assessmentId + environment.ASSESSMENT_STATUS_FINISH_URI, null);
  }

  getAssessment(assessmentId: number): Observable<AssessmentStructure> {
    return this.http.get<AssessmentStructure>(environment.BaseURI + environment.ASSESSMENT_URI + "/" + assessmentId);
  }

  reopenAssessment(assessmentId: number): Observable<AssessmentStructure> {
    return this.http.put<AssessmentStructure>(environment.BaseURI + environment.ASSESSMENT_URI + "/" + assessmentId + environment.ASSESSMENT_STATUS_OPEN_URI, null);
  }

  saveNotes(assessmentNotes: AssessmentNotes) {
    const headers = {'content-type': 'application/json'}
    return this.http.patch(environment.BaseURI + environment.SAVE_ASSESSMENT_ANSWER_URI + "/" + assessmentNotes.assessmentId + "/" + assessmentNotes.questionId, assessmentNotes.notes, {'headers': headers})
  }


  saveTopicRecommendationText(topicLevelRecommendationText: TopicLevelRecommendationTextRequest): Observable<any> {
    const headers = {'content-type': 'application/json'}
    return this.http.patch(environment.BaseURI + environment.SAVE_TOPIC_RECOMMENDATION_TEXT_URI + "/" + topicLevelRecommendationText.assessmentId + "/" + topicLevelRecommendationText.topicId, topicLevelRecommendationText.topicLevelRecommendation, {'headers': headers})
  }


  saveTopicRecommendationFields(topicLevelRecommendationText: TopicLevelRecommendationTextRequest): Observable<any> {
    const headers = {'content-type': 'application/json'}
    return this.http.patch(environment.BaseURI + environment.SAVE_TOPIC_RECOMMENDATION_FIELD_URI + "/" + topicLevelRecommendationText.assessmentId + "/" + topicLevelRecommendationText.topicId, topicLevelRecommendationText.topicLevelRecommendation, {'headers': headers})
  }

  deleteTopicRecommendation(assessmentId: number, topicId: number, recommendationId: number): Observable<any> {
    const headers = {'content-type': 'application/json'}
    return this.http.delete(environment.BaseURI + environment.DELETE_TOPIC_RECOMMENDATION_URI + "/" + assessmentId + "/" + topicId + "/" + recommendationId, {'headers': headers});
  }

  saveParameterRecommendation(parameterLevelRecommendationText: ParameterLevelRecommendationTextRequest): Observable<any> {
    const headers = {'content-type': 'application/json'}
    return this.http.patch(environment.BaseURI + environment.SAVE_PARAMETER_RECOMMENDATION_URI + "/" + parameterLevelRecommendationText.assessmentId + "/" + parameterLevelRecommendationText.parameterId, parameterLevelRecommendationText.parameterLevelRecommendation, {'headers': headers})
  }

  deleteParameterRecommendation(assessmentId: number, parameterId: number, recommendationId: number): Observable<any> {
    const headers = {'content-type': 'application/json'}
    return this.http.delete(environment.BaseURI + environment.DELETE_PARAMETER_RECOMMENDATION_URI + "/" + assessmentId + "/" + parameterId + "/" + recommendationId, {'headers': headers});
  }

  saveTopicRating(topicRating: TopicRating) {
    const headers = {'content-type': 'application/json'}
    return this.http.patch(environment.BaseURI + environment.SAVE_TOPIC_RATING_URI + "/" + topicRating.assessmentId + "/" + topicRating.topicId, topicRating.rating, {'headers': headers})
  }

  saveParameterRating(parameterRating: ParameterRating) {
    const headers = {'content-type': 'application/json'}
    return this.http.patch(environment.BaseURI + environment.SAVE_PARAMETER_RATING_URI + "/" + parameterRating.assessmentId + "/" + parameterRating.parameterId, parameterRating.rating, {'headers': headers})
  }

  updateAssessment(assessmentId: number, assessmentData: AssessmentRequest): Observable<AssessmentStructure> {
    return this.http.put<AssessmentStructure>(environment.BaseURI + environment.ASSESSMENT_URI + "/" + assessmentId, assessmentData,);
  }

  getUserRole() {
    return this.http.get(environment.BaseURI + environment.ROLE_URI);
  }

  getReportData(assessmentId:number):Observable<ReportDataStructure>{
    return this.http.get<ReportDataStructure>(environment.BaseURI + environment.REPORT_DATA_URI + "/"+assessmentId);
  }


  getAdminAssessment(adminAssessmentRequest:AdminAssessmentRequest):Observable<AdminAssessmentResponse>{
  const headers = {'content-type': 'application/json'}
  return this.http.get<AdminAssessmentResponse>(environment.BaseURI + environment.GET_ADMIN_ASSESSMENTS +"/"+adminAssessmentRequest.startDate+"/"+adminAssessmentRequest.endDate,{'headers':headers} );
}
  getAllCategories():Observable<CategoryResponse[]>{
    return this.http.get<CategoryResponse[]>(environment.BaseURI + environment.ALL_CATEGORY_URI);
  }
  saveCategory(categoryRequest:any){
    return this.http.post(environment.BaseURI + environment.SAVE_CATEGORY_URI, categoryRequest)
  }
  updateCategory(categoryRequest:any){
    return this.http.put(environment.BaseURI + environment.UPDATE_CATEGORY_URI + "/" + categoryRequest.categoryId , categoryRequest);
  }

  generateAdminReport(adminAssessmentRequest: AdminAssessmentRequest) {
    return this.http.get(environment.BaseURI + environment.ASSESSMENT_ADMIN_REPORT_URI + "/" + adminAssessmentRequest.assessmentId + "/"+adminAssessmentRequest.startDate+"/"+adminAssessmentRequest.endDate, {responseType: 'blob'})
  }

  getTemplate() {
    return this.http.get(environment.BaseURI + environment.REPORT_TEMPLATE_URI, {responseType: 'blob'})
  }
  saveUserModules(moduleRequest:UserAssessmentModuleRequest[],assessmentId:number){
    return this.http.post(environment.BaseURI + environment.ASSESSMENT_URI + "/" + assessmentId + environment.USER_ASSESSMENT_MODULE_URI, moduleRequest)
  }
  updateUserModules(moduleRequest:UserAssessmentModuleRequest[],assessmentId:number){
    return this.http.put(environment.BaseURI + environment.ASSESSMENT_URI + "/" + assessmentId + environment.USER_ASSESSMENT_MODULE_URI, moduleRequest)
  }

  getOrganizationName(name : string):Observable<OrganisationResponse[]>{
    return this.http.get<OrganisationResponse[]>(environment.BaseURI + environment.ACCOUNT_URI+ "/" + name)
  }
}


