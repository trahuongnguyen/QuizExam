import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if ([403].includes(err.status) && this.authService.userLogged) {
                // auto logout if 401 or 403 response returned from api
                this.authService.logout();
            }
            if ([401].includes(err.status) && this.authService.userLogged) {
                // auto logout if 401 or 403 response returned from api
                this.authService.nagivateToPrePage();
            }
            const error = (err && err.error && err.error.message) || err.statusText;
            console.error(err);
            return throwError(error);
        }))
    }
}