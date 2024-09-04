// src/app/services/request-announce.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestAnnounce } from '../models/requestAnnounce';

@Injectable({
  providedIn: 'root'
})
export class RequestAnnounceService {

  private apiUrl = 'http://localhost:8080/api/request-announce';

  constructor(private http: HttpClient) {}

  sendRequest(request: RequestAnnounce): Observable<any> {
    const formData = new FormData();
    formData.append('requestAnnounce', new Blob([JSON.stringify(request)], { type: 'application/json' }));
  
    if (request.attachedFile) {
      formData.append('file', request.attachedFile);
    }
  
    return this.http.post<any>(`${this.apiUrl}/create`, formData);
  }
  findall():Observable<RequestAnnounce[]>{
    return this.http.get<RequestAnnounce[]>(`${this.apiUrl}/findall`);
  }

  updateStatus(id: number, status: number): Observable<any> {
    console.log('Updating status with:', { status }); // Debugging the request body
    return this.http.put(`${this.apiUrl}/update-status/${id}`, { status });
  }
  
}
