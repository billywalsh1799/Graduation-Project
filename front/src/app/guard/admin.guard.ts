import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router,private http:HttpClient) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      const url: string = state.url;
      console.log('URL of the active route:', url);
      return this.http.get("http://localhost:8080/api/admin", { responseType: 'text' }).pipe(
        map((res:any) => {
          console.log("admin check")
          return true;
        }),
        catchError((err: any) => {
          return of(this.router.createUrlTree(['/unauthorized']));
        })
      );
    }

}
  

