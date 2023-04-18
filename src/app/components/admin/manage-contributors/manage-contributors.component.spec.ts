import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ManageContributorsComponent} from './manage-contributors.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {of, throwError} from "rxjs";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {MatChipInputEvent, MatChipsModule} from "@angular/material/chips";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {ManageContributorRequest} from "../../../types/Contributor/ManageContributorRequest";

class MockDialog {
  open() {
    return {
      afterClosed: () => of({})
    }
  }

  closeAll() {
  }
}

class MockAppService {
  saveContributors(contributorRequest : ManageContributorRequest, moduleId: number){
    if(moduleId === 1){
      return of([]);
    }else{
      return throwError("Error!")
    }
 }
}

describe('ManageContributorsComponent', () => {
  let component: ManageContributorsComponent;
  let fixture: ComponentFixture<ManageContributorsComponent>;
  let matDialog: MatDialog
  let mockAppService: MockAppService
  const reload = ()=>{
    window.location.reload();
  }
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
    Object.defineProperty(window,"location",{
      configurable:true,
      value:{
        reload : jest.fn()
      }
    })
    fixture = TestBed.createComponent(ManageContributorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    matDialog = fixture.debugElement.injector.get(MatDialog)
    mockAppService=new MockAppService();
    let contributors = [
      {
        userEmail:"bbc@thoughtworks.com",
        role:"REVIEWER"
      },
      {
        userEmail:"abc@thoughtworks.com",
        role:"AUTHOR"
      }
    ]
    component.data={
      moduleId:1,
      moduleName:"module",
      categoryName : "category",
      categoryId : 1,
      categoryStatus:true,
      active : true,
      contributors:contributors,
      updatedAt :1243214,
      comments : "",
      isEdit : true
    }
  });
  afterAll(()=>{
    Object.defineProperty(window,"location",{
      configurable:true,
      value:{
        reload : window.location
      }
    })
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add the contributor', () => {
    let userEmail = "abc@thoughtworks.com";
    let role = "AUTHOR"
    component.addContributor({
      value: userEmail
    } as MatChipInputEvent, role)
    expect(component.authors.length).toBe(1);
  })

  it('should not add invalid email as author', () => {
    let userEmail = "abc@thoughtwors.com";
    let role = "AUTHOR"
    component.addContributor({
      value: userEmail
    } as MatChipInputEvent, role)
    expect(component.authors.length).toBe(0);
  });
  it('should not add invalid email as reviewer', () => {
    let userEmail = "abc@thoughtwors.com";
    let role = "REVIEWER"
    component.addContributor({
      value: userEmail
    } as MatChipInputEvent, role)
    expect(component.reviewers.length).toBe(0);
  });
  it('should remove the contributor', () => {
    let userEmail = "abc@thoughtwors.com";
    let role = "AUTHOR"
    component.contributors.set("AUTHOR", [{
      userEmail: userEmail,
      role: role
    }])
    component.removeContributor(userEmail, role);
    expect(component.contributors.get(role)?.length).toBe(0)
  });
  it("should save contributor", () => {
    component.ngOnInit()
    component.authorFormControl.setValue(component.authors);
    component.reviewerFormControl.setValue(component.reviewers);
    jest.spyOn(matDialog,"closeAll")
    component.saveContributors()
    reload();
    expect(component.authors.length).toBe(1)
    expect(matDialog.closeAll).toHaveBeenCalled()
    expect(window.location.reload).toHaveBeenCalled()
  });
  it("should show error when request is wrong", () => {
    component.ngOnInit();
    component.data.moduleId=2;
    component.authorFormControl.setValue(component.authors);
    component.reviewerFormControl.setValue(component.reviewers);
    jest.spyOn(component,"showError")
    component.saveContributors();
    expect(component.showError).toHaveBeenCalled()
  });
  it("should reset the author form when input is empty", () => {
    let text="";
    component.onInputChange(text,"AUTHOR")
    expect(component.authorFormControl.valid).toBe(false)
  });
  it("should reset the reviewer form when input is empty", () => {
    let text="";
    component.onInputChange(text,"REVIEWER")
    expect(component.reviewerFormControl.valid).toBe(false)
  });
  it('should set author form invalid when duplicate author has added', () => {
    let userEmail = "abc@thoughtworks.com";
    let role = "AUTHOR"
    component.ngOnInit()
    component.addContributor({
      value: userEmail
    } as MatChipInputEvent, role)
    expect(component.authorFormControl.valid).toBe(false);
  })
  it('should set reviewer form invalid when duplicate author has added', () => {
    let userEmail = "bbc@thoughtworks.com";
    let role = "REVIEWER"
    component.ngOnInit()
    component.addContributor({
      value: userEmail
    } as MatChipInputEvent, role)
    expect(component.reviewerFormControl.valid).toBe(false);
  })
  it('should set reviewer form invalid when duplicate author has added', () => {
    let userEmail = "abc@thoughtworks.com";
    let role = "REVIEWER"
    component.ngOnInit()
    component.addContributor({
      value: userEmail
    } as MatChipInputEvent, role)
    expect(component.reviewerFormControl.valid).toBe(false);
  })
  it('should set author form invalid when duplicate author has added', () => {
    let userEmail = "bbc@thoughtworks.com";
    let role = "AUTHOR"
    component.ngOnInit()
    component.addContributor({
      value: userEmail
    } as MatChipInputEvent, role)
    expect(component.authorFormControl.valid).toBe(false);
  })
});
