import { Component } from '@angular/core';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent {
  
  comments:any=["Comment1","Comment2","Comment3"]

  newComment: string = '';

  addComment(){
    if(this.newComment){
      this.comments.push(this.newComment)
      this.newComment=""
    }

  }

  validateDocument(){

  }

  openDocument(){

  }
}
