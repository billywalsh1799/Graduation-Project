import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { AdminService } from 'src/app/services/admin.service';
import { UpdatepopupComponent } from '../updatepopup/updatepopup.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements AfterViewInit {

  userList:any=[]
  rolesList:any=[]
  activeFilters:any={status:"",role:"",search:""}
  displayedColumns: string[] = ['id','firstname','lastname','username', 'email', 'role', 'status','action'];
  dataSource = new MatTableDataSource<any>(this.userList);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private adminService:AdminService,private dialog:MatDialog){
    this.loadUsers()
    this.loadRoles()

  }
  

  updateuser(userInfo: any) {
    this.OpenDialog('200ms', '200ms', userInfo);
  }

  OpenDialog(enteranimation: any, exitanimation: any, userInfo: any) {
    const popup = this.dialog.open(UpdatepopupComponent, {
      enterAnimationDuration: enteranimation,
      exitAnimationDuration: exitanimation,
      width: '400px',
      data:userInfo
       
    });
    popup.afterClosed().subscribe(updatedUserData => {
      //console.log("done updated now update view",updatedUserData)
      console.log("use data",updatedUserData)
      if (updatedUserData){
        this.adminService.updateUser(userInfo.id,updatedUserData).subscribe({
          next:res=>{
              console.log("response",res)   
              const index = this.userList.findIndex((user:any) => user.id === userInfo.id);
              if (index !== -1) {
                this.userList[index]= res
                this.dataSource.data = this.userList;
              }
          }
          ,error:err=>{
            console.log("error updating users",err)
          }
        })
      }
    });
  }
  loadUsers(){
    this.adminService.getUsers().subscribe({
      next:res=>{
        this.userList=res
        this.dataSource.data = this.userList;
        this.dataSource.sort=this.sort;
      },

      error:err=>{
        console.log("error loading users",err)
      }

    })
  }

  loadRoles() {
    this.adminService.getRoles().subscribe({
      next:res=>{
        this.rolesList=res.roles
      },
      error:err=>{
        console.log("error loading roles",err)
      }
    })
  }

  displayRoles(){
    console.log(this.rolesList)
  }

  deleteUser(userId: Number) {
    if (confirm("Are you sure you want to delete this user?")) {
      this.adminService.deleteUser(userId).subscribe({
        next: () => {
          // Remove the deleted user from the user list
          this.userList = this.userList.filter((user: any) => user.id !== userId);
          this.dataSource.data = this.userList;
        },
        error: err => {
          console.log("error deleting user", err);
        }
      });
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  // Apply filter for search
applySearchFilter(event: any) {
    let searchValue = event.target.value.trim().toLowerCase();
    this.activeFilters.search = searchValue;
    this.applyFilters();
  }

applyStatusFilter(event: any) {
  let status = event.value;
  this.activeFilters.status = status;
  this.applyFilters();
}

applyRoleFilter(event: any) {
  let role = event.value;
  this.activeFilters.role = role;
  this.applyFilters();
}

applyFilters() {

  // Filter the userList array based on the active filters
  let filteredData = this.userList.filter((user:any) => {
    // Check if the user matches the status filter
    const statusMatch = !this.activeFilters.status || 
                        user.enabled === (this.activeFilters.status === "Active");
    // Check if the user matches the role filter
    const roleMatch = !this.activeFilters.role || user.role === this.activeFilters.role;

    // Check if any of the user's properties contain the search filter value
    const searchMatch = !this.activeFilters.search ||
                        user.firstname.toLowerCase().includes(this.activeFilters.search) ||
                        user.lastname.toLowerCase().includes(this.activeFilters.search) ||
                        user.username.toLowerCase().includes(this.activeFilters.search) ||
                        user.email.toLowerCase().includes(this.activeFilters.search);

    // Return true if the user matches all filters
    return statusMatch && roleMatch && searchMatch;
  });
  // Update the data source with the filtered data
  this.dataSource.data = filteredData;
}












}

