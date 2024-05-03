import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-reviewerpage',
  templateUrl: './reviewerpage.component.html',
  styleUrls: ['./reviewerpage.component.css']
})
export class ReviewerpageComponent implements AfterViewInit {

  documentList:any=[
    {document:"document.pdf",validated:"false",createdAt:"1-05-2024"},
    {document:"document.pdf",validated:"false",createdAt:"1-05-2024"},
    {document:"document.pdf",validated:"false",createdAt:"1-05-2024"},
    {document:"document.pdf",validated:"false",createdAt:"1-05-2024"},
    {document:"document.pdf",validated:"false",createdAt:"1-05-2024"},
    {document:"document.pdf",validated:"false",createdAt:"1-05-2024"},
    {document:"document.pdf",validated:"false",createdAt:"1-05-2024"},
    {document:"document.pdf",validated:"false",createdAt:"1-05-2024"},
    {document:"document.pdf",validated:"false",createdAt:"1-05-2024"},
    {document:"document.pdf",validated:"false",createdAt:"1-05-2024"},
    {document:"document.pdf",validated:"false",createdAt:"1-05-2024"},
    {document:"document.pdf",validated:"false",createdAt:"1-05-2024"},
    {document:"document.pdf",validated:"false",createdAt:"1-05-2024"},
    
  ]
  displayedColumns: string[] = ['document','validated','createdAt'];
  dataSource = new MatTableDataSource<any>(this.documentList);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(){
    
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


}
