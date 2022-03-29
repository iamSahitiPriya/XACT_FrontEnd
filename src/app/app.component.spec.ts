import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { OktaAuthStateService, OKTA_AUTH, OKTA_CONFIG } from '@okta/okta-angular';
import { RouterTestingModule } from '@angular/router/testing';
import { AppServiceService } from './app-service.service';
import { AppComponent } from './app.component';
import { OktaLoginComponent } from './component/okta-login/okta-login.component';

describe('AppComponent', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports:[
        HttpClientModule,
        RouterTestingModule
      ],
      providers:[
        AppServiceService,
        OktaLoginComponent,
        {provide: OKTA_CONFIG, useValue:23},
        {provide: OKTA_AUTH, useValue:23},
        {provide: OktaAuthStateService, useValue:23}

      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'XAct_Frontend_App'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('XAct_Frontend_App');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('XAct_Frontend_App app is running!');
  });

})
