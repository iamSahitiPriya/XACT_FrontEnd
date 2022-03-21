import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http"
import { Observable } from "rxjs"

export class Interceptors implements HttpInterceptor{
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

       let newInterceptor = req.clone({
           headers:req.headers.append('Getting-response-from-server','X-Act API')
       })
        return next.handle(newInterceptor);
    }
}