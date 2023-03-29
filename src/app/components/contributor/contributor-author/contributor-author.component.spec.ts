import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorAuthorComponent } from './contributor-author.component';
import {MatDialogModule} from "@angular/material/dialog";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MatSnackBarModule} from "@angular/material/snack-bar";

describe('ContributorAuthorComponent', () => {
  let component: ContributorAuthorComponent;
  let fixture: ComponentFixture<ContributorAuthorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContributorAuthorComponent ],
      imports:[MatDialogModule, HttpClientTestingModule, MatSnackBarModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContributorAuthorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
