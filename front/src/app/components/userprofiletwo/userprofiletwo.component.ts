import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-userprofiletwo',
  templateUrl: './userprofiletwo.component.html',
  styleUrls: ['./userprofiletwo.component.css']
})
export class UserprofiletwoComponent {
  changePassword:boolean=true;
  userInfoForm: FormGroup;
  passwordForm: FormGroup;

  email:string="smoalla1799@gmail.com"
  role:string="user"

  constructor(private formBuilder: FormBuilder){

    //decode jwt and assign userinfo to formfields dont forget email and role
    this.userInfoForm = this.formBuilder.group({
      firstname: ["Saif", [Validators.required]],
      lastname: ["Moalla", [Validators.required]],
      username: ["sam1799", [Validators.required]]
    });

    this.passwordForm = this.formBuilder.group({
      currentPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required]],
      confirmNewPassword: [null, [Validators.required]]
      
    });
  }


  updateProfile(){
    if(this.userInfoForm.valid){
      console.log(this.userInfoForm.value)
      //const firstnameValue: string = this.userInfoForm.controls['firstname'].value;
      console.log(this.userInfoForm.controls['firstname'].value)
      console.log(this.userInfoForm.value.firstname)
    }
     
      

  }

  updatePassword(){
    if(this.passwordForm.valid){
      console.log(this.passwordForm.value)
    }

  }

  toggleChangePassword(){
    this.changePassword=!this.changePassword
  }

}
