import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ReviewDialogComponent} from './review-dialog.component';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {of, throwError} from "rxjs";
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {Question} from "../../../types/Contributor/Question";
import {ContributorQuestionRequest} from "../../../types/Contributor/ContributorQuestionRequest";

describe('ReviewDialogComponent', () => {
  let component: ReviewDialogComponent;
  let mockAppService: MockAppService
  let fixture: ComponentFixture<ReviewDialogComponent>;

  class MockAppService {
    questionResponse = {
      comments: "hello",
      questionId: [605],
      status: "SENT_FOR_REVIEW"
    }

    updateQuestionStatus(moduleId: number,action:string,question : ContributorQuestionRequest) {
      if(moduleId === 1)
        return of(this.questionResponse)
      else
        return throwError("Error!")
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReviewDialogComponent],
      imports: [MatDialogModule, HttpClientTestingModule, MatSnackBarModule, BrowserAnimationsModule, NoopAnimationsModule, FormsModule,MatFormFieldModule,MatInputModule],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: MatDialogRef, useValue: {}},
        {provide: AppServiceService, useClass: MockAppService}
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(ReviewDialogComponent);
    mockAppService = new MockAppService()
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.data.action = "REJECTED"
    component.ngOnInit()
    expect(component).toBeTruthy();
  });

  it('should show error while sending questions for review', () => {
    jest.spyOn(component, 'showError')

    component.showError("Server error")

    expect(component.showError).toHaveBeenCalled()
  });
  it('should cancel changes', () => {
    jest.spyOn(component, 'cancelChanges')

    component.data.action = "SENT_FOR_REVIEW"
    component.ngOnInit()
    let cancelButton = fixture.debugElement.nativeElement.querySelector("#cancel-changes");
    cancelButton.click()

    expect(component.cancelChanges).toHaveBeenCalled()
  });

  it('should send questions to review', () => {
    jest.spyOn(component,'evaluateQuestion')
    let moduleId = 1

    component.data.action = "REQUESTED_FOR_CHANGE"
    component.ngOnInit()
    component.data = {
      question: {},
      moduleId: 1,
    }
    let question : Question[] = [{questionId: 1, question: "hello",comments:"comments"}]
    let request : ContributorQuestionRequest = {comments: "", questionId: [1]}

    component.evaluateQuestion(question)

    mockAppService.updateQuestionStatus(moduleId,'SENT_FOR_REVIEW',request).subscribe(data =>{
      expect(data).toBeDefined()
    })

    expect(component.evaluateQuestion).toHaveBeenCalled()

  });
  it('should throw error on unsuccessful API call', () => {
    component.data.action = "PUBLISHED"
    component.ngOnInit()
    jest.spyOn(component,'showError')
    let moduleId = 0
    component.data = {
      question: {},
      moduleId: 0,
    }
    let question : Question[] = [{questionId: 1, question: "hello",comments:"comments"}]
    let request : ContributorQuestionRequest = {comments: "", questionId: [1]}

    component.evaluateQuestion(question)

    mockAppService.updateQuestionStatus(moduleId,'Sent_For_Review',request).subscribe(data =>{
      expect(data).toBeUndefined()
      expect(component.showError).toHaveBeenCalled()
    })
  });

  it("should return publish-button as class name when the action is published", () => {
    component.data.action = "PUBLISHED"
    component.ngOnInit()

    expect(component.getClass()).toBe("publish-button")
  });

  it("should return reject-button as class name when the action is rejected", () => {
    component.data.action = "REJECTED"
    component.ngOnInit()

    expect(component.getClass()).toBe("reject-button")
  });
});
