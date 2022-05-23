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

}
