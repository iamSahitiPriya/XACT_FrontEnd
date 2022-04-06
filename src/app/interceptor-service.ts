import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http"
import {Inject, Injectable} from "@angular/core";
import {OKTA_AUTH} from "@okta/okta-angular";
import {OktaAuth} from "@okta/okta-auth-js";
import {Observable} from "rxjs"

@Injectable()
export class Interceptors implements HttpInterceptor {
  accessToken?: string

  constructor(@Inject(OKTA_AUTH) public oktaAuth: OktaAuth) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.accessToken = this.oktaAuth.getAccessToken() || "None value";

    let newInterceptor = req.clone({
      headers: req.headers.append('Authorization', `Bearer ${this.accessToken}`)
    })
    return next.handle(newInterceptor);
  }
}
