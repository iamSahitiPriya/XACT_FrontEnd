import { TestBed } from '@angular/core/testing';

import { HttpCacheService } from './cache.service';
import {HttpRequest, HttpResponse} from "@angular/common/http";

describe('CacheService', () => {
  let service: HttpCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[],
      providers:[HttpCacheService]
    });
    service = TestBed.inject(HttpCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call', () => {
    jest.spyOn(service,'get').mockImplementation(() =>{
      return new HttpResponse({body:"Hello",url:'https://localhost:8100'})
    })
    let dummyResponse = new HttpResponse({body:"Hello",url:'https://localhost:8100'})
    let dummyReq =  new HttpRequest('GET','https://localhost:8100')
    service.get(dummyReq)
    expect(service.get(dummyReq)).toStrictEqual(dummyResponse)
  });

  it('should return null', () => {
    let dummyReq =  new HttpRequest('GET','https://localhost:8100')
    expect(service.get(dummyReq)).toBe(null)
  });

  it('should call put', () => {
    let dummyResponse = new HttpResponse({body:"Hello",url:'https://localhost:8100'})
    let dummyReq =  new HttpRequest('GET','https://localhost:8100')
    service.put(dummyReq,dummyResponse)
    expect(service.put(dummyReq,dummyResponse)).toBeUndefined()
  });
  it('should check for the expired', () => {
    jest.spyOn(service,'get').mockImplementation(() =>{
      return null
    })
    service.isExpired = true
    let dummyReq =  new HttpRequest('GET','https://localhost:8100')
    service.get(dummyReq)
    expect(service.get(dummyReq)).toBe(null)
  });
});
