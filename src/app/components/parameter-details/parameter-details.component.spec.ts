import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterDetailsComponent } from './parameter-details.component';

describe('ParameterDetailsComponent', () => {
  let component: ParameterDetailsComponent;
  let fixture: ComponentFixture<ParameterDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParameterDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
