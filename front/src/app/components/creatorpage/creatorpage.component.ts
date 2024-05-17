import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/auth.service';
import { DocumentService } from 'src/app/services/document.service';
import { ValidationspopupComponent } from '../validationspopup/validationspopup.component';

@Component({
  selector: 'app-creatorpage',
  templateUrl: './creatorpage.component.html',
  styleUrls: ['./creatorpage.component.css']
})
export class CreatorpageComponent implements AfterViewInit,OnInit {
  
  documentList:any=[]
  displayedColumns: string[] = ['document','createdAt','progress','action'];
  dataSource = new MatTableDataSource<any>(this.documentList);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private authService:AuthService,private documentService:DocumentService,private dialog:MatDialog){
    
  }

  ngOnInit() {
    const jwtInfo=this.authService.DecodeToken()
    this.documentService.getDocumentsForCreator(jwtInfo.userid).subscribe({
      next:res=>{
        console.log("reviewer documents success",res)
        this.documentList=res
        this.dataSource.data = this.documentList;
        this.dataSource.sort=this.sort;
        console.log(this.documentList,"documentlist")
      },
      error:err=>console.error("error getting reviewer documents",err)
    })
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  validationDetails(documentId:number){
    //this.dialog.open(ValidationspopupComponent)
    const popup = this.dialog.open(ValidationspopupComponent, {
      enterAnimationDuration: "200ms",
      exitAnimationDuration: "200ms",
      width: '700px',
      data:{documentId}
       
    });

  }


}
