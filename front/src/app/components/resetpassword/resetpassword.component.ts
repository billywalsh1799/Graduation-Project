import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {
  passwordForm: FormGroup;
  token:any

  constructor(private formBuilder: FormBuilder,private authservice:AuthService,private route: ActivatedRoute){
    this.passwordForm = this.formBuilder.group({
      newPassword: [null, [Validators.required]],
      confirmNewPassword: ["", [Validators.required]]
      
    });
     // Subscribe to value changes of password and confirmPassword controls
     this.passwordForm.get('currentPassword')?.valueChanges.subscribe(() => {
      this.validatePasswordConfirmation();
    });
    this.passwordForm.get('confirmNewPassword')?.valueChanges.subscribe(() => {
      this.validatePasswordConfirmation();
    });
  }
  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    console.log(this.token)
  }

  private validatePasswordConfirmation() {
    const passwordControl = this.passwordForm.get('newPassword');
    const confirmPasswordControl = this.passwordForm.get('confirmNewPassword');

    // Check if password and confirmPassword fields match
    const passwordsMatch = passwordControl?.value === confirmPasswordControl?.value;

    // Set custom error on confirmPassword control if passwords don't match
    if (!passwordsMatch) {
      confirmPasswordControl?.setErrors({ 'passwordMismatch': true });
    } else {
      confirmPasswordControl?.setErrors(null); // Clear custom error if passwords match
    }
  }

  setCustomFormError(form:FormGroup,field:string,message:string) {
    const formControl = form.get(field);
    formControl?.setErrors({ customError: message }); // Set custom error for username
  }
  clearFormError(form:FormGroup,field:string) {
    const formControl = form.get(field);
    if (formControl?.errors?.['customError']) {
      formControl.setErrors(null); // Clear custom error
    }
  }

  resetPassword(){
    if(this.passwordForm.valid){
      console.log("reset token",this.token)
      const {newPassword}=this.passwordForm.value
      //get email from data
      const request={newPassword}
      console.log("request",request)
      this.authservice.resetPassword(this.token,request).subscribe({
        next:res=>{
          console.log("success",res)
          //snackbar
        },
        error:err=>{
          console.log("error",err)
          //set custom error
        
        }
      })
    }
  
  }

}
