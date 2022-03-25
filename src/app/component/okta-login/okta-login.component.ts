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
  resourceServerExamples: Array<ResourceServerExample>;
  userName?: string;
  error?: Error;

  constructor(@Inject(OKTA_AUTH) public oktaAuth: OktaAuth, private service:AppServiceService) {
    this.resourceServerExamples = [
      {
        label: 'Node/Express Resource Server Example',
        url: 'https://github.com/okta/samples-nodejs-express-4/tree/master/resource-server',
      },
      {
        label: 'Java/Spring MVC Resource Server Example',
        url: 'https://github.com/okta/samples-java-spring/tree/master/resource-server',
      },
      {
        label: 'ASP.NET Resource Server Example',
        url: 'https://github.com/okta/samples-aspnet/tree/master/resource-server'
      }
    ];
  }

  async login() {
    try {
      await this.oktaAuth.signInWithRedirect();
    } catch (err: any) {
      console.error(err);
      this.error = err;
    }
  }

  async ngOnInit() {
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
