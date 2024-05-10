import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  userInitials:string=""
  constructor(private  http:HttpClient,private authService:AuthService,private router: Router){}


  ngOnInit(): void {
    this.userInitials=this.decodeToken().username.charAt(0)
  }

  testTokenExpiration(){
    return this.http.get("http://localhost:8080/api/demo",{ responseType: 'text' }).subscribe({
      next:res=>console.log("token expiration res success",res),
      error:err=>console.log("token expiration err mesage",err)
    })
  }

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
    return token
  }

  isLinkActive(route: string): boolean {
    return this.router.isActive(route, true);
  }

  logout() {
    console.log("logging out")
    this.authService.signOut()
  }
}
