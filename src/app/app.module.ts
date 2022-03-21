import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Interceptors } from './interceptor-service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    HttpClientModule

  ],
  exports:[
    MatButtonModule,
  ],
  providers: [ 
    {provide:HTTP_INTERCEPTORS, useClass:Interceptors, multi:true}
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }
