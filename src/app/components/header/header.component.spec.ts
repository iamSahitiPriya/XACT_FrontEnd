import {ComponentFixture, TestBed} from '@angular/core/testing';
import {OKTA_AUTH} from '@okta/okta-angular';
import {OktaAuth} from '@okta/okta-auth-js';
import {HeaderComponent} from './header.component';
import {MatMenuModule} from '@angular/material/menu';


describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  const data = "{email:sample_email}"

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      imports:[ MatMenuModule],
      providers:[
        {provide: OKTA_AUTH, useValue:23},

      ]
    })
    .compileComponents();
  });
  jest.mock('@okta/okta-auth-js');
  async function getName(){
  (await OktaAuth.prototype.getUser()).name = data
  }
  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


