import { Component, Inject } from '@angular/core';
import { AppServiceService } from './app-service.service';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent{

  title = 'XAct_Frontend_App';  
  heading1 = "Hello world"

  getData:any;
  constructor(private service:AppServiceService,@Inject(OKTA_AUTH) private oktaAuth: OktaAuth, public authService: OktaAuthStateService){}

  async login() {
    await this.oktaAuth.signInWithRedirect();
  }

  async logout() {
    await this.oktaAuth.signOut();
   
  }
  ngOnInit(){
    this.service.getBackendData().subscribe({
        next: (Response)=>{
        this.getData = Response;
        console.log(this.getData)
        },
        error: error =>{
          this.getData = "There is an error. Check console."
        }
    })
  }
  changeContent(){
    this.heading1 = this.getData.name;
  }

}

