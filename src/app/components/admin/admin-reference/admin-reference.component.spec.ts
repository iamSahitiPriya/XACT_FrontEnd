
/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReferenceComponent } from './admin-reference.component';

describe('AdminReferenceComponent', () => {
  let component: AdminReferenceComponent;
  let fixture: ComponentFixture<AdminReferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminReferenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
