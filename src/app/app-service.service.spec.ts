import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AppServiceService } from './app-service.service';
import { AppComponent } from './app.component';

describe('AppServiceService', () => {
  let service: AppServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientModule
      ],
      providers:[
        AppServiceService,
      ]
    });
    service = TestBed.inject(AppServiceService);

});

  it('should be created', () => {
    expect(service).toBeTruthy() ;
  });
  it('should get response from server',() =>{
    expect(service.getBackendData()).toBeTruthy();
  })
});
