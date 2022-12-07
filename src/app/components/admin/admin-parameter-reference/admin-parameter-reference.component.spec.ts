import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminParameterReferenceComponent } from './admin-parameter-reference.component';

describe('AdminParameterReferenceComponent', () => {
  let component: AdminParameterReferenceComponent;
  let fixture: ComponentFixture<AdminParameterReferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminParameterReferenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminParameterReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
