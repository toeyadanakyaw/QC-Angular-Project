import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserData } from '../models/userdata';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private baseUrl = 'http://localhost:8080/api/search';

  constructor(private http: HttpClient) { }

  searchUsers(query: string): Observable<UserData[]>{
    let url = this.baseUrl + "/byName";
    let params = new HttpParams();
    if (query){
      params = params.set('query', query);
    } 
    return this.http.get<UserData[]>(url, {params});
  }
}
