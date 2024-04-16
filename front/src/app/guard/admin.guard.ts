import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      return this.authService.isTokenValid().pipe(
        map((role: String) => {
          if (role=="ROLE_ADMIN") {
            return true;
          } else {
            return this.router.createUrlTree(['/unauthorized']);
          }
        }),
        catchError((error: any) => {
          console.error('Error occurred while validating token:', error);
          return of(this.router.createUrlTree(['/unauthorized']));
        })
      );
    }

}
  

