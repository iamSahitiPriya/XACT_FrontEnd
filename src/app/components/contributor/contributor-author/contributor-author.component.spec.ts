import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorAuthorComponent } from './contributor-author.component';

describe('ContributorAuthorComponent', () => {
  let component: ContributorAuthorComponent;
  let fixture: ComponentFixture<ContributorAuthorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContributorAuthorComponent ]
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
