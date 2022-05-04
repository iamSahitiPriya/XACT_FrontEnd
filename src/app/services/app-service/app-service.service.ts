import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {AssessmentStructure} from "../../types/assessmentStructure";
import {User} from "../../types/user";
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

  public getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(environment.BaseURI + environment.USER_URI + "/" + email);
  }

  public getCategories(): Observable<CategoryStructure[]> {
    return this.http.get<CategoryStructure[]>(environment.BaseURI + environment.CATEGORY_URI)
  }

}
