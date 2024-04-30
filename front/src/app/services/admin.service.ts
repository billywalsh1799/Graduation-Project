import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


interface User{
  username:string,
  email:string,
  role:string,
  status:boolean
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private ADMIN_ENDPOINT:string="http://localhost:8080/api/admin/"

  constructor(private http:HttpClient) { }

  getUsers(): Observable<any> {
    return this.http.get<any>(this.ADMIN_ENDPOINT+"users");
  }

  deleteUser(userId: Number): Observable<string> {
    return this.http.delete(this.ADMIN_ENDPOINT+"user/userid/"+userId,{ responseType: 'text' });
  }

  //request:type update request interfaces folder
  updateUser(userId:Number,updateRequest:any){
    return this.http.put<any>(this.ADMIN_ENDPOINT+"user/userid/"+userId+"/update",updateRequest)

  }

  getRoles(){
    return this.http.get<any>(this.ADMIN_ENDPOINT+"user/roles")
  }
  

}
