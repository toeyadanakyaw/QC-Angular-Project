import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { User } from '../models/user';
import { CookieService } from './cookie.service';
import { map, Observable } from 'rxjs';
import { AuthenticationResponse } from '../models/authicatation';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { UserData } from '../models/userdata';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/user';

  constructor( private router:Router, private http: HttpClient, private cookieService: CookieService , @Inject(PLATFORM_ID) private platformId: Object) { }

  register(user: User): Observable<AuthenticationResponse>{
    let url = this.baseUrl + "/register";
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<AuthenticationResponse>(url,user, {headers});
  }

  // login(user: User): Observable<AuthenticationResponse>{
  //   let url = this.baseUrl + "/login"; 
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //   return this.http.post<AuthenticationResponse>(url,user, {headers, withCredentials: true});
  // }

  // setUserData(userData: any): void {
  //   this.cookieService.setUserData(userData);
  // }
  authenticate(user: any): Observable<AuthenticationResponse> {
    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json' 
    });
    return this.http.post<AuthenticationResponse>(`${this.baseUrl}/login`, user, { headers })
      .pipe(
        map(response => {
          if (response.token) {
            // Save the token in local storage
            localStorage.setItem('authToken', response.token);
          }
          return response;
        })
      );
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  getLoginUserData(): UserData | null{
    const token = this.getToken();
    if (!token) {
      return null;
    }
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  }

  getCompanyId(): number | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.companyId;
  }

  getDepartmentId(): number | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.departmentId;
  }

  getPosition(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.position;
  }

  getUserId(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('authToken');
      return user !== null;
    }
    return false;
  }

  isMainHr(): boolean {
    return this.getUserRole() === 'MAIN_HR';
  }

  isSubHr(): boolean {
    return this.getUserRole() === 'SUB_HR'
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }
}
