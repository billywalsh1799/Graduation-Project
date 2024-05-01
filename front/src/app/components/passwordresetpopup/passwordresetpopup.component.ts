import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PasswordResetRequest } from 'src/app/services/interfaces/shared-interfaces';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-passwordresetpopup',
  templateUrl: './passwordresetpopup.component.html',
  styleUrls: ['./passwordresetpopup.component.css']
})
export class PasswordresetpopupComponent {

  passwordForm: FormGroup;

  constructor(private formBuilder: FormBuilder,private dialogref: MatDialogRef<PasswordresetpopupComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any,
    private usrService:UserService
   ){
    this.passwordForm = this.formBuilder.group({
      currentPassword: [null, [Validators.required]],
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
  


  resetPassword(){
    if(this.passwordForm.valid){
      const {currentPassword,newPassword}=this.passwordForm.value
      //get email from data
      const request:PasswordResetRequest={currentPassword,newPassword,email:this.data.email}
      console.log("request",request)
      this.usrService.resetPassword(request).subscribe({
        next:res=>{
          console.log("success",res)
          //snackbar
        },
        error:err=>{
          console.log("error",err)
          //set custom error
          let errorMessage=err.error.message;
         
          this.setCustomFormError(this.passwordForm,"currentPassword",errorMessage)
         
        }
      })
    }
  
  }

}
