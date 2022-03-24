import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http"
import { Observable } from "rxjs"
import { OktaLoginComponent } from "./component/okta-login/okta-login.component";
export class Interceptors implements HttpInterceptor{
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

       let newInterceptor = req.clone({
           headers:req.headers.append('Access-Token',"Not given now")
       })
        return next.handle(newInterceptor);
    }
}