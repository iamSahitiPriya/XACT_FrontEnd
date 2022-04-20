import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {AssessmentStructure} from "../../components/assessments/assessmentStructure";


@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  constructor(private http: HttpClient) {
  }

  public getAssessments(): Observable<AssessmentStructure[]> {

    return this.http.get<AssessmentStructure[]>(environment.BaseURI + environment.GET_ASSESSMENT_URI);
  }

  public addAssessments(assessmentData: any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body = JSON.stringify(assessmentData)
    console.log(body)
    return this.http.post(environment.BaseURI + environment.GET_ASSESSMENT_URI, body,{'headers':headers})

  }
}
