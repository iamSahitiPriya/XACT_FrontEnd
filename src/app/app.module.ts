import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './components/app-component/app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {Interceptors} from './interceptor-service';
import {RouterModule, Routes} from '@angular/router';

import {OKTA_CONFIG, OktaAuthGuard, OktaAuthModule, OktaCallbackComponent,} from '@okta/okta-angular';
import oktaConfig from './app.config';

import {OktaAuth} from '@okta/okta-auth-js';
import {AppServiceService} from './services/app-service/app-service.service';
import {HeaderComponent} from './components/header/header.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AssessmentsComponent} from './components/assessments/assessments.component';
import {MatTableModule} from '@angular/material/table'
import {MatMenuModule} from '@angular/material/menu';
import {SearchComponent} from "./components/search/search.component";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import { CreateAssessmentsComponent } from './components/create-assessments/create-assessments.component';
import {MatFormFieldModule, MatLabel} from "@angular/material/form-field";


const oktaAuth = new OktaAuth(oktaConfig.oidc);

const appRoutes: Routes = [
  {
    path: 'login/callback',
    component: OktaCallbackComponent,
  },
  {
    path:'',
    component:AssessmentsComponent,
    canActivate:[OktaAuthGuard]
  }
];
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AssessmentsComponent,
    SearchComponent,
    CreateAssessmentsComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    OktaAuthModule,
    MatTableModule,
    MatFormFieldModule,
    MatMenuModule,
    MatInputModule,
    MatIconModule,
  ],
  exports:[
    MatButtonModule,
    MatTableModule,
    MatMenuModule,
    MatIconModule,

  ],
  providers: [
    AppServiceService,
    {provide:HTTP_INTERCEPTORS, useClass:Interceptors, multi:true},
    {provide: OKTA_CONFIG, useValue: { oktaAuth }},
    HttpClientTestingModule
   ],
  bootstrap: [AppComponent]
})
export class AppModule {

 }
