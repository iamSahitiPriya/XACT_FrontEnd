import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorReviewerComponent } from './contributor-reviewer.component';

describe('ContributorReviewerComponent', () => {
  let component: ContributorReviewerComponent;
  let fixture: ComponentFixture<ContributorReviewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContributorReviewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContributorReviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
