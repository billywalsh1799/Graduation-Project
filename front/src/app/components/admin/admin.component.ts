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
  displayedColumns: string[] = ['id','firstname','lastname','username', 'email', 'role', 'status','action'];
  dataSource = new MatTableDataSource<any>(this.userList);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private adminService:AdminService,private dialog:MatDialog){
    this.loadUsers()

  }

  updateuser(userInfo: any) {
    this.OpenDialog('200ms', '200ms', userInfo);
  }

  OpenDialog(enteranimation: any, exitanimation: any, userInfo: any) {
    const popup = this.dialog.open(UpdatepopupComponent, {
      enterAnimationDuration: enteranimation,
      exitAnimationDuration: exitanimation,
      width: '30%',
      data:userInfo
       
    });
    popup.afterClosed().subscribe(updatedUserData => {
      //console.log("done updated now update view",updatedUserData)
      console.log("use data",updatedUserData)
      this.adminService.updateUser(userInfo.id,updatedUserData).subscribe({
        next:res=>{
          if (updatedUserData) {
            console.log("response",res)   
            const index = this.userList.findIndex((user:any) => user.id === userInfo.id);
            if (index !== -1) {
              // Update the enabled and role fields in the user object
              //this.userList[index].enabled = updatedUserData.enabled;
              //this.userList[index].role = updatedUserData.role;
              this.userList[index]= res
            
              this.dataSource.data = this.userList;
              //this.dataSource.data = [...this.userList]; 
            }
          }

        }

        ,error:err=>{
          console.log("error updating users",err)
        }
      })
      

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
applyFilter(event: any) {
  const filterValue=event.target.value
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

// Apply filter for status
applyStatusFilter(event: any) {
  console.log('Status Filter Event:', event);
  const status = event.value;
  console.log('Selected Status:', status);
  this.dataSource.filterPredicate = (data: any, filter: string) => {
    return (status === 'Active' && data.enabled) || (status === 'Inactive' && !data.enabled);
  };
  this.dataSource.filter = status.trim().toLowerCase();
}

// Apply filter for role
applyRoleFilter(event: any) {
  const role = event.value;
  this.dataSource.filterPredicate = (data: any, filter: string) => {
    return data.role.toLowerCase().includes(filter);
  };
  this.dataSource.filter = role.trim().toLowerCase();
}












}

