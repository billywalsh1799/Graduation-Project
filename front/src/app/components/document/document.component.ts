import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DocumentService } from 'src/app/services/document.service';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {
  
 

  //extreact username from jwt
  documentId:any
  fileName:String=""
  comments:any
  userName:string=""
  newComment: string = '';
  isValidated:boolean=false;
  isCreator:boolean=true;

  constructor(private documentService:DocumentService,private route: ActivatedRoute,private authService:AuthService){}
  ngOnInit(){
    //this.documentService.
    //create comment dto when loading comments document gets loaded too
    //query from validation table by user and document to get the validation status too
    this.documentId = this.route.snapshot.paramMap.get('id');
    this.userName=this.authService.getUsername()
    let id=this.authService.getId()
   
    //get it from validation table
    this.documentService.getDocument(this.documentId).subscribe({
      next:(res:any)=>{
        this.isCreator=res.creator==this.userName
        if(res.creator!=this.userName){
          let request={reviewerId:id,documentId:this.documentId}
          this.documentService.getDocumentValidationStatus(request).subscribe({
            next:(response:any)=>{
              this.isValidated=response.hasValidated
            },
            error:error=>console.log("validation error",error)
          })
        }
        this.fileName=res.fileName
        this.comments=res.comments
        
      },
      error:err=>{
        console.error(err)
      }
    })

  }

  addComment(){
    if(this.newComment){
      //this.comments.push(this.newComment)
      let createdAt = new Date().toISOString();
      let comment={author:this.userName,content:this.newComment,createdAt}
      //let request={author:this.userName,content:this.newComment,createdAt}
      this.documentService.addCommentToDocument(this.documentId,comment).subscribe({
        next:res=>{
          console.log(res,"comment reponse")
          this.comments.push(comment)
        },
        error:err=>{
          console.error(err)
        }

      })
      //this.comments.push({author:"malcom",content:this.newComment,createdAt:Date.now()})
      this.newComment=""
    }

  }

  validateDocument(){
    this.documentService.validateDocument(this.documentId,this.authService.getId()).subscribe({
      next:(res:any)=>{
        //use snackbar//validation happen only once
        console.log("validation response",res)
        this.isValidated=res.validated
      },
      error:err=>{
        console.error(err)
      }
    })

  }

 
  openDocument() {
    this.documentService.getDocumentPdf(this.documentId).subscribe({
      next:response=>{
        const file = new Blob([response], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, '_blank');
      },
      error:err=>{
        console.error(err)
      }
    })
  } 
}
