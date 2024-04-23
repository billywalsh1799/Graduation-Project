import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PasswordResetRequest, ProfileUpdateRequest } from './interfaces/shared-interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private USER_ENDPOINT:string="http://localhost:8080/api/user/"

  constructor(private http:HttpClient) { }

  //update profile request
  //passwordreset request
  //check if unchagned before 
  //snackbar for password reset and update profile

  ///after rfile updae gneerate new access token

  getUserInfo(email:string){
    return this.http.get<any>(this.USER_ENDPOINT+email)

  }


  updateProfile(request:ProfileUpdateRequest){
    return this.http.post<any>(this.USER_ENDPOINT+"update-profile",request);
  }

  resetPassword(request:PasswordResetRequest){
    return this.http.post<any>(this.USER_ENDPOINT+"rest-password",request);

  }
  


}
