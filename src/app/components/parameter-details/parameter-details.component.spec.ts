import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ParameterDetailsComponent} from './parameter-details.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";


describe('ParameterDetailsComponent', () => {
  let component: ParameterDetailsComponent;
  let fixture: ComponentFixture<ParameterDetailsComponent>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParameterDetailsComponent],
      imports: [MatFormFieldModule, MatInputModule]
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
