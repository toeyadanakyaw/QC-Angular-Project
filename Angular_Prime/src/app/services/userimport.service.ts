import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserimportService {
  private baseUrl = 'http://localhost:8080/api/excel'; // Adjust this URL to match your backend

  constructor(private http: HttpClient) { }

  uploadFile(file: File): Observable<string> {
    let url = this.baseUrl + "/upload";
    const formData = new FormData();
    formData.append('file', file)
    return this.http.post<string>(url, formData, { responseType: 'text' as 'json' });
  }
}
