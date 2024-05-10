import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router,private http:HttpClient) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      // Check if the token is expired
      /* if(this.authService.getToken()){
        return true
      }

      else{
        return this.router.navigate(['/login'])
      } */
      // Get the URL of the active route
      const url: string = state.url;
      console.log('URL of the active route:', url);
     
      return this.http.get("http://localhost:8080/api/demo", { responseType: 'text' }).pipe(
        map((res:any) => {
          console.log("token check")
          return true;
        }),
        catchError((err: any) => {
          return of(this.router.createUrlTree(['/login']));
        })
      );
  }
}
