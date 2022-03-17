import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  constructor(private http:HttpClient) { }

  public getBackendData():Observable<any>{
    const headers = new HttpHeaders({ 'Getting-response-from-server': 'About X-Act'})

      return this.http.get('http://localhost:8000/v1/assessments/open/12345',{headers});
  }
}
