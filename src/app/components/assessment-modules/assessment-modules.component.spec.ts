import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentModulesComponent } from './assessment-modules.component';

describe('AssessmentModulesComponent', () => {
  let component: AssessmentModulesComponent;
  let fixture: ComponentFixture<AssessmentModulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentModulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.assessmentName = "dummyAssessment"
    window.history.pushState({assessmentName:"hello"},'','assessmentModule')
    expect(component).toBeTruthy();
  });
});
