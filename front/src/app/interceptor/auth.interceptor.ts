import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpClient
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  refresh: boolean = false;

  constructor(private authService: AuthService, private http: HttpClient) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let token = this.authService.getToken();
    //console.log("intercepted request_url:",request.url)
    if (token && !request.url.includes('/refresh')) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    }
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        //console.log("error",err.status,err)
        //console.log("refresh variable",!this.refresh)
        //console.log("error",err.error)

        console.log("err interceptor",err)
        //const errorResponse=JSON.parse(err.error)
        //let msg:string=errorResponse.message
        
        if (err.status === 401 && err.error=="JWT expired" && !this.refresh) {
          this.refresh = true;
          console.log("error inside")
          return this.authService.refreshToken().pipe(
            switchMap((res: any) => {
              let newToken = res.access_token;
              console.log("test response",res)
              this.authService.setToken(newToken);
              this.refresh = false;
              request = request.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`,
                  'Content-Type': 'application/json'
                }
              });
              return next.handle(request);
            }),
            catchError((error: any) => {
              this.authService.signOut();
              console.log("logging out")
              return throwError(() => error);
            })
          );
        }
        return throwError(() => err);
      })
    );
  }
}
