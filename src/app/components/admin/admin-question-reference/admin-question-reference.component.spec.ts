import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminQuestionReferenceComponent } from './admin-question-reference.component';

describe('AdminQuestionReferenceComponent', () => {
  let component: AdminQuestionReferenceComponent;
  let fixture: ComponentFixture<AdminQuestionReferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminQuestionReferenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminQuestionReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
