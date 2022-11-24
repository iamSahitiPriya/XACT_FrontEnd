import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserQuestionAnswerComponent } from './user-question-answer.component';

describe('UserQuestionAnswerComponent', () => {
  let component: UserQuestionAnswerComponent;
  let fixture: ComponentFixture<UserQuestionAnswerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserQuestionAnswerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserQuestionAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
