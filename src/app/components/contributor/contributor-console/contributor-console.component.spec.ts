import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorConsoleComponent } from './contributor-console.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {StoreModule} from "@ngrx/store";
import {reducers} from "../../../reducers/reducers";

describe('ContributorConsoleComponent', () => {
  let component: ContributorConsoleComponent;
  let fixture: ComponentFixture<ContributorConsoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContributorConsoleComponent ],
      imports:[HttpClientTestingModule,StoreModule.forRoot(reducers)]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContributorConsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
