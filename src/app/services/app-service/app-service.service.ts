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
import {SseClient} from "ngx-sse-client";
import {CategoryRequest} from "../../types/Admin/categoryRequest";
import {ModuleRequest} from "../../types/Admin/moduleRequest";
import {ModuleResponse} from "../../types/Admin/moduleResponse";
import {TopicRequest} from "../../types/Admin/topicRequest";
import {TopicResponse} from "../../types/Admin/topicResponse";
import {ParameterRequest} from "../../types/Admin/parameterRequest";
import {ParameterResponse} from "../../types/Admin/parameterResponse";
import {QuestionRequest} from "../../types/Admin/questionRequest";
import {TopicLevelRecommendation} from "../../types/topicLevelRecommendation";
import {ParameterLevelRecommendation} from "../../types/parameterLevelRecommendation";
import {UserQuestionResponse} from "../../types/userQuestionResponse";
import {Recommendation} from "../../types/recommendation";
import {ContributorResponse} from "../../types/Contributor/ContributorResponse";
import {ContributorQuestionRequest} from "../../types/Contributor/ContributorQuestionRequest";
import {ContributorQuestionResponse} from "../../types/Contributor/ContributorQuestionResponse";
import {ManageContributorRequest} from "../../types/Contributor/ManageContributorRequest";
import {UserInfo} from "../../types/UserInfo";
import {AccessControlRole} from "../../types/AccessControlRole";
import {AccessControlRoleRequest} from "../../types/AccessControlRoleRequest";


@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  constructor(private http: HttpClient, private sseClient: SseClient) {
  }

  public getAssessments(): Observable<AssessmentStructure[]> {
    return this.http.get<AssessmentStructure[]>(environment.BaseURI + environment.ASSESSMENT_URI);
  }

  public addAssessments(assessmentData: AssessmentRequest) {
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


  saveTopicRecommendation(assessmentId: number, topicId: number, topicLevelRecommendation: TopicLevelRecommendation): Observable<TopicLevelRecommendation> {
    const topicRecommendationURI = this.formatURI(environment.SAVE_TOPIC_RECOMMENDATION_URI, {
      assessmentId: assessmentId,
      topicId: topicId
    })
    return this.http.patch(environment.BaseURI + topicRecommendationURI, topicLevelRecommendation)
  }

  deleteTopicRecommendation(assessmentId: number, topicId: number, recommendationId: number): Observable<TopicLevelRecommendation> {
    const topicRecommendationURI = this.formatURI(environment.DELETE_TOPIC_RECOMMENDATION_URI, {
      assessmentId: assessmentId,
      topicId: topicId,
      recommendationId: recommendationId
    })
    return this.http.delete(environment.BaseURI + topicRecommendationURI);
  }

  saveParameterRecommendation(assessmentId: number, parameterId: number, recommendation: ParameterLevelRecommendation): Observable<ParameterLevelRecommendation> {
    const paramRecommendationURI = this.formatURI(environment.SAVE_PARAMETER_RECOMMENDATION_URI, {
      assessmentId: assessmentId,
      parameterId: parameterId
    });
    return this.http.patch(environment.BaseURI + paramRecommendationURI, recommendation)
  }

  deleteParameterRecommendation(assessmentId: number, parameterId: number, recommendationId: number): Observable<ParameterLevelRecommendation> {
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
    return this.http.get<string []>(environment.BaseURI + environment.ROLE_URI);
  }

  login() {
    this.http.get(environment.BaseURI + environment.LOGIN_URI).subscribe();
  }

  getReportData(assessmentId: number): Observable<ReportDataStructure> {
    return this.http.get<ReportDataStructure>(environment.BaseURI + environment.ASSESSMENT_REPORT_URI + assessmentId + environment.REPORT_DATA_URI);
  }


  getAdminAssessment(adminAssessmentRequest: AdminAssessmentRequest): Observable<AdminAssessmentResponse> {
    return this.http.get<AdminAssessmentResponse>(environment.BaseURI + environment.GET_ADMIN_ASSESSMENTS + "/" + adminAssessmentRequest.startDate + "/" + adminAssessmentRequest.endDate);
  }

  getAllCategories(role: string): Observable<CategoryResponse[]> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("role", role);
    return this.http.get<CategoryResponse[]>(environment.BaseURI + environment.ALL_CATEGORY_URI, {params: queryParams});
  }


  saveCategory(categoryRequest: CategoryRequest): Observable<CategoryResponse> {
    return this.http.post<CategoryResponse>(environment.BaseURI + environment.SAVE_CATEGORY_URI, categoryRequest)
  }

  saveParameter(parameterRequest: ParameterRequest): Observable<ParameterResponse> {
    return this.http.post<ParameterResponse>(environment.BaseURI + environment.SAVE_PARAMETER_URI, parameterRequest)
  }

  saveModule(moduleRequest: ModuleRequest): Observable<ModuleResponse> {
    return this.http.post<ModuleResponse>(environment.BaseURI + environment.SAVE_MODULE_URI, moduleRequest)
  }

  updateCategory(categoryRequest: CategoryRequest): Observable<CategoryResponse> {
    return this.http.put<CategoryResponse>(environment.BaseURI + environment.UPDATE_CATEGORY_URI + "/" + categoryRequest.categoryId, categoryRequest);
  }

  updateParameter(parameterRequest: ParameterRequest, parameterId: number): Observable<ParameterResponse> {
    return this.http.put<ParameterResponse>(environment.BaseURI + environment.SAVE_PARAMETER_URI + "/" + parameterId, parameterRequest)
  }

  updateModule(moduleRequest: ModuleRequest): Observable<ModuleResponse> {
    return this.http.put<ModuleResponse>(environment.BaseURI + environment.SAVE_MODULE_URI + "/" + moduleRequest.moduleId, moduleRequest);
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

  saveUserQuestion(userQuestionRequest: UserQuestionRequest, assessmentId: number, parameterId: number): Observable<UserQuestionResponse> {
    const headers = {'content-type': 'application/json'}
    return this.http.post<UserQuestionResponse>(environment.BaseURI + environment.CREATE_UPDATE_DELETE_USER_QUESTION_URI + "/" + assessmentId + "/" + parameterId + "/" + "questions", userQuestionRequest.question, {'headers': headers})
  }

  updateUserQuestion(userQuestion: UserQuestion, assessmentId: number): Observable<UserQuestionResponse> {
    const headers = {'content-type': 'application/json'}
    return this.http.patch<UserQuestionResponse>(environment.BaseURI + environment.CREATE_UPDATE_DELETE_USER_QUESTION_URI + "/" + assessmentId + "/" + "questions" + "/" + userQuestion.questionId, userQuestion.question, {'headers': headers})
  }

  deleteUserQuestion(assessmentId: number, questionId: number): Observable<UserQuestionResponse> {
    return this.http.delete<UserQuestionResponse>(environment.BaseURI + environment.CREATE_UPDATE_DELETE_USER_QUESTION_URI + "/" + assessmentId + "/" + "questions" + "/" + questionId)
  }

  deleteAssessment(assessmentId: number) {
    return this.http.delete(environment.BaseURI + environment.ASSESSMENT_URI + "/" + assessmentId);
  }

  saveTopic(topicRequest: TopicRequest): Observable<TopicResponse> {
    return this.http.post<TopicResponse>(environment.BaseURI + environment.SAVE_TOPIC_URI, topicRequest)
  }

  updateTopic(topicRequest: TopicRequest, topicId: number): Observable<TopicResponse> {
    return this.http.put<TopicResponse>(environment.BaseURI + environment.UPDATE_TOPIC_URI + "/" + topicId, topicRequest)
  }

  saveTopicReference(topicReferenceRequest: TopicReference): Observable<TopicReference> {
    return this.http.post<TopicReference>(environment.BaseURI + environment.SAVE_TOPIC_REFERENCE_URI, topicReferenceRequest)
  }

  deleteTopicReference(referenceId: number) {
    return this.http.delete(environment.BaseURI + environment.DELETE_TOPIC_REFERENCE_URI + "/" + referenceId)
  }

  updateTopicReference(referenceId: number, topicReferenceRequest: TopicReference): Observable<TopicReference> {
    return this.http.put<TopicReference>(environment.BaseURI + environment.UPDATE_TOPIC_REFERENCE_URI + "/" + referenceId, topicReferenceRequest)
  }

  saveParameterReference(parameterReferenceRequest: ParameterReference): Observable<ParameterReference> {
    return this.http.post<ParameterReference>(environment.BaseURI + environment.SAVE_PARAMETER_REFERENCE_URI, parameterReferenceRequest)
  }

  deleteParameterReference(referenceId: number) {
    return this.http.delete(environment.BaseURI + environment.DELETE_PARAMETER_REFERENCE_URI + "/" + referenceId)
  }

  updateParameterReference(referenceId: number, parameterReferenceRequest: ParameterReference): Observable<ParameterReference> {
    return this.http.put<ParameterReference>(environment.BaseURI + environment.UPDATE_PARAMETER_REFERENCE_URI + "/" + referenceId, parameterReferenceRequest)
  }

  saveMasterQuestion(questionRequest: QuestionRequest): Observable<QuestionStructure> {
    return this.http.post<QuestionStructure>(environment.BaseURI + environment.SAVE_QUESTION, questionRequest)
  }

  saveContributors(contributorRequest: ManageContributorRequest, moduleId: number) {
    const saveContributorURI = this.formatURI(environment.SAVE_CONTRIBUTOR_URI, {
      moduleId: moduleId
    })
    return this.http.post(environment.BaseURI + saveContributorURI, contributorRequest)
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

  getAllRecommendations(assessmentId: number) {
    const recommendationsURI = this.formatURI(environment.RECOMMENDATIONS_URI, {
      assessmentId: assessmentId
    })
    return this.http.get<Recommendation []>(environment.BaseURI + recommendationsURI)
  }

  getContributorQuestions(role: string) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("role", role);
    return this.http.get<ContributorResponse>(environment.BaseURI + environment.CONTRIBUTOR_QUESTIONS_URI, {params: queryParams})
  }

  updateQuestion(questionId: number, question: string) {
    const headers = {'content-type': 'application/json'}
    const updateQuestionURI = this.formatURI(environment.UPDATE_CONTRIBUTOR_QUESTION, {
      questionId: questionId
    });
    return this.http.patch<QuestionStructure>(environment.BaseURI + updateQuestionURI, question, {'headers': headers})
  }

  updateQuestionStatus(moduleId: number, status: string, questionRequest: ContributorQuestionRequest) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("status", status);
    const headers = {'content-type': 'application/json'}
    const sendForReviewURI = this.formatURI(environment.UPDATE_CONTRIBUTOR_STATUS_URI, {
      moduleId: moduleId,
    })
    return this.http.patch<ContributorQuestionResponse>(environment.BaseURI + sendForReviewURI, questionRequest, {
      'headers': headers,
      params: queryParams
    })

  }

  getActivity(topicId: number, assessmentId: number) {
    const activityDataURI = this.formatURI(environment.ACTIVITY_LOGS_URI, {
      assessmentId: assessmentId,
      topicId: topicId
    })
    return this.sseClient.stream(environment.BaseURI + activityDataURI, {
      keepAlive: true,
      reconnectionDelay: 30_000,
      responseType: 'text'
    })

  }

  deleteQuestion(questionId: number) {
    const headers = {'content-type': 'application/json'}
    const deleteQuestionURI = this.formatURI(environment.DELETE_CONTRIBUTOR_QUESTION, {
      questionId: questionId
    });
    return this.http.delete(environment.BaseURI + deleteQuestionURI, {'headers': headers})

  }

  getLoggedInUserInfo() {
    const headers = {'content-type': 'application/json'}
    return this.http.get<UserInfo[]>(environment.BaseURI + environment.GET_ALL_USER_INFO_URI, {'headers': headers})
  }

  getAccessControlRoles() {
    const headers = {'content-type': 'application/json'}
    return this.http.get<AccessControlRole[]>(environment.BaseURI + environment.GET_ACCESS_CONTROL_URI, {'headers': headers})

  }

  saveRole(userRequest: AccessControlRoleRequest) {
    const headers = {'content-type': 'application/json'}
    return this.http.post(environment.BaseURI + environment.ADD_USER_URI, userRequest, {'headers': headers})
  }

  deleteRole(request: AccessControlRoleRequest) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("email", request.email);
    const headers = {'content-type': 'application/json'}
    return this.http.delete(environment.BaseURI + environment.ADD_USER_URI, {headers: headers, params: queryParams})
  }
}


