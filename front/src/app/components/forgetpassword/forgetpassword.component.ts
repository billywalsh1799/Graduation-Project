import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.css']
})
export class ForgetpasswordComponent {

  email: string = '';

  constructor(private authService:AuthService){}

  onSubmit() {
    // Handle form submission here
    console.log('Email:', this.email);
    this.authService.forgetPassword(this.email).subscribe({
      next:res=>{
        console.log("successful use snackbar")
      },
      error:err=>{
        console.log("error forget password")
      }
    })
  }


}
