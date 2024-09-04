import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GroupCreation } from '../models/groupcreation';
import { Observable } from 'rxjs';
import { Group } from '../models/group';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private baseUrl = 'http://localhost:8080/api/group'; 

  constructor(private http: HttpClient, private authService: AuthService) { }

  createGroup(groupCreation:GroupCreation): Observable<Group>{
    let url = this.baseUrl;
    return this.http.post<Group>(url, groupCreation);
  }

  addStaffGroup(groupId: number, staffIds: number[] = []): Observable<Group>{
    let url = `${this.baseUrl}/${groupId}/add-staff`;
    return this.http.post<Group>(url, staffIds);
  }

  getGroupWithUser(): Observable<Group[]> {
    const role = this.authService.getUserRole();
    const userId = this.authService.getUserId();
    let url = `${this.baseUrl}/getAllGroup?role=${role}`;

    if(role === 'SUB_HR' && userId !== null){
      url += `&userId=${userId}`;
    }
    return this.http.get<Group[]>(url);
  }
}
