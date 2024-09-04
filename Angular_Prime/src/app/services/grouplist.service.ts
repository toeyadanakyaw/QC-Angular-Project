import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserData } from '../models/userdata';
import { Company } from '../models/comapny';
import { tick } from '@angular/core/testing';
import { Department } from '../models/department';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GrouplistService {
  private baseUrl = 'http://localhost:8080/api/groupFilter'; 

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAllUsers(): Observable<UserData[]>{
    const role = this.authService.getUserRole();
    const companyId = this.authService.getCompanyId();
    const departmentId = this.authService.getDepartmentId();
    const position = this.authService.getPosition();
    let url = `${this.baseUrl}/get-user?role=${role}`;

    if(role === 'SUB_HR' && companyId !== null){
      url += `&companyId=${companyId}`;
    }else if (role === 'MANAGEMENT') {
      if (position === 'CEO') {

      } else if ( companyId !== null && departmentId !== null){
      url += `&companyId=${companyId}&departmentId=${departmentId}`;
      }
    }
    return this.http.get<UserData[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  getAllCompany(): Observable<Company[]>{
    const role = this.authService.getUserRole();
    const id = this.authService.getCompanyId();
    let url = `${this.baseUrl}/company?role=${role}`;

    if(role === 'SUB_HR' && id !== null){
      url += `&id=${id}`;
    }
    return this.http.get<Company[]>(url).pipe(
      catchError(this.handleError)
    )
  }

  getDepartmentByCompanyId(companyId: number): Observable<Department[]>{
    let url = `${this.baseUrl}/department/${companyId}`;
    return this.http.get<Department[]>(url).pipe(
      catchError(this.handleError)
    )
    // return this.http.get<Department[]>(`/api/groupFilter/department/${companyId}`);
  }

  getUserByCompanyId(companyId: number): Observable<UserData[]>{
    let url = `${this.baseUrl}/get-user/${companyId}`;
    return this.http.get<UserData[]>(url).pipe(
      catchError(this.handleError)
    )
  }

  getUserByDepartmentIDAndCompanyId(departmentId: number, companyId:number): Observable<UserData[]>{
    let url = `${this.baseUrl}/get-user/department/${departmentId}/company/${companyId}`;
    return this.http.get<UserData[]>(url).pipe(
      catchError(this.handleError)
    )
  }

  deleteGroup(id: number): Observable<string>{
    let url = `${this.baseUrl}/delete/${id}`;
    return this.http.delete(url, { responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError(() => new Error('Something went wrong. Please try again later.'));
  }

}
