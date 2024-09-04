import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { Staff, StaffserviceService } from '../../services/staffservice.service'; // Adjust import path as needed

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.css']
})
export class StaffListComponent implements OnInit {
  staff!: Staff[];
  loading: boolean = true;

  constructor(private staffService: StaffserviceService) {}

  ngOnInit() {
    this.staffService.getStaffList().subscribe(
      (staff) => {
        this.staff = staff;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching staff list', error);
        this.loading = false;
      }
    );
  }

  onGlobalFilter(event: Event, dt: Table) {
    const input = event.target as HTMLInputElement;
    if (input) {
      dt.filterGlobal(input.value, 'contains');
    }
  }

  clear(table: Table) {
    table.clear();
  }
}
