import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAssessmentsComponent } from './create-assessments.component';
import {MatDialogModule} from "@angular/material/dialog";

describe('CreateAssessmentsComponent', () => {
  let component: CreateAssessmentsComponent;
  let fixture: ComponentFixture<CreateAssessmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAssessmentsComponent ],
      imports:[MatDialogModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
