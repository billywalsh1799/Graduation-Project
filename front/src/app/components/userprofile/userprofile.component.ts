import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { PasswordresetpopupComponent } from '../passwordresetpopup/passwordresetpopup.component';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {
  userInfoForm: FormGroup;
  passwordForm: FormGroup;

 

  constructor(private formBuilder: FormBuilder ,private authService:AuthService
    ,private dialog:MatDialog,private userService:UserService){

    
    
    this.userInfoForm = this.formBuilder.group({
      firstname: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      username: [null, [Validators.required]],
      email: [null],
      role:[null]
    });

    this.passwordForm = this.formBuilder.group({
      currentPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required]],
      confirmNewPassword: [null, [Validators.required]]
      
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
        const {firstname,lastname,username,email,role}=res
        this.userInfoForm.patchValue({
          firstname,
          lastname,
          username,
          email,
          role
        })
      },
      error:err=>{
        console.log(err)
      }
    })
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
        }
      })
     
    }
  }

  changePassword() {
    console.log("email",this.userInfoForm.value['email'])
    this.OpenDialog('200ms', '200ms',{email:this.userInfoForm.value.email});
  }

  OpenDialog(enteranimation: any, exitanimation: any,userInfo:any) {
    const popup = this.dialog.open(PasswordresetpopupComponent, {
      enterAnimationDuration: enteranimation,
      exitAnimationDuration: exitanimation,
      width: '20%',
      data:userInfo
    });
    
  }

  

}


