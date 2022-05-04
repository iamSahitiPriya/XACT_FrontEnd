import {HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http"
import {Injectable} from "@angular/core";
import {of, tap} from "rxjs";
import {HttpCacheService} from "./cache-service";

const CACHABLE_URL = "/v1/assessment-master-data/categories";

@Injectable()
export class cacheInterceptor implements HttpInterceptor {
  constructor(private cacheService: HttpCacheService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    if (!cacheInterceptor.isRequestCachable(req)) {
      return next.handle(req);
    }
    const cachedResponse = this.cacheService.get(req);
    if (cachedResponse !== null) {
      // console.log("This is cached Response");
      return of(cachedResponse);
    }
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.cacheService.put(req, event);
        }
      })
    );
  }

  private static isRequestCachable(req: HttpRequest<any>) {
    return (req.method === 'GET') && (req.url.indexOf(CACHABLE_URL) > -1);
  }
}
