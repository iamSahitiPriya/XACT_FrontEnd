import { Component, OnInit, Inject } from '@angular/core';
import { OktaAuth } from '@okta/okta-auth-js';
import { OKTA_AUTH } from '@okta/okta-angular';
import { AppServiceService } from 'src/app/app-service.service';
interface ResourceServerExample {
  label: string;
  url: string;
}
@Component({
  selector: 'app-okta-login',
  templateUrl: './okta-login.component.html',
  styleUrls: ['./okta-login.component.css']
})
export class OktaLoginComponent implements OnInit {
  isAuthenticated!: boolean;
  accessToken?:string;
  userName?: string;
  error?: Error;

  constructor(@Inject(OKTA_AUTH) public oktaAuth: OktaAuth, private service:AppServiceService) {}

  async ngOnInit() {
    this.oktaAuth.signIn;
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();
    this.accessToken = await this.oktaAuth.getAccessToken();
    console.log(this.oktaAuth.getAccessToken())
    console.log(this.isAuthenticated)

    if (this.isAuthenticated) {
      const userClaims = await this.oktaAuth.getUser();
      this.userName = userClaims.name;
    }
    
  }  

}
