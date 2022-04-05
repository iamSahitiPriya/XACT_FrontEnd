import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OktaAuthStateService, OKTA_AUTH, OKTA_CONFIG } from '@okta/okta-angular';
import { RouterTestingModule } from '@angular/router/testing';
import { AppServiceService } from './app-service.service';
import { AppComponent } from './app.component';
import { OktaLoginComponent } from './component/okta-login/okta-login.component';
import { Observable, of } from 'rxjs';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

describe('AppComponent', () => {
  let component:AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let service:AppServiceService;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports:[
        HttpClientModule,
        RouterTestingModule,

      ],
      providers:[
        AppServiceService,
        OktaLoginComponent,
        RouterTestingModule,
        {provide: OKTA_CONFIG, useValue:23},
        {provide: OKTA_AUTH, useValue:23},
        {provide: OktaAuthStateService, useValue:23},

      ]
    }).compileComponents();
  });

 
  beforeEach(() => {
    service = TestBed.inject(AppServiceService);
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should change content',() =>{
    component.getData = {name:"Hello"}
    expect(component.changeContent()).toContain("Hello")
  })
  
  it('should get data',()=>{
    expect(service).toBeTruthy();

    const data = [{
      name:"Created Successfully"
    }]
    service.getBackendData().subscribe((result)=>{
      console.log(result)
      expect(result.name).toBe("Created Successfully")
    })
  })
});

