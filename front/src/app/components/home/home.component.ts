import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
    constructor(private  http:HttpClient,private authService:AuthService){}

    testing(){
      return this.http.get("http://localhost:8080/api/demo",{ responseType: 'text' }).subscribe(res=>{
        console.log(res)
      }) 
      
    }

    refresh(){
      return this.http.post("http://localhost:8080/api/auth/refresh",{refresh_token:localStorage.getItem('refresh_token')}).subscribe((res:any)=>{
        const {access_token}=res  
      console.log(res)
        
        this.authService.setToken(access_token)
      }) 
      
    }

    decodeToken(){
      let token=this.authService.DecodeToken()
      console.log(token.role)
    }
}
