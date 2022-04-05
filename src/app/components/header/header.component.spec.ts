import {ComponentFixture, TestBed} from '@angular/core/testing';
import {OKTA_AUTH} from '@okta/okta-angular';
import {OktaAuth} from '@okta/okta-auth-js';
import {HeaderComponent} from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let service:OktaAuth

  const data = "hello"

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
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
  // it('should return username',async ()=>{
  //   const result = await getName();
  //   expect(result).toBe("hello")
  // })
});


