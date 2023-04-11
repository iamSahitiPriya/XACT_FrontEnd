import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageContributorsComponent } from './manage-contributors.component';

describe('ManageContributorsComponent', () => {
  let component: ManageContributorsComponent;
  let fixture: ComponentFixture<ManageContributorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageContributorsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageContributorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
