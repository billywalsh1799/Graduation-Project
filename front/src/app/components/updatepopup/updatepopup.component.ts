import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-updatepopup',
  templateUrl: './updatepopup.component.html',
  styleUrls: ['./updatepopup.component.css']
})
export class UpdatepopupComponent   {

  //roleList=[{code:"ROLE_ADMIN",name:"Admin"},{code:"ROLE_USER",name:"User"}]
  rolesList:any=[]

  rolesCtrl = new FormControl('');
  roles: any = [];

  allRoles: string[] = [];
  filteredRoles:string[]=[]

  updateForm: FormGroup;

  @ViewChild('roleInput') roleInput!: ElementRef<HTMLInputElement>;

  constructor(private formBuilder: FormBuilder,
    private dialogref: MatDialogRef<UpdatepopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {

      //this.rolesList=data.rolesList
      console.log("user data",data)

      this.allRoles=data.rolesList
      this.roles = [...data.roles];
      //this.filteredRoles=this.allRoles
      this.filteredRoles=this.data.rolesList.filter((role:any) => !data.roles.includes(role));


      this.updateForm = this.formBuilder.group({
        role: [data.role, [Validators.required]],
        isactive: [data.enabled, [Validators.required]]
      });


  }


 

  remove(role: any): void {
    //this.rolesCtrl.setValue(null); 

    if(role=="ROLE_USER")
        return
    const index = this.roles.indexOf(role);

    if (index >= 0) {
      this.roles.splice(index, 1);
      this.filteredRoles.push(role);
    } 
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const selectedRole = event.option.value
  
    // Check if the selected reviewer is already in the list
    if (!this.roles.includes(selectedRole)) {
      this.roles.push(selectedRole);
      this.filteredRoles = this.filteredRoles.filter(role => role !== selectedRole);
    } 
    this.roleInput.nativeElement.value = '';
    //this.filteredRoles=this.allRoles
    this.filterRoles("")
    this.rolesCtrl.setValue(null); 
    
  }

  searchRole(){
    console.log("roles input",this.rolesCtrl.value)
    if(this.rolesCtrl.value){
      this.filterRoles(this.rolesCtrl.value)
    }
    /* else {
      this.filteredRoles = this.allRoles;
    } */
    else {
      // Reset filtered reviewers to include all reviewers except the selected ones
      this.filteredRoles = this.allRoles.filter(role => !this.roles.includes(role));
    }
    
  }

  filterRoles(value: string) {
    const filterValue = value.toLowerCase();
    //this.filteredRoles=this.allRoles.filter((role:any) => role.toLowerCase().substring(5).startsWith(filterValue));
    this.filteredRoles=this.allRoles.filter(role => role.toLowerCase().substring(5).startsWith(filterValue) && !this.roles.includes(role));
  
  }
 

  UpdateUser() {
    //console.log("user updated succcessfully",this.updateForm.value)
    //console.log(this.data)
    //check if values not changed
    const {isactive}=this.updateForm.value
    console.log("form data",isactive,this.roles)
    

    const updatedUserData={roles:this.roles,enabled:isactive}
    this.dialogref.close(updatedUserData);
  }
}