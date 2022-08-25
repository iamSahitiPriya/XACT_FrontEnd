import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminConsoleComponent } from './admin-console.component';
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {HttpClientModule} from "@angular/common/http";

describe('AdminConsoleComponent', () => {
  let component: AdminConsoleComponent;
  let fixture: ComponentFixture<AdminConsoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminConsoleComponent ],
      imports:[MatIconModule, MatCardModule,HttpClientModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminConsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should set event', () => {
    const dummy = "parameter"
    component.setEvent(dummy);
    expect(component.type).toBe(dummy);
  });
});
