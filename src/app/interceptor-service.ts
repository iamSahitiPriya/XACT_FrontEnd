/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http"
import {Inject, Injectable} from "@angular/core";
import {OKTA_AUTH} from "@okta/okta-angular";
import {OktaAuth} from "@okta/okta-auth-js";
import {of, tap} from "rxjs"
import {HttpCacheService} from "./services/cache-service/cache.service";

const CACHABLE_URL = "/v1/assessment-master-data/categories";

@Injectable()
export class Interceptors implements HttpInterceptor {
  accessToken?: string

  constructor(@Inject(OKTA_AUTH) public oktaAuth: OktaAuth, private cacheService: HttpCacheService) {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): any{
    this.accessToken = this.oktaAuth.getAccessToken() || "None value";
    req =  req.clone({
      headers: req.headers.append('Authorization', `Bearer ${this.accessToken}`)
    })
    if (!Interceptors.isRequestCacheable(req)) {
      return next.handle(req);
    }
    const cachedResponse = this.cacheService.get(req);
    if (cachedResponse !== null) {
      return of(cachedResponse);
    }
    return next.handle(req)
    .pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.cacheService.put(req, event);
        }
      })
    );
  }
  private static isRequestCacheable(req: HttpRequest<any>) {
    return (req.method === 'GET') && (req.url.indexOf(CACHABLE_URL) > -1);
  }
}
