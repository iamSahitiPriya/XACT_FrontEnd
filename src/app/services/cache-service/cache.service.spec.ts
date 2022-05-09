import { TestBed } from '@angular/core/testing';

import { HttpCacheService } from './cache.service';
import {HttpRequest, HttpResponse} from "@angular/common/http";
import {CacheEntry, MAX_CACHE_AGE} from "../../types/cache-entry";

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

  it('should check for the expired',
    () => {
      let dummyReq = new HttpRequest('GET', 'https://localhost:8100')
      let dummyResponse = new HttpResponse({body: "Hello", url: 'https://localhost:8100'})
      service.put(dummyReq, dummyResponse)
      service.get(dummyReq)
      service.isExpired = true

      expect(service.get(dummyReq)).toBe(dummyResponse)
    });
  it('should check for alternate case of expired', async () => {
    let dummyReq = new HttpRequest('GET', 'https://localhost:8100')
    let dummyResponse = new HttpResponse({body: "Hello", url: 'https://localhost:8100'})

    service.put(dummyReq, dummyResponse)
    Date.now = jest.fn(() => 7487076708000)
    service.get(dummyReq)
    expect(service.get(dummyReq)).toBeNull()
  });
  it('should delete cache when the time is expired', () => {
    let dummyReq = new HttpRequest('GET', 'https://localhost:8100')
    let dummyReq2 = new HttpRequest('GET', 'https://localhost:8200')

    let dummyResponse = new HttpResponse({body: "Hello", url: 'https://localhost:8100'})
    let dummyResponse2 = new HttpResponse({body: "Hello", url: 'https://localhost:8200'})

    service.put(dummyReq,dummyResponse)
    Date.now = jest.fn(() => 8487076708000)
    service.put(dummyReq2,dummyResponse2)

  });
});
