import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Interceptors } from './interceptor-service';
import { Routes, RouterModule } from '@angular/router';

import { OktaLoginComponent } from './component/okta-login/okta-login.component';
import {
  OKTA_CONFIG,
  OktaAuthModule,
  OktaCallbackComponent,
} from '@okta/okta-angular';
import oktaConfig from './app.config';

import { OktaAuth } from '@okta/okta-auth-js';
import { AppServiceService } from './app-service.service';
const oktaAuth = new OktaAuth(oktaConfig.oidc);

const appRoutes: Routes = [
  {
    path: 'login/callback',
    component: OktaCallbackComponent,
  },
  {
    path:'',
    component:OktaLoginComponent,
  },
  {
    path:'test',
    component:AppComponent,
  }

];
@NgModule({
  declarations:[
    AppComponent,
    OktaLoginComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    OktaAuthModule,

  ],
  exports:[
    MatButtonModule,
  ],
  providers: [
    OktaLoginComponent,
    AppServiceService,
    {provide:HTTP_INTERCEPTORS, useClass:Interceptors, multi:true},
    {provide: OKTA_CONFIG, useValue: { oktaAuth }}
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }
