import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { validatePasswordConfirmation } from 'src/app/services/methods/formUtils';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {
  passwordForm: FormGroup;
  token:any

  constructor(private formBuilder: FormBuilder,private authservice:AuthService,private route: ActivatedRoute,
    private snackBar: MatSnackBar){
    this.passwordForm = this.formBuilder.group({
      newPassword: [null, [Validators.required]],
      confirmNewPassword: ["", [Validators.required]]
      
    });
     // Subscribe to value changes of password and confirmPassword controls
     this.passwordForm.get('currentPassword')?.valueChanges.subscribe(() => {
      validatePasswordConfirmation(this.passwordForm,"newPassword","confirmNewPassword");
    });
    this.passwordForm.get('confirmNewPassword')?.valueChanges.subscribe(() => {
      validatePasswordConfirmation(this.passwordForm,"newPassword","confirmNewPassword");
    });
  }
  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    console.log(this.token)
  }

  

  resetPassword(){
    if(this.passwordForm.valid){
      console.log("reset token",this.token)
      const {newPassword}=this.passwordForm.value
      //get email from data
      const request={newPassword}
      console.log("request",request)
      this.authservice.resetPassword(this.token,request).subscribe({
        next:(res:any)=>{
          console.log("success",res)
          //snackbar
          this.snackBar.open(res.message, 'Close', {
            duration: 5000,
            verticalPosition: 'top'
          });
        },
        error:err=>{
          console.log("error",err)
          //set custom error
        
        }
      })
    }
  
  }

}