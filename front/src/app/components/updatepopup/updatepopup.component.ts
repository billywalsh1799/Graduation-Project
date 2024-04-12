import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-updatepopup',
  templateUrl: './updatepopup.component.html',
  styleUrls: ['./updatepopup.component.css']
})
export class UpdatepopupComponent  {

  roleList=[{code:"ROLE_ADMIN",name:"Admin"},{code:"ROLE_USER",name:"User"}]

  updateForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private dialogref: MatDialogRef<UpdatepopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {


      this.updateForm = this.formBuilder.group({
        role: [data.role, [Validators.required]],
        isactive: [data.enabled, [Validators.required]]
      });


  }
 

  UpdateUser() {
    //console.log("user updated succcessfully",this.updateForm.value)
    //console.log(this.data)
    const {role,isactive}=this.updateForm.value
    const updatedUserData={role,enabled:isactive}
    this.dialogref.close(updatedUserData);
  }
}