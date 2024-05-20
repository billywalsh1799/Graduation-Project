import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { PasswordResetRequest } from 'src/app/services/interfaces/shared-interfaces';
import { setCustomFormError, validatePasswordConfirmation } from 'src/app/services/methods/formUtils';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {
  userInfoForm: FormGroup;
  passwordForm: FormGroup;

  currentHide:boolean = true;
  newHide:boolean=true
  confirmHide:boolean=true

 

  constructor(private formBuilder: FormBuilder ,private authService:AuthService
    ,private userService:UserService){

    
    
    this.userInfoForm = this.formBuilder.group({
      firstname: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      username: [null, [Validators.required]],
      email: [null],
      roles:[null]
    });

    this.passwordForm = this.formBuilder.group({
      currentPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required]],
      confirmNewPassword: [null, [Validators.required]]
      
    });

    // Subscribe to value changes of password and confirmPassword controls
    this.passwordForm.get('newPassword')?.valueChanges.subscribe(() => {
      validatePasswordConfirmation(this.passwordForm,"newPassword","confirmNewPassword");
    });
    this.passwordForm.get('confirmNewPassword')?.valueChanges.subscribe(() => {
      validatePasswordConfirmation(this.passwordForm,"newPassword","confirmNewPassword");
    });
  }
  ngOnInit(): void {
    //decode jwt and assign userinfo to formfields dont forget email and role
    console.log("oninit")
    //console.log("jwt",this.authService.getToken())
    const jwtInfo=this.authService.DecodeToken()
    console.log("jwt",jwtInfo)
    
    const {sub}=jwtInfo

    this.userService.getUserInfo(sub).subscribe({
      next:res=>{
        let {firstname,lastname,username,email,roles}=res
        roles=this.formatRoles(roles)
        this.userInfoForm.patchValue({
          firstname,
          lastname,
          username,
          email,
          roles
        })
      },
      error:err=>{
        console.log(err)
        
      }
    })
  }
  formatRoles(roles:any) {
    // Extract role names from the array of role objects
    const roleNames = roles.map((role:any) => role.replace('ROLE_', '')); // Remove 'ROLE_' prefix if exists
    // Join role names with commas
    const formattedRoles = roleNames.join(',');
    return formattedRoles;
}

  onTabChange(event: any) {
    if (event === 1) { // Check if the "Security Settings" tab is selected
      this.passwordForm.reset(); // Reset password form
    }
  }

  updateProfile(){
    if(this.userInfoForm.valid){
      const {firstname,lastname,username,email}=this.userInfoForm.value
      const request={firstname,lastname,username,email}
      this.userService.updateProfile(request).subscribe({
        next:res=>{
          //get user info from endpoint on init update form after res in userdto
          console.log("success",res)
          const {firstname,lastname,username}=res
          this.userInfoForm.patchValue({
            firstname,
            lastname,
            username
          })

        },
        error:err=>{
          console.log(err)
          let errorMessage=err.error.message;
          if(errorMessage=="Username is already in use"){
            setCustomFormError(this.userInfoForm,"username",errorMessage)
          }
        }
      })
     
    }
  }

  changePassword() {
    console.log("email",this.userInfoForm.value['email'])
    
  }
  resetPassword(){
    if(this.passwordForm.valid){
      const {currentPassword,newPassword}=this.passwordForm.value
      //get email from data
      const request:PasswordResetRequest={currentPassword,newPassword,email:this.userInfoForm.value['email']}
      console.log("request",request)
      this.userService.resetPassword(request).subscribe({
        next:res=>{
          console.log("success",res)
          //snackbar
        },
        error:err=>{
          console.log("error",err)
          //set custom error
          let errorMessage=err.error.message;
          setCustomFormError(this.passwordForm,"currentPassword",errorMessage)
         
        }
      })
    }
  
  }

 

  

}


