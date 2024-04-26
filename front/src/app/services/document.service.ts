import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private DOCUMENT_ENDPOINT:string = 'http://localhost:8080/api/documents';

  constructor(private http:HttpClient) { }

  
  createDocument(formData: FormData): Observable<any> {
   
    return this.http.post<any>(`${this.DOCUMENT_ENDPOINT}/create`, formData);
  }

  downloadDocument(documentId: number): Observable<Blob> {
    return this.http.get(`${this.DOCUMENT_ENDPOINT}/download/${documentId}`, { responseType: 'blob' });
  }
}