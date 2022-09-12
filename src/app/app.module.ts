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
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {
  AssessmentModulesDetailsComponent
} from './components/assessment-modules-details/assessment-modules-details.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatTabsModule} from "@angular/material/tabs";
import {MatSelectModule} from "@angular/material/select";
import {AssessmentQuestionComponent} from './components/assessment-parameter-questions/assessment-question.component';
import {
  TopicLevelAssessmentComponent
} from './components/assessment-rating-and-recommendation/topic-level-assessment.component';
import {CommonModule} from '@angular/common';
import {PopupConfirmationComponent} from './components/popup-confirmation/popup-confirmation.component';
import {NgHttpLoaderModule} from 'ng-http-loader';
import {AssessmentMenuComponent} from './components/assessment-menu/assessment-menu.component';
import {ParameterLevelRatingComponent} from './components/parameter-level-rating/parameter-level-rating.component';
import {MatNativeDateModule, MatRippleModule} from "@angular/material/core";
import {TopicLevelRatingComponent} from './components/topic-level-rating/topic-level-rating.component';
import {AssessmentDataEffects} from "./effects/assessment-data.effects";
import {reducers} from "./reducers/reducers";
import {ErrorComponentComponent} from './components/error-component/error-component.component';
import {ProgressComponentComponent} from './components/progress-component/progress-component.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import {
  AssessmentAverageRatingComponent
} from './components/assessment-average-rating/assessment-average-rating.component';
import {MatChipsModule} from "@angular/material/chips";
import {MatSortModule} from "@angular/material/sort";
import {MatRadioModule} from "@angular/material/radio";
import {
  TopicLevelRecommendationComponent
} from './components/topic-level-recommendation/topic-level-recommendation.component';
import {
  ParameterLevelRecommendationComponent
} from './components/parameter-level-recommendation/parameter-level-recommendation.component';
import {AdminConsoleComponent} from './components/admin/admin-console/admin-console.component';
import {AdminCategoryComponent} from './components/admin/admin-category/admin-category.component';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";

import {AdminDashboardComponent} from "./components/admin/admin-dashboard/admin-dashboard.component";
import {MatDatepickerModule} from '@angular/material/datepicker';


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
  {
    path:'admin',
    component:AdminConsoleComponent,
    children:[{
      path:"category",
      component:AdminCategoryComponent,
      pathMatch:'full',
      canActivate:[OktaAuthGuard]
    },{
      path:"dashboard",
      component:AdminDashboardComponent,
      pathMatch:'full',
      canActivate:[OktaAuthGuard]
    }],
    canActivate:[OktaAuthGuard]
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
    ParameterLevelRatingComponent,
    TopicLevelRatingComponent,
    ErrorComponentComponent,
    ProgressComponentComponent,
    AssessmentAverageRatingComponent,
    AdminConsoleComponent,
    AdminDashboardComponent,
    TopicLevelRecommendationComponent,
    ParameterLevelRecommendationComponent,
    AdminCategoryComponent,
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
    MatSortModule,
    NgHttpLoaderModule.forRoot(),
    StoreModule.forRoot(reducers, {
      runtimeChecks: {
        strictStateSerializability: true,
        strictActionSerializability: true,
        strictActionWithinNgZone: true,
        strictStateImmutability: false,
        strictActionImmutability: false
      }
    }),
    EffectsModule.forRoot([AssessmentDataEffects]),
    MatChipsModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatDatepickerModule,
    MatChipsModule,
    MatRadioModule,
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
    MatSortModule,
    NgHttpLoaderModule.forRoot(),
    StoreModule.forRoot(reducers, {
      runtimeChecks: {
        strictStateSerializability: true,
        strictActionSerializability: true,
        strictActionWithinNgZone: true,
        strictStateImmutability: false,
        strictActionImmutability: false
      }
    }),
    EffectsModule.forRoot([AssessmentDataEffects]),
    MatChipsModule,
    MatSlideToggleModule,
    MatSlideToggleModule,
    MatNativeDateModule
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
    RouterModule,
  ],
  providers: [
    AppServiceService,
    {provide: HTTP_INTERCEPTORS, useClass: Interceptors, multi: true},
    {provide: OKTA_CONFIG, useValue: {oktaAuth}},
    HttpClientTestingModule,

  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
