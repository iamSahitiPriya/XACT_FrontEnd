import { Component, NgModule } from '@angular/core';
import { AppServiceService } from './app-service.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent{

  title = 'XAct_Frontend_App';
  heading1 = "Hello world"

  getData:any;
  constructor(private service:AppServiceService){}
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

