import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DocumentService } from 'src/app/services/document.service';
import { ValidationspopupComponent } from '../validationspopup/validationspopup.component';

@Component({
  selector: 'app-uploaded-documents',
  templateUrl: './uploaded-documents.component.html',
  styleUrls: ['./uploaded-documents.component.css']
})
export class UploadedDocumentsComponent implements AfterViewInit,OnInit {

  documentList:any=[]
  displayedColumns: string[] = ['document','type','createdAt','uploader','validationProgress','action'];
  dataSource = new MatTableDataSource<any>(this.documentList);

  activeFilters:any={uploader:"",reviewer:"",progress:""}

  reviewersList:string[]=[]
  uploadersList:string[]=[]

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private documentService:DocumentService,private dialog:MatDialog){}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {
    this.documentService.getAllDocuments().subscribe({
      next:res=>{
        this.documentList=res
        this.dataSource.data = this.documentList;
        this.dataSource.sort=this.sort;
        console.log("all documents res",res)

      },
      error:err=>console.error("documents error",err)
    })

    //load documents method

    this.documentService.getAllUploaders().subscribe({
      next:(res:any)=>{
        this.uploadersList=res
      },
      error:err=>console.error("error getting uploaders",err)
    })

    this.documentService.getAllReviewers().subscribe({
      next:(res:any)=>{
        this.reviewersList=res
      },
      error:err=>console.error("error getting reviewers",err)
    })


  }

  validationDetails(validations:any){
    //this.dialog.open(ValidationspopupComponent)
    const popup = this.dialog.open(ValidationspopupComponent, {
      enterAnimationDuration: "200ms",
      exitAnimationDuration: "200ms",
      width: '700px',
      data:{validations}
       
    });
  }

  applyUploaderFilter(event: any) {
    let uploader = event.value;
    this.activeFilters.uploader = uploader;
    this.applyFilters();
  }
  
  applyReviewerFilter(event: any) {
    let reviewer = event.value;
    this.activeFilters.reviewer = reviewer;
    this.applyFilters();
  }
  applyProgressFilter(event: any) {
    let progress = event.value;
    this.activeFilters.progress = progress;
    this.applyFilters();
  }
  
  applyFilters() {
  
    // Filter the userList array based on the active filters
    let filteredData = this.documentList.filter((document:any) => {
      // Check if the user matches the status filter
      const uploaderMatch = !this.activeFilters.uploader || document.uploader == this.activeFilters.uploader;
      
      //const reviewerMatch = !this.activeFilters.reviewer || document.reviewer === this.activeFilters.reviewer;
      const reviewerMatch = !this.activeFilters.reviewer || document.validations.some((validation:any)=>validation.reviewerEmail=== this.activeFilters.reviewer) ;

      const progressMatch = !this.activeFilters.progress || (this.activeFilters.progress=="above" ? 
      document.validationProgress >= 50 : this.activeFilters.progress=="below" ? document.validationProgress<50:
      document.validationProgress === 100 );
  
     
  
      
     
      // Return true if the user matches all filters
      return uploaderMatch && reviewerMatch && progressMatch;
    });
    // Update the data source with the filtered data
    this.dataSource.data = filteredData;
    }

}
