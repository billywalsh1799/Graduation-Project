import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private DOCUMENT_ENDPOINT:string = 'http://localhost:8080/api/documents';

  constructor(private http:HttpClient) { }

  
  /* createDocument(formData: FormData): Observable<any> {
   
    return this.http.post<any>(`${this.DOCUMENT_ENDPOINT}/create`, formData);
  } */
  createDocument(file: File, reviewerEmails: string[], creatorEmail: string,type:string,note:string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('creatorEmail', creatorEmail);
    formData.append('type',type)
    formData.append('note',note)
    reviewerEmails.forEach(email => formData.append('reviewerEmails', email));

    return this.http.post<any>(`${this.DOCUMENT_ENDPOINT}/create`, formData);
  }

  downloadDocument(documentId: number): Observable<Blob> {
    return this.http.get(`${this.DOCUMENT_ENDPOINT}/download/${documentId}`, { responseType: 'blob' });
  }

  getAllCommentsForDocument(documentId:number){
    return this.http.get(this.DOCUMENT_ENDPOINT+"/"+documentId+"/comments")
  }

  addCommentToDocument(id:number,request:any){
    return this.http.post(this.DOCUMENT_ENDPOINT+"/"+id+"/comment",request)

  }

  getDocument(id:number){
    return this.http.get(this.DOCUMENT_ENDPOINT+"/document/"+id)
  }

  getDocumentValidationStatus(request:any){
    return this.http.post(this.DOCUMENT_ENDPOINT+"/document/validation-status",request)
  }

  getDocumentPdf(id:number){
    return this.http.get(`http://localhost:8080/api/documents/${id}/pdf`, { responseType: 'blob' })
  }

  validateDocument(id:number,reviewerId:number){
    return this.http.post(`http://localhost:8080/api/documents/${id}/validate`,{documentId:id,reviewerId})

  }

  getDocumentsForCreator(id:number){
    return this.http.get(`http://localhost:8080/api/documents/creator/${id}`)
  }

  getDocumentValidationDetails(id:number){
    return this.http.get(`http://localhost:8080/api/documents/validations/${id}`)
    
  }

  getDocumentsForReviewer(id:number){
    return this.http.get(`http://localhost:8080/api/documents/reviewer/${id}`)
  }
}
