import {HttpClientModule} from '@angular/common/http';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {OKTA_AUTH, OKTA_CONFIG, OktaAuthStateService} from '@okta/okta-angular';
import {RouterTestingModule} from '@angular/router/testing';
import {AppServiceService} from '../../services/app-service/app-service.service';
import {AppComponent} from './app.component';

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
