import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DocumentService } from 'src/app/services/document.service';

@Component({
  selector: 'app-validationspopup',
  templateUrl: './validationspopup.component.html',
  styleUrls: ['./validationspopup.component.css']
})
export class ValidationspopupComponent implements OnInit {

  validationDetails:any=[]

  constructor(private documentService:DocumentService,
    private dialogref: MatDialogRef<ValidationspopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any){}

  ngOnInit(): void {
   /*  this.documentService.getDocumentValidationDetails(this.data.documentId).subscribe({
      next:(res:any)=>{
        console.log("details res",res)
        this.validationDetails=res
      },
      error:err=>console.error(err)
    }) */

    this.validationDetails=this.data.validations

    
  }

}
