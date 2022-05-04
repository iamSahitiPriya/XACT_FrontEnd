import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AssessmentsComponent} from './assessments.component';
import {HttpClient, HttpHandler} from "@angular/common/http";
import {SearchComponent} from "../search/search.component";
import {CreateAssessmentsComponent} from "../create-assessments/create-assessments.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatTableModule} from "@angular/material/table";
import {AssessmentStructure} from "../../types/assessmentStructure";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {Observable, of} from "rxjs";
import {MatDialogModule} from "@angular/material/dialog";
import {OKTA_AUTH} from "@okta/okta-angular";
import oktaAuth from "@okta/okta-auth-js";
import {RouterTestingModule} from "@angular/router/testing";
import {FormBuilder} from "@angular/forms";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {AssessmentModulesComponent} from "../assessment-modules/assessment-modules.component";

class MockAppService{
  ASSESSMENT_DATA:AssessmentStructure [] = [
    {
      "assessmentId": 1,
      "assessmentName": "xact",
      "organisationName": "abc",
      "assessmentStatus": "ACTIVE",
      "updatedAt": 1649836702001
    },
    {
      "assessmentId": 1,
      "assessmentName": "xact",
      "organisationName": "abc",
      "assessmentStatus": "ACTIVE",
      "updatedAt": 1649836702000
    }
  ]
  public getAssessments():Observable<AssessmentStructure[]>{
    return of(this.ASSESSMENT_DATA)
  }
}
describe('AssessmentsComponent', () => {
  let component: AssessmentsComponent;
  let mockAppService:MockAppService
  let fixture: ComponentFixture<AssessmentsComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [ AssessmentsComponent,SearchComponent,CreateAssessmentsComponent ],
      imports:[MatFormFieldModule,MatIconModule,MatInputModule, RouterTestingModule,MatPaginatorModule,
        BrowserAnimationsModule,MatTableModule, MatDialogModule,MatSnackBarModule,
      RouterTestingModule.withRoutes([{
        path:"assessmentModule",component:AssessmentModulesComponent
      }])],
      providers:[HttpClient,HttpHandler,FormBuilder,
        {provide: AppServiceService,
          useClass: MockAppService},
      {provide: OKTA_AUTH, useValue: oktaAuth},

    ]
    })
    .compileComponents();

  });

  beforeEach(() => {
    mockAppService = new MockAppService()
    fixture = TestBed.createComponent(AssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should get response', () => {
    let assData:AssessmentStructure[] = [
      {
        "assessmentId": 1,
        "assessmentName": "xact",
        "organisationName": "abc",
        "assessmentStatus": "ACTIVE",
        "updatedAt": 1649836702001
      },
      {
        "assessmentId": 1,
        "assessmentName": "xact",
        "organisationName": "abc",
        "assessmentStatus": "ACTIVE",
        "updatedAt": 1649836702000
      }

    ]
    expect(component).toBeTruthy();
    fixture.detectChanges()
    mockAppService.getAssessments().subscribe((data) => {
      expect(data).toBe(assData)
    })
  });
  it("should get navigated to the module route.", () => {
    jest.spyOn(component.router,'navigateByUrl')
    const dummyAssessmentName = "hello123"
    expect(component.assessmentModule(dummyAssessmentName)).toBeTruthy()
    expect(component.router.navigateByUrl).toHaveBeenCalledWith('assessmentModule',{state:{assessmentName:dummyAssessmentName}})
  });
});
