import { Component, OnInit } from '@angular/core';
import { UserimportService } from '../../services/userimport.service';
import { GrouplistService } from '../../services/grouplist.service';
import { UserData } from '../../models/userdata';
import { SearchService } from '../../services/search.service';
import * as XLSX from 'xlsx';
import autoTable, { autoTable as jsPDFAutoTable } from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { AuthService } from '../../services/auth.service';
import { tick } from '@angular/core/testing';

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrl: './staff-list.component.css'
})
export class StaffListComponent implements OnInit {
  selectedFile?: File;
  uploadStatus: string = '';
  users: UserData[] = [];
  errorMessage: string = '';
  searchQuery: string = '';
  filteredUsers: UserData[] = [];
  userRole: string | null = null;

  constructor(private useImportService: UserimportService,
              private userList: GrouplistService,
              private search: SearchService,
              private authService: AuthService) { }

              ngOnInit(): void {
                this.loadUser(); 
                this.searchUser(); 
                this.userRole = this.authService.getUserRole();
              }
            
              loadUser(): void{
                this.userList.getAllUsers().subscribe({
                  next: (data) => {
                   this.users = data;
                   console.log("userList:", this.users)
                   this.filterUsers();
                  },
                  error: (error) => {
                    this.errorMessage = error.message;
                  }
                });
              }

              filterUsers(): void {
                const currentUserRole = this.authService.getUserRole();
                const currentCompanyId = this.authService.getCompanyId();
                const currentDepartmentId = this.authService.getDepartmentId();
                const position = this.authService.getPosition();
                
                if (currentUserRole === 'SUB_HR' && currentCompanyId !== null) {
                  this.filteredUsers = this.users.filter(user => user.company.id === currentCompanyId);
                } else if(currentUserRole === 'MANAGEMENT'){
                  if (position === 'CEO'){
                    this.filteredUsers = this.users;
                  } else if (currentCompanyId !== null && currentDepartmentId !== null){
                    this.filteredUsers = this.users.filter(user => user.company.id === currentCompanyId && user.department.id === currentDepartmentId);
                   }                    
                } else {
                  this.filteredUsers = this.users; 
                }
              }

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadExcel(): void {
    console.log("import here")
    if(this.selectedFile){
      console.log("next import here")
      this.useImportService.uploadFile(this.selectedFile).subscribe({
        next: (response) => {
          this.uploadStatus = response;
          console.log("response :", response);
          this.loadUser(); // Reload the user list after successful upload
        },
        error: (error) => {
          this.uploadStatus = 'Failed to upload file: ';
        }
      });
    } else {
      this.uploadStatus = 'Please select a file first.';
    }
  }

  

  searchUser(): void{
    console.log("Search Query: ", this.searchQuery);  // Debugging
    this.search.searchUsers(this.searchQuery).subscribe({
      next: (data) => {
        this.users = data;
        console.log("Filtered users:", this.users);  // Debugging
        this.filterUsers();
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  onSearchChange(): void {
    this.searchUser();
  }

  // download by excel
  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.users.map(user => ({
      Name: user.name,
      Email: user.email,
      Position: user.role,
      Company: user.company.name,
      Department: user.department.name
    })));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users List')
    XLSX.writeFile(wb, 'users.xlsx');
  }

  // download by pdf
  exportToPDF(): void {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['#', 'Name', 'Email', 'Position', 'Company', 'Department']],
      body: this.users.map((user, index) => [
        index + 1,
        user.name || '',
        user.email || '',
        user.role || '',
        user.company.name || '',
        user.department.name || ''
      ])
    });
    doc.save('users.pdf');
  }
  
}


