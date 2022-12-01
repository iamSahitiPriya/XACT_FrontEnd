import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserQuestionAnswerComponent } from './user-question-answer.component';
import {AppServiceService} from "../../services/app-service/app-service.service";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCardModule} from "@angular/material/card";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {StoreModule} from "@ngrx/store";
import {reducers} from "../../reducers/reducers";

class MockAppService {
}

describe('UserQuestionAnswerComponent', () => {
  let component: UserQuestionAnswerComponent;
  let fixture: ComponentFixture<UserQuestionAnswerComponent>;

  let mockAppService: MockAppService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserQuestionAnswerComponent ],
      providers: [{provide: AppServiceService, useClass: MockAppService}],
      imports: [MatFormFieldModule, MatCardModule, NoopAnimationsModule, FormsModule, ReactiveFormsModule, CommonModule, MatSnackBarModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserQuestionAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should be able to generate Question Template', () => {
    jest.spyOn(component,'generateQuestion');
    const button = fixture.nativeElement.querySelector("#addQuestionBox");
    button.click();
    expect(component.generateQuestion).toBeCalled();
  })
  it('should be able to change flag for removing question', () => {
    jest.spyOn(component,'removeQuestion');
    component.removeQuestion();
    expect(component.createQuestionFlag).toBe(false)
  })
});
