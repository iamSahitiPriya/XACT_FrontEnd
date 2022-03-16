import { Component, NgModule } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  title = 'XAct_Frontend_App';  
  heading1 = "Hello world"

  changeContent(){
    this.heading1 = "Welcome"
  }

}

