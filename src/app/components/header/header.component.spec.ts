import {ComponentFixture, TestBed} from '@angular/core/testing';
import {OKTA_AUTH} from '@okta/okta-angular';
import {HeaderComponent} from './header.component';
import {MatMenuModule} from '@angular/material/menu';


describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  const oktaAuth = require('@okta/okta-auth-js');

  beforeEach(async () => {
    jest.mock('@okta/okta-auth-js');
    oktaAuth.getUser = jest.fn(() => Promise.resolve({name: 'Sam'}));
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [MatMenuModule],
      providers: [
        {provide: OKTA_AUTH, useValue: oktaAuth},

      ]
    })
      .compileComponents();
  });


  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have logo in header', () => {
    expect(fixture.nativeElement.querySelector('#logo').getAttribute("src")).toBe("../../assets/logo.png");
  });

  it('should pass user name to html', () => {
    expect(component.username).toBe('Sam');
    expect(fixture.nativeElement.querySelector('#username')).toBeTruthy();
  });

});


