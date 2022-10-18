/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProgressComponentComponent} from './progress-component.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

describe('ProgressComponentComponent', () => {
  let component: ProgressComponentComponent;
  let fixture: ComponentFixture<ProgressComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProgressComponentComponent],
      imports: [MatProgressSpinnerModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
