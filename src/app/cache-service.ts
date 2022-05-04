import {HttpRequest, HttpResponse} from "@angular/common/http";
import {Injectable} from '@angular/core';
import {CacheEntry, MAX_CACHE_AGE} from "./cache-entry";


abstract class HttpCache {
  abstract get(req: HttpRequest<any>): HttpResponse<any> | null;
  abstract put(req: HttpRequest<any>, res: HttpResponse<any>): void;
}


@Injectable()
export class HttpCacheService implements HttpCache {
  cache = new Map<string, CacheEntry>();

  get(req: HttpRequest<any>): HttpResponse<any> | null {
    const entry = this.cache.get(req.urlWithParams);
    if (!entry) {
      return null;
    }
    const isExpired = (Date.now() - entry.entryTime) > MAX_CACHE_AGE;
    return isExpired ? null : entry.response;
  }

  put(req: HttpRequest<any>, res: HttpResponse<any>): void {
    const entry: CacheEntry = {url: req.urlWithParams, response: res, entryTime: Date.now()}
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
