
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { access } from 'fs';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';
import { OktaLoginComponent } from './component/okta-login/okta-login.component';


@Injectable()
export class AppServiceService {

  constructor(private http:HttpClient) { }
  
  public getBackendData():Observable<any>{

      return this.http.get(environment.URL+'/v1/assessments/12345');
  }
}
