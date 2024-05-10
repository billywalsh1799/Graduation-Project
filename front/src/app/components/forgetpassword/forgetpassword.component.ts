import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.css']
})
export class ForgetpasswordComponent {

  email: string = '';

  constructor(private authService:AuthService,private snackBar: MatSnackBar){}

  onSubmit() {
    // Handle form submission here
    console.log('Email:', this.email);
    this.authService.forgetPassword(this.email).subscribe({
      next:(res:any)=>{
        console.log("successful use snackbar",res)
        this.snackBar.open(res.message, 'Close', {
          duration: 5000,
          verticalPosition: 'top'
        });
      },
      error:err=>{
        console.log("error forget password")
      }
    })
  }


}