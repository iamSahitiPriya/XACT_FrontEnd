import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminParameterComponent } from './admin-parameter.component';

describe('AdminParameterComponent', () => {
  let component: AdminParameterComponent;
  let fixture: ComponentFixture<AdminParameterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminParameterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
