import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { User } from '../models/user';
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

  // User registration
  register(user: User): Observable<AuthenticationResponse> {
    let url = `${this.baseUrl}/register`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<AuthenticationResponse>(url, user, { headers });
  }

  // User login (authenticate)
  authenticate(user: any): Observable<AuthenticationResponse> {
    const url = `${this.baseUrl}/login`; 
    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json' 
    });

    return this.http.post<AuthenticationResponse>(url, user, { headers })
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

  // Fetch token from localStorage
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

  // Extract the user role from the JWT token
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

  // Check if the user is an admin
  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  // Check if the user is logged in
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
