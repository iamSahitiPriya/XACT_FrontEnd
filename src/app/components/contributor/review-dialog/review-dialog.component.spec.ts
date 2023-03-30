import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ReviewDialogComponent} from './review-dialog.component';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {of, throwError} from "rxjs";
import {FormsModule} from "@angular/forms";

describe('ReviewDialogComponent', () => {
  let component: ReviewDialogComponent;
  let mockAppService: MockAppService
  let fixture: ComponentFixture<ReviewDialogComponent>;

  class MockAppService {
    questionResponse = {
      comments: "hello",
      questionId: [605],
      status: "Sent_For_Review"
    }

    sendForReview(moduleId: number, status: string, question: any) {
      if(moduleId === 1) {
        return of(this.questionResponse)
      }else{
        return throwError("Error!")
      }
    }

  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReviewDialogComponent],
      imports: [MatDialogModule, HttpClientTestingModule, MatSnackBarModule, BrowserAnimationsModule, NoopAnimationsModule, FormsModule],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: MatDialogRef, useValue: {}},
        {provide: AppServiceService, useClass: MockAppService}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ReviewDialogComponent);
    mockAppService = new MockAppService()
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error while sending questions for review', () => {
    jest.spyOn(component, 'showError')

    component.showError("Server error")

    expect(component.showError).toHaveBeenCalled()
  });
  it('should cancel changes', () => {
    jest.spyOn(component, 'cancelChanges')

    let cancelButton = fixture.debugElement.nativeElement.querySelector("#cancelChanges");
    cancelButton.click()

    expect(component.cancelChanges).toHaveBeenCalled()
  });

  it('should send questions to review', () => {
    jest.spyOn(component,'sendToReview')
    let moduleId = 1
    component.data = {
      question: {},
      moduleId: 1,
    }
    let question = [{questionId: 1, questionText: "hello"}]

    component.sendToReview(question)

    mockAppService.sendForReview(moduleId,'Sent_For_Review',question).subscribe(data =>{
      expect(data).toBeDefined()
    })

    expect(component.sendToReview).toHaveBeenCalled()

  });
  it('should throw error on unsuccessful API call', () => {
    jest.spyOn(component,'showError')
    let moduleId = 0
    component.data = {
      question: {},
      moduleId: 0,
    }
    let question = [{questionId: 1, questionText: "hello"}]

    component.sendToReview(question)

    mockAppService.sendForReview(moduleId,'Sent_For_Review',question).subscribe(data =>{
      expect(data).toBeUndefined()
      expect(component.showError).toHaveBeenCalled()
    })

  });
});
