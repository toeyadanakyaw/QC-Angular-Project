import { Injectable } from '@angular/core';
import { of, delay } from 'rxjs';

// Define a sample staff interface (adjust fields as necessary)
export interface Staff {
  id: number;
  name: string;
  email: string;
  position: string;
  company: string;
  department: string;
}

@Injectable({
  providedIn: 'root'
})
export class StaffserviceService {

  // Sample staff data (replace with actual data source or API call)
  private staffList: Staff[] = [
    { id: 1, name: 'Mark', email: 'mark@example.com', position: 'Developer', company: 'Otto', department: 'Engineering' },
    { id: 2, name: 'Jacob', email: 'jacob@example.com', position: 'Manager', company: 'Thornton', department: 'Sales' },
    { id: 3, name: 'Larry', email: 'larry@example.com', position: 'Analyst', company: 'Bird', department: 'Marketing' }
  ];

  constructor() { }

  getStaffList() {
    // Simulating an API call with a delay
    return of(this.staffList).pipe(delay(1000));
  }
}
