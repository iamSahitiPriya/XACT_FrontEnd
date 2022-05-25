/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ParameterScoreComponent} from './parameter-score.component';
import {MatCardModule} from "@angular/material/card";
import {MatDialogModule} from "@angular/material/dialog";

describe('ParameterScoreComponent', () => {
  let component: ParameterScoreComponent;
  let fixture: ComponentFixture<ParameterScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParameterScoreComponent],
      imports: [MatCardModule, MatDialogModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});