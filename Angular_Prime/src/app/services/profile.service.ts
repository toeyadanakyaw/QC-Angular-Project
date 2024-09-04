import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EditUserData } from '../models/edituser';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private profilePhotoUrl = new BehaviorSubject<string>('https://bootdey.com/img/Content/avatar/avatar7.png');
  currentProfilePhotoUrl = this.profilePhotoUrl.asObservable();
  private baseUrl = 'http://localhost:8080/api/profile';
  

  constructor(private http: HttpClient) { }

  updateUserProfile(updatedData?: EditUserData) {
    return this.http.put(`${this.baseUrl}/${updatedData?.id}`, updatedData);
}

  updateProfilePhotoUrl(url: string){
    this.profilePhotoUrl.next(url);
  }

}
