/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {AssessmentStructure} from "../../types/assessmentStructure";
import {AssessmentRequest} from "../../types/assessmentRequest";
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
import {UserQuestion} from "../../types/UserQuestion";
import {TopicReference} from "../../types/topicReference";
import {AnswerRequest} from "../../types/answerRequest";
import {UserQuestionRequest} from "../../types/userQuestionRequest";
import {ParameterReference} from "../../types/parameterReference";
import {QuestionStructure} from "../../types/questionStructure";
import {SummaryResponse} from "../../types/summaryResponse";
import template from "string-placeholder";


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
    return this.http.post(environment.BaseURI + environment.ASSESSMENT_URI, assessmentData)
  }

  public getCategories(assessmentId: number): Observable<UserCategoryResponse> {
    return this.http.get<UserCategoryResponse>(environment.BaseURI + environment.ASSESSMENT_URI + "/" + assessmentId + "/categories/all")
  }

  public getOnlySelectedCategories(assessmentId: number): Observable<UserCategoryResponse> {
    return this.http.get<UserCategoryResponse>(environment.BaseURI + environment.ASSESSMENT_URI + "/" + assessmentId + "/categories")
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

  saveNotes(assessmentId: number, answerRequest: AnswerRequest) {
    return this.http.patch(environment.BaseURI + environment.SAVE_ASSESSMENT_ANSWER_URI + "/" + assessmentId + "/" + "answers" + "/" + answerRequest.questionId, answerRequest)
  }


  saveTopicRecommendation(topicLevelRecommendationText: TopicLevelRecommendationTextRequest): Observable<any> {
    const topicRecommendationURI = this.formatURI(environment.SAVE_TOPIC_RECOMMENDATION_URI, {
      assessmentId: topicLevelRecommendationText.assessmentId,
      topicId: topicLevelRecommendationText.topicId
    })
    return this.http.patch(environment.BaseURI + topicRecommendationURI, topicLevelRecommendationText.topicLevelRecommendation)
  }

  deleteTopicRecommendation(assessmentId: number, topicId: number, recommendationId: number): Observable<any> {
    const topicRecommendationURI = this.formatURI(environment.DELETE_TOPIC_RECOMMENDATION_URI, {
      assessmentId: assessmentId,
      topicId: topicId,
      recommendationId: recommendationId
    })
    return this.http.delete(environment.BaseURI + topicRecommendationURI);
  }

  saveParameterRecommendation(parameterLevelRecommendationText: ParameterLevelRecommendationTextRequest): Observable<any> {
    const paramRecommendationURI = this.formatURI(environment.SAVE_PARAMETER_RECOMMENDATION_URI, {
      assessmentId: parameterLevelRecommendationText.assessmentId,
      parameterId: parameterLevelRecommendationText.parameterId
    });
    return this.http.patch(environment.BaseURI + paramRecommendationURI, parameterLevelRecommendationText.parameterLevelRecommendation)
  }

  deleteParameterRecommendation(assessmentId: number, parameterId: number, recommendationId: number): Observable<any> {
    const parameterRecommendationURI = this.formatURI(environment.DELETE_PARAMETER_RECOMMENDATION_URI, {
      assessmentId: assessmentId,
      parameterId: parameterId,
      recommendationId: recommendationId
    })
    return this.http.delete(environment.BaseURI + parameterRecommendationURI);
  }

  saveTopicRating(topicRating: TopicRating) {
    const topicRatingURI = this.formatURI(environment.SAVE_TOPIC_RATING_URI, {
      assessmentId: topicRating.assessmentId,
      topicId: topicRating.topicId
    })
    return this.http.patch(environment.BaseURI + topicRatingURI, topicRating.rating)
  }

  saveParameterRating(parameterRating: ParameterRating) {
    const parameterRatingURI = this.formatURI(environment.SAVE_PARAMETER_RATING_URI, {
      assessmentId: parameterRating.assessmentId,
      parameterId: parameterRating.parameterId
    })
    return this.http.patch(environment.BaseURI + parameterRatingURI, parameterRating.rating)
  }

  updateAssessment(assessmentId: number, assessmentData: AssessmentRequest): Observable<AssessmentStructure> {
    return this.http.put<AssessmentStructure>(environment.BaseURI + environment.ASSESSMENT_URI + "/" + assessmentId, assessmentData,);
  }

  getUserRole() {
    return this.http.get(environment.BaseURI + environment.ROLE_URI);
  }

  getReportData(assessmentId: number): Observable<ReportDataStructure> {
    return this.http.get<ReportDataStructure>(environment.BaseURI + environment.ASSESSMENT_REPORT_URI + assessmentId + environment.REPORT_DATA_URI);
  }


  getAdminAssessment(adminAssessmentRequest: AdminAssessmentRequest): Observable<AdminAssessmentResponse> {
    return this.http.get<AdminAssessmentResponse>(environment.BaseURI + environment.GET_ADMIN_ASSESSMENTS + "/" + adminAssessmentRequest.startDate + "/" + adminAssessmentRequest.endDate);
  }

  getAllCategories(): Observable<CategoryResponse[]> {
    return this.http.get<CategoryResponse[]>(environment.BaseURI + environment.ALL_CATEGORY_URI);
  }


  saveCategory(categoryRequest: any) {
    return this.http.post(environment.BaseURI + environment.SAVE_CATEGORY_URI, categoryRequest)
  }

  saveParameter(parameterRequest: any) {
    return this.http.post(environment.BaseURI + environment.SAVE_PARAMETER_URI, parameterRequest)
  }

  saveModule(moduleRequest: any) {
    return this.http.post(environment.BaseURI + environment.SAVE_MODULE_URI, moduleRequest)
  }

  updateCategory(categoryRequest: any) {
    return this.http.put(environment.BaseURI + environment.UPDATE_CATEGORY_URI + "/" + categoryRequest.categoryId, categoryRequest);
  }

  updateParameter(parameterRequest: any, parameterId: number) {
    return this.http.put(environment.BaseURI + environment.SAVE_PARAMETER_URI + "/" + parameterId, parameterRequest)
  }

  updateModule(moduleRequest: any) {
    return this.http.put(environment.BaseURI + environment.SAVE_MODULE_URI + "/" + moduleRequest.moduleId, moduleRequest);
  }

  generateAdminReport(adminAssessmentRequest: AdminAssessmentRequest) {
    return this.http.get(environment.BaseURI + environment.ASSESSMENT_ADMIN_REPORT_URI + "/" + adminAssessmentRequest.assessmentId + "/" + adminAssessmentRequest.startDate + "/" + adminAssessmentRequest.endDate, {responseType: 'blob'})
  }

  getTemplate() {
    return this.http.get(environment.BaseURI + environment.REPORT_TEMPLATE_URI, {responseType: 'blob'})
  }

  saveUserModules(moduleRequest: UserAssessmentModuleRequest[], assessmentId: number) {
    return this.http.post(environment.BaseURI + environment.ASSESSMENT_URI + "/" + assessmentId + environment.USER_ASSESSMENT_MODULE_URI, moduleRequest)
  }

  updateUserModules(moduleRequest: UserAssessmentModuleRequest[], assessmentId: number) {
    return this.http.put(environment.BaseURI + environment.ASSESSMENT_URI + "/" + assessmentId + environment.USER_ASSESSMENT_MODULE_URI, moduleRequest)
  }

  getOrganizationName(name: string): Observable<OrganisationResponse[]> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("name", name);
    return this.http.get<OrganisationResponse[]>(environment.BaseURI + environment.ACCOUNT_URI, {params: queryParams})
  }

  saveUserQuestion(userQuestionRequest: UserQuestionRequest, assessmentId: number, parameterId: number): Observable<any> {
    const headers = {'content-type': 'application/json'}
    return this.http.post(environment.BaseURI + environment.CREATE_UPDATE_DELETE_USER_QUESTION_URI + "/" + assessmentId + "/" + parameterId + "/" + "questions", userQuestionRequest.question, {'headers': headers})
  }

  updateUserQuestion(userQuestion: UserQuestion, assessmentId: number): Observable<any> {
    const headers = {'content-type': 'application/json'}
    return this.http.patch(environment.BaseURI + environment.CREATE_UPDATE_DELETE_USER_QUESTION_URI + "/" + assessmentId + "/" + "questions" + "/" + userQuestion.questionId, userQuestion.question, {'headers': headers})
  }

  deleteUserQuestion(assessmentId: number, questionId: number): Observable<any> {
    return this.http.delete(environment.BaseURI + environment.CREATE_UPDATE_DELETE_USER_QUESTION_URI + "/" + assessmentId + "/" + "questions" + "/" + questionId)
  }

  deleteAssessment(assessmentId: number): Observable<any> {
    return this.http.delete(environment.BaseURI + environment.ASSESSMENT_URI + "/" + assessmentId);
  }

  saveTopic(topicRequest: any): any {
    return this.http.post<any>(environment.BaseURI + environment.SAVE_TOPIC_URI, topicRequest)
  }

  updateTopic(topicRequest: any, topicId: number) {
    return this.http.put<any>(environment.BaseURI + environment.UPDATE_TOPIC_URI + "/" + topicId, topicRequest)
  }

  saveTopicReference(topicReferenceRequest: any) {
    return this.http.post<TopicReference>(environment.BaseURI + environment.SAVE_TOPIC_REFERENCE_URI, topicReferenceRequest)
  }

  deleteTopicReference(referenceId: number) {
    return this.http.delete(environment.BaseURI + environment.DELETE_TOPIC_REFERENCE_URI + "/" + referenceId)
  }

  updateTopicReference(referenceId: number, topicReferenceRequest: TopicReference) {
    return this.http.put<TopicReference>(environment.BaseURI + environment.UPDATE_TOPIC_REFERENCE_URI + "/" + referenceId, topicReferenceRequest)
  }

  saveParameterReference(parameterReferenceRequest: any) {
    return this.http.post<ParameterReference>(environment.BaseURI + environment.SAVE_PARAMETER_REFERENCE_URI, parameterReferenceRequest)
  }

  deleteParameterReference(referenceId: any) {
    return this.http.delete<ParameterReference>(environment.BaseURI + environment.DELETE_PARAMETER_REFERENCE_URI + "/" + referenceId)
  }

  updateParameterReference(referenceId: number, parameterReferenceRequest: ParameterReference) {
    return this.http.put<ParameterReference>(environment.BaseURI + environment.UPDATE_PARAMETER_REFERENCE_URI + "/" + referenceId, parameterReferenceRequest)
  }

  updateMasterQuestion(questionId: number, questionRequest: QuestionStructure) {
    return this.http.put<QuestionStructure>(environment.BaseURI + environment.UPDATE_QUESTION + "/" + questionId, questionRequest)

  }

  saveMasterQuestion(questionRequest: any) {
    return this.http.post<QuestionStructure>(environment.BaseURI + environment.SAVE_QUESTION, questionRequest)
  }

  formatURI(URI: string, data: Readonly<unknown>) {
    return template(URI, data);
  }

  getSummaryData(assessmentId: number) {
    const summaryDataURI = this.formatURI(environment.SUMMARY_DATA, {
      assessmentId: assessmentId
    })
    return this.http.get<SummaryResponse>(environment.BaseURI + summaryDataURI)
  }
}


