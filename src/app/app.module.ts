/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
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
import {HeaderComponent} from './components/header-component/header.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AssessmentsComponent} from './components/assessments-view-all/assessments.component';
import {MatTableModule} from '@angular/material/table'
import {MatMenuModule} from '@angular/material/menu';
import {SearchComponent} from "./components/search-component/search.component";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {CreateAssessmentsComponent} from './components/assessment-create/create-assessments.component';
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
import {AssessmentModulesDetailsComponent} from './components/assessment-modules-details/assessment-modules-details.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatTabsModule} from "@angular/material/tabs";
import {MatSelectModule} from "@angular/material/select";
import {AssessmentQuestionComponent} from './components/assessment-parameter-questions/assessment-question.component';
import {TopicLevelAssessmentComponent} from './components/assessment-rating-and-recommendation/topic-level-assessment.component';
import {CommonModule} from '@angular/common';
import {PopupConfirmationComponent} from './components/popup-confirmation/popup-confirmation.component';
import {NgHttpLoaderModule} from 'ng-http-loader';
import {AssessmentMenuComponent} from './components/assessment-menu/assessment-menu.component';
import {ParameterLevelRatingAndRecommendationComponent} from './components/parameter-level-rating-and-recommendation/parameter-level-rating-and-recommendation.component';
import {MatRippleModule} from "@angular/material/core";
import {TopicLevelRatingAndRecommendationComponent} from './components/topic-level-rating-and-recommendation/topic-level-rating-and-recommendation.component';
import {AssessmentDataEffects} from "./effects/assessment-data.effects";
import {reducers} from "./reducers/reducers";
import {ErrorComponentComponent} from './components/error-component/error-component.component';
import { ProgressComponentComponent } from './components/progress-component/progress-component.component';
import {MatTooltipModule} from "@angular/material/tooltip";

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
    AssessmentQuestionComponent,
    TopicLevelAssessmentComponent,
    PopupConfirmationComponent,
    AssessmentMenuComponent,
    ParameterLevelRatingAndRecommendationComponent,
    TopicLevelRatingAndRecommendationComponent,
    ErrorComponentComponent,
    ProgressComponentComponent
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
    MatToolbarModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatCardModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatListModule,
    MatTabsModule,
    MatTooltipModule,
    MatSelectModule,
    NgHttpLoaderModule.forRoot(),
    StoreModule.forRoot(reducers,{runtimeChecks:{
        strictStateSerializability: true,
        strictActionSerializability: true,
        strictActionWithinNgZone: true,
        strictStateImmutability: false,
        strictActionImmutability:false
      }}),
    EffectsModule.forRoot([AssessmentDataEffects]),
  ],
  exports: [
    MatButtonModule,
    MatTableModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    NgHttpLoaderModule,
    MatFormFieldModule,
    MatRippleModule,
    FormsModule,
    RouterModule
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
