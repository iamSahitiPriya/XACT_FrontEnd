import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAssessmentsComponent } from './create-assessments.component';
import {MatDialogModule} from "@angular/material/dialog";
import {OKTA_AUTH} from "@okta/okta-angular";
import oktaAuth from "@okta/okta-auth-js";

describe('CreateAssessmentsComponent', () => {
  let component: CreateAssessmentsComponent;
  let fixture: ComponentFixture<CreateAssessmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAssessmentsComponent ],
      imports:[MatDialogModule],
      providers: [
        {provide: OKTA_AUTH, useValue: oktaAuth},

      ]
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
