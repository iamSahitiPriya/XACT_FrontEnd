import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  constructor(private http:HttpClient) { }

  public getBackendData():Observable<{name?:string}>{

      return this.http.get(environment.BaseURI+environment.GET_ASSESSMENT_URI);
  }
}
