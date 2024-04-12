import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { Router } from '@angular/router';

import { jwtDecode } from "jwt-decode";

interface authResponse{
  access_token:string,
  refresh_token:string
}



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private AUTH_ENDPOINT:string="http://localhost:8080/api/auth/"

  constructor(private http: HttpClient,private router: Router) {}

  DecodeToken(): any {
    let token=this.getToken()
    if(token!=null){
      const decodedHeader = jwtDecode(this.getToken());
     return decodedHeader

    }
    else{
      return null
    }
    
  }

  login(credentials: {username:string,password:string}): Observable<authResponse> {
    
    return this.http.post<authResponse>(this.AUTH_ENDPOINT+"authenticate", credentials);
  }

  /* login(credentials: { username: string, password: string }): Observable<any> {
    return this.http.post<any>(this.AUTH_ENDPOINT + "authenticate", credentials)
      .pipe(
        catchError(error => {
          return throwError(()=>error); // Ensure error is propagated
        })
      );
  } */

  register(userData:any): Observable<authResponse> {
    return this.http.post<authResponse>(this.AUTH_ENDPOINT+"register", userData);
  }

  refreshToken():Observable<authResponse>{
    return this.http.post<authResponse>(this.AUTH_ENDPOINT+"refresh",{refresh_token:this.getRefreshToken()});

  }

  getToken(): any {
    return localStorage.getItem('access_token');
  }

  setToken(token:string):void{
    localStorage.setItem("access_token",token);
  }

  getRefreshToken():string | null{
    return localStorage.getItem('refresh_token');
  }

  storeTokens(jwt: authResponse): void {
    localStorage.setItem('access_token', jwt.access_token);
    localStorage.setItem('refresh_token',jwt.refresh_token);
  }



  signOut(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/login']);
    
  }
}
