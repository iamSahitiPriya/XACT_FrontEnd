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


  public saveAssessment(assessmentAnswer: SaveRequest): Observable<any> {
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
}
