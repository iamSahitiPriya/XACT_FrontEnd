/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {AssessmentStructure} from "../../types/assessmentStructure";
import {AssessmentRequest} from "../../types/assessmentRequest";
import {CategoryStructure} from "../../types/categoryStructure";
import {SaveRequest} from "../../types/saveRequest";
import {AssessmentNotes} from "../../types/assessmentNotes";
import {TopicRating} from "../../types/topicRating";
import {ParameterRating} from "../../types/parameterRating";
import {TopicLevelRecommendationTextRequest} from "../../types/topicLevelRecommendationTextRequest";
import {ParameterLevelRecommendationTextRequest} from "../../types/parameterLevelRecommendationTextRequest";


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

  public getCategories(): Observable<CategoryStructure[]> {
    return this.http.get<CategoryStructure[]>(environment.BaseURI + environment.CATEGORY_URI)
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

}


