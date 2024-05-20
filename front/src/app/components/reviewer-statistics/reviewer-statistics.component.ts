import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/auth.service';
import { DocumentService } from 'src/app/services/document.service';

@Component({
  selector: 'app-reviewer-statistics',
  templateUrl: './reviewer-statistics.component.html',
  styleUrls: ['./reviewer-statistics.component.css']
})
export class ReviewerStatisticsComponent implements OnInit {
 
  reviewerStatistics:any=[]
  displayedColumns: string[] = ['statistic','total','link'];
  dataSource = new MatTableDataSource<any>(this.reviewerStatistics);

  constructor(private documentService:DocumentService,private authService:AuthService){}

  ngOnInit(): void {
    this.documentService.getReviewerStatistics(this.authService.getId()).subscribe({
      next:(res:any)=>{
        this.reviewerStatistics=[{statistic:"Assigned documents",total:res.totalAssignedDocuments},
        {statistic:"Uploaded documents",total:res.totalUploadedDocuments}]
        this.dataSource.data = this.reviewerStatistics;
        console.log("all documents res",res)

      },
      error:err=>console.error("documents error",err)
    })
  }

  getRouterLink(name:string){
    if(name=="Assigned documents")
      return '/reviewer-page'
    return '/creator-page'
  }

  

}
