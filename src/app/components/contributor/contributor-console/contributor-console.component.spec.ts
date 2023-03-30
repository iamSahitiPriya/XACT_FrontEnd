import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ContributorConsoleComponent} from './contributor-console.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {StoreModule} from "@ngrx/store";
import {reducers} from "../../../reducers/reducers";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {RouterTestingModule} from "@angular/router/testing";
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {of, Subject} from "rxjs";
import {MatIconModule} from "@angular/material/icon";
import {RouterEvent} from "@angular/router";

class  MockAppService {
  public getUserRole() {
    return of(["Author", "Reviewer"]);
  }
}

const routerEventsSubject = new Subject<RouterEvent>();

const routerStub = {
  events: routerEventsSubject.asObservable()
};
describe('ContributorConsoleComponent', () => {
  let component: ContributorConsoleComponent;
  let fixture: ComponentFixture<ContributorConsoleComponent>;
  let mockAppService : MockAppService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContributorConsoleComponent ],
      imports:[HttpClientTestingModule,StoreModule.forRoot(reducers), MatCardModule, MatFormFieldModule, MatInputModule, RouterTestingModule.withRoutes([]), MatIconModule],
      providers: [{provide : AppServiceService, useClass: MockAppService}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContributorConsoleComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
    mockAppService = new MockAppService();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('it should set type as author when the author button is clicked', () => {
    component.ngOnInit()

    component.setEvent("author")

    expect(component.isAuthor).toBeTruthy()
    expect(component.isContributor).toBeTruthy()
    expect(component.type).toBe("author")
  });
});
