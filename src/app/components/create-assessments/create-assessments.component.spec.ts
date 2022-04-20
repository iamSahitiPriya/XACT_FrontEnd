import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateAssessmentsComponent} from './create-assessments.component';
import {MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {OKTA_AUTH} from "@okta/okta-angular";
import oktaAuth from "@okta/okta-auth-js";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatTableModule} from "@angular/material/table";
import {ReactiveFormsModule} from "@angular/forms";
import {of} from "rxjs";

class MockDialog{
  open(){
    return{
      afterClosed:()=>of({})
    }
  }
  closeAll(){}
}
describe('CreateAssessmentsComponent', () => {
  let component: CreateAssessmentsComponent;
  let fixture: ComponentFixture<CreateAssessmentsComponent>;
  let dialog:any;
  let matDialog:any
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAssessmentsComponent ],
      imports:[MatDialogModule,RouterTestingModule,MatFormFieldModule,MatIconModule,MatInputModule,
        MatTableModule,HttpClientTestingModule,NoopAnimationsModule,
        ReactiveFormsModule],
      providers: [
        {provide: OKTA_AUTH, useValue: oktaAuth},
        {provide: MatDialog, useClass:MockDialog}

      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAssessmentsComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
    matDialog = fixture.debugElement.injector.get(MatDialog)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should open dialog box', () => {
    jest.spyOn(matDialog,'open')
    component.openAssessment("")
    fixture.detectChanges()
    expect(matDialog.open).toHaveBeenCalled()
  });
  it('should close the popup', () => {
    jest.spyOn(matDialog,'closeAll')
    component.closePopUp()
    fixture.detectChanges()
    expect(matDialog.closeAll).toHaveBeenCalled()
  });
});
