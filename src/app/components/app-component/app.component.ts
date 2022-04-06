import {Component, Inject} from '@angular/core';
import {OKTA_AUTH, OktaAuthStateService} from '@okta/okta-angular';
import {OktaAuth} from '@okta/okta-auth-js';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent{

  title = 'XACT | Welcome to client maturity assessment ';
  constructor( @Inject(OKTA_AUTH) private oktaAuth: OktaAuth, public authService: OktaAuthStateService){
    console.log(oktaAuth.getAccessToken());
  }
}

