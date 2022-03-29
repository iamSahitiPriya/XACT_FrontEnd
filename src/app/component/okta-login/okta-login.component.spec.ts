import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OKTA_AUTH } from '@okta/okta-angular';
import { AppServiceService } from 'src/app/app-service.service';
import { RouterTestingModule } from '@angular/router/testing';
import { OktaLoginComponent } from './okta-login.component';

describe('OktaLoginComponent', () => {
  let component: OktaLoginComponent;
  let service: AppServiceService;
  let fixture: ComponentFixture<OktaLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OktaLoginComponent ],

      imports:[ 
        HttpClientModule,
        RouterTestingModule
      ],

      providers:[
        {provide: OKTA_AUTH, useValue:OktaLoginComponent},
        AppServiceService

      ]
    })
    
    .compileComponents();
    service = TestBed.inject(AppServiceService);
  });
  

  beforeEach(() => {
    fixture = TestBed.createComponent(OktaLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
