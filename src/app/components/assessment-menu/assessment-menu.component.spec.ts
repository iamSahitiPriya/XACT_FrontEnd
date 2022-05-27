import {ComponentFixture, fakeAsync, flush, TestBed, tick} from '@angular/core/testing';

import {AssessmentMenuComponent} from './assessment-menu.component';
import {MatMenuModule} from "@angular/material/menu";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {MatIconModule} from "@angular/material/icon";
import {of} from "rxjs";

describe('AssessmentMenuComponent', () => {
  let component: AssessmentMenuComponent;
  let fixture: ComponentFixture<AssessmentMenuComponent>;

  class MockAppService {
    generateReport() {
      return of(new Blob());
    }

  }

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [AssessmentMenuComponent],
      providers: [
        {provide: AppServiceService, useClass: MockAppService}
      ],
      imports: [MatMenuModule, MatIconModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call generate report on click', fakeAsync(() => {
    jest.spyOn(component, 'generateReport');
    global.URL.createObjectURL = jest.fn();
    global.URL.revokeObjectURL = jest.fn();

    let generateReport = fixture.debugElement.nativeElement.querySelector("#generate-report");
    generateReport.click();
    tick();
    expect(component.generateReport).toHaveBeenCalled();
    flush()
  }));
});
