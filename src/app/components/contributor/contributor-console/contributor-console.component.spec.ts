import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorConsoleComponent } from './contributor-console.component';

describe('ContributorConsoleComponent', () => {
  let component: ContributorConsoleComponent;
  let fixture: ComponentFixture<ContributorConsoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContributorConsoleComponent ]
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
