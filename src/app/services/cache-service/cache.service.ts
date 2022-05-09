import {HttpRequest, HttpResponse} from "@angular/common/http";
import {Injectable} from '@angular/core';
import {CacheEntry, MAX_CACHE_AGE} from "../../types/cache-entry";


abstract class HttpCache {
  abstract get(req: HttpRequest<any>): HttpResponse<any> | null;
  abstract put(req: HttpRequest<any>, res: HttpResponse<any>): void;
}

@Injectable()
export class HttpCacheService implements HttpCache {
  cache = new Map<string, CacheEntry>();
  public isExpired: boolean;

  get(req: HttpRequest<any>): HttpResponse<any> | null {
    const entry = this.cache.get(req.urlWithParams);
    if (!entry) {
      return null;
    }
    this.isExpired = (Date.now() - entry.entryTime) > MAX_CACHE_AGE;
    return this.isExpired ? null : entry.response;
  }

  put(req: HttpRequest<any>, res: HttpResponse<any>): void {
    const entry: CacheEntry = {url: req.urlWithParams, response: res, entryTime: Date.now()}
    console.log(entry)
    this.cache.set(req.urlWithParams, entry);
    this.deleteExpiredCache();
  }

  private deleteExpiredCache() {
    this.cache.forEach(entry => {
      if ((Date.now() - entry.entryTime) > MAX_CACHE_AGE) {
        this.cache.delete(entry.url);
      }
    })
  }
}
