import {  HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OKTA_AUTH } from '@okta/okta-angular';
import { AppServiceService } from 'src/app/app-service.service';
import { RouterTestingModule } from '@angular/router/testing';
import { OktaLoginComponent } from './okta-login.component';
import { OktaAuth } from '@okta/okta-auth-js';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import {of} from 'rxjs'
describe('OktaLoginComponent', () => {

  let component: OktaLoginComponent;
  let fixture: ComponentFixture<OktaLoginComponent>;
  let data!:string
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OktaLoginComponent ],

      imports:[ 
        HttpClientModule,
        RouterTestingModule
      ],

      providers:[
        {provide: OKTA_AUTH, useValue:OktaLoginComponent},
        AppServiceService,
        {provide: OktaAuth, useValue:23},
      ]
    })
    
    .compileComponents();
    
  });
  data = "hello"
  jest.mock('@okta/okta-auth-js')
  OktaAuth.prototype.getAccessToken = () =>{
    return data
  }
  beforeEach(() => {
    fixture = TestBed.createComponent(OktaLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
//   it('should recieve the data',async ()=>{
//     const service = TestBed.inject(OktaAuth)
//     const result = await service.getAccessToken();
//     expect(result).toBe("hello")  
// })
})
