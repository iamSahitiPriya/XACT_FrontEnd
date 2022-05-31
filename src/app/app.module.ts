/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

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
import {CreateAssessmentsComponent} from './components/create-assessments/create-assessments.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDialogModule} from "@angular/material/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MDBBootstrapModule} from "angular-bootstrap-md";
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {AssessmentModulesComponent} from './components/assessment-modules/assessment-modules.component';
import {MatExpansionModule} from "@angular/material/expansion";
import {MatCardModule} from "@angular/material/card";
import {HttpCacheService} from "./services/cache-service/cache.service";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {
  AssessmentModulesDetailsComponent
} from './components/assessment-modules-details/assessment-modules-details.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatTabsModule} from "@angular/material/tabs";
import {MatSelectModule} from "@angular/material/select";
import {ParameterScoreComponent} from './components/parameter-score/parameter-score.component';
import {AssessmentQuestionComponent} from './components/assessment-question/assessment-question.component';
import {TopicLevelAssessmentComponent} from './components/topic-level-assessment/topic-level-assessment.component';
import {
  AssessmentRecommendationComponent
} from './components/assessment-recommendation/assessment-recommendation.component';
import {TopicScoreComponent} from './components/topic-score/topic-score.component';
import {CommonModule} from '@angular/common';
import {PopupConfirmationComponent} from './components/popup-confirmation/popup-confirmation.component';
import {NgHttpLoaderModule} from 'ng-http-loader';
import {AssessmentMenuComponent} from './components/assessment-menu/assessment-menu.component';
import { TopicLevelRecommendationComponent } from './components/topic-level-recommendation/topic-level-recommendation.component';

const oktaAuth = new OktaAuth(oktaConfig.oidc);

export const appRoutes: Routes = [
  {
    path: 'login/callback',
    component: OktaCallbackComponent,
  },
  {
    path: '',
    component: AssessmentsComponent,
    canActivate: [OktaAuthGuard]
  },
  {
    path: 'assessmentModule',
    component: AssessmentModulesComponent,
    pathMatch: 'full',
    canActivate: [OktaAuthGuard]
  },
  {
    path: 'assessment/:assessmentId',
    component: AssessmentModulesDetailsComponent,
    pathMatch: 'full',
    canActivate: [OktaAuthGuard]
  },

];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AssessmentsComponent,
    SearchComponent,
    CreateAssessmentsComponent,
    AssessmentModulesComponent,
    AssessmentModulesDetailsComponent,
    ParameterScoreComponent,
    AssessmentQuestionComponent,
    TopicLevelAssessmentComponent,
    AssessmentRecommendationComponent,
    TopicScoreComponent,
    PopupConfirmationComponent,
    AssessmentMenuComponent,
    TopicLevelRecommendationComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    MDBBootstrapModule.forRoot(),
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    OktaAuthModule,
    MatTableModule,
    MatFormFieldModule,
    MatMenuModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatCardModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatListModule,
    MatTabsModule,
    MatSelectModule,
    NgHttpLoaderModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    MatButtonModule,
    MatTableModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    NgHttpLoaderModule,
    FormsModule
  ],
  providers: [
    AppServiceService,
    {provide: HTTP_INTERCEPTORS, useClass: Interceptors, multi: true},
    {provide: OKTA_CONFIG, useValue: {oktaAuth}},
    HttpClientTestingModule,
    HttpCacheService

  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
