import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/auth.service';
import { DocumentService } from 'src/app/services/document.service';

@Component({
  selector: 'app-creatorpage',
  templateUrl: './creatorpage.component.html',
  styleUrls: ['./creatorpage.component.css']
})
export class CreatorpageComponent implements AfterViewInit,OnInit {
  
  /* documentList:any=[
    {document:"document.pdf",validated:"false",createdAt:"2-05-2024",progress:80},
    {document:"document.pdf",validated:"false",createdAt:"1-05-2024",progress:40},
    {document:"document.pdf",validated:"false",createdAt:"1-05-2024",progress:40},
    {document:"document.pdf",validated:"false",createdAt:"1-05-2024",progress:40},
    {document:"document.pdf",validated:"false",createdAt:"1-05-2024",progress:40},
    {document:"document.pdf",validated:"false",createdAt:"1-05-2024",progress:40},
    {document:"document.pdf",validated:"false",createdAt:"1-05-2024",progress:40},
    {document:"document.pdf",validated:"false",createdAt:"1-05-2024",progress:40},
    {document:"document.pdf",validated:"false",createdAt:"1-05-2024",progress:40},
    {document:"document.pdf",validated:"false",createdAt:"1-05-2024",progress:40},
    {document:"document.pdf",validated:"false",createdAt:"1-05-2024",progress:40},
    {document:"document.pdf",validated:"false",createdAt:"1-05-2024",progress:40},
    {document:"document.pdf",validated:"false",createdAt:"1-05-2024",progress:40},
    
  ] */

  documentList:any=[]
  displayedColumns: string[] = ['document','createdAt','progress','action'];
  dataSource = new MatTableDataSource<any>(this.documentList);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private authService:AuthService,private documentService:DocumentService){
    
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


}
