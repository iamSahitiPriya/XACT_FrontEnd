import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AssessmentAverageRatingComponent} from './assessment-average-rating.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCardModule} from "@angular/material/card";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {StoreModule} from "@ngrx/store";
import {reducers} from "../../reducers/reducers";

describe('AssessmentAverageRatingComponent', () => {
  let component: AssessmentAverageRatingComponent;
  let fixture: ComponentFixture<AssessmentAverageRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssessmentAverageRatingComponent],

      imports: [MatFormFieldModule, MatCardModule, NoopAnimationsModule, FormsModule, ReactiveFormsModule, CommonModule, MatSnackBarModule,
        StoreModule.forRoot(reducers)]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentAverageRatingComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
