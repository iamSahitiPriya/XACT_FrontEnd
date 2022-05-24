/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ParameterLevelAssessmentComponent} from './parameter-level-assessment.component';
import {MatDialog, MatDialogModule} from "@angular/material/dialog";

describe('ParameterLevelAssessmentComponent', () => {
  let component: ParameterLevelAssessmentComponent;
  let fixture: ComponentFixture<ParameterLevelAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParameterLevelAssessmentComponent ],
      imports:[MatDialogModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterLevelAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {

    expect(component).toBeTruthy();
  });
  it('should fetch the selected index', () => {
    component.selectedIndex = 0
    component.next()
    expect(component.selectedIndex).toBe(1)
  });

  it('should move back selected index', () => {
    component.selectedIndex = 1
    component.previous()
    expect(component.selectedIndex).toBe(0)
    component.previous()
    expect(component.selectedIndex).toBe(0)
  });


});
