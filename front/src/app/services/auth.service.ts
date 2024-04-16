import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { Router } from '@angular/router';

import { jwtDecode } from "jwt-decode";
import { AuthResponse, LoginResponse } from './interfaces/shared-interfaces';






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

  login(credentials: {username:string,password:string}): Observable<AuthResponse> {
    
    return this.http.post<AuthResponse>(this.AUTH_ENDPOINT+"authenticate", credentials);
  }

  //register now returns string message to alert
  register(userData:any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.AUTH_ENDPOINT+"register", userData);
  }

  isTokenValid():Observable<string>{
    return this.http.post(this.AUTH_ENDPOINT+"validate-token-role",{token:this.getToken()},{ responseType: 'text' })
    
  }

  verifyEmail(token:any):Observable<AuthResponse>{
    return this.http.get<AuthResponse>(this.AUTH_ENDPOINT+"confirm?token="+token)

  }


  refreshToken():Observable<AuthResponse>{
    return this.http.post<AuthResponse>(this.AUTH_ENDPOINT+"refresh",{refresh_token:this.getRefreshToken()});

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

  storeTokens(jwt: AuthResponse): void {
    localStorage.setItem('access_token', jwt.access_token);
    localStorage.setItem('refresh_token',jwt.refresh_token);
  }



  signOut(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/login']);
    
  }
}
