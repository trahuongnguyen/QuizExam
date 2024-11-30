import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { ToastrService } from "ngx-toastr";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private toastr: ToastrService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    this.toastr.error('Unauthorized access. Please log in again.');
                }
                else if (error.status === 403) {
                    this.toastr.error('You do not have permission to access this resource.');
                }
                else if (error.status === 500) {
                    this.toastr.error('Server error. Please try again later.');
                }
                return throwError(error);
            })
        );
    }
}