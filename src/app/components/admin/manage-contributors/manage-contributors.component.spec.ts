import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ManageContributorsComponent} from './manage-contributors.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from "@angular/material/dialog";
import {Inject} from "@angular/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {of} from "rxjs";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {MatChipsModule} from "@angular/material/chips";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {FormsModule, ReactiveFormsModule, UntypedFormBuilder} from "@angular/forms";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {AppServiceService} from "../../../services/app-service/app-service.service";

class MockDialog {
  open() {
    return {
      afterClosed: () => of({})
    }
  }

  close() {
  }
}
class MockAppService{

}

describe('ManageContributorsComponent', () => {
  let component: ManageContributorsComponent;
  let fixture: ComponentFixture<ManageContributorsComponent>;
  let matDialog: MatDialog
  let mockAppSerivice:MockAppService
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageContributorsComponent],
      imports: [MatDialogModule, MatFormFieldModule, BrowserAnimationsModule, NoopAnimationsModule, HttpClientTestingModule, MatChipsModule, MatInputModule, MatIconModule, MatSnackBarModule, FormsModule, ReactiveFormsModule],
      providers: [
        {provide: MatDialog, useClass: MockDialog},
        {provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: AppServiceService, useClass: MockAppService}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ManageContributorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    matDialog = fixture.debugElement.injector.get(MatDialog)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
