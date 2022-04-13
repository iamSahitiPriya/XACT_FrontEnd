import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentsComponent } from './assessments.component';
import {HttpClient, HttpHandler} from "@angular/common/http";

describe('AssessmentsComponent', () => {
  let component: AssessmentsComponent;
  let fixture: ComponentFixture<AssessmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentsComponent ],

      providers:[HttpClient,HttpHandler]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
