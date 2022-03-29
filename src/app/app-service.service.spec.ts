import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { AppServiceService } from './app-service.service';

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

});
