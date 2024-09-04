import { Component } from '@angular/core';
import { GroupService } from '../../services/group.service';
import { GroupCreation } from '../../models/groupcreation';
import { UserData } from '../../models/userdata';
import { GrouplistService } from '../../services/grouplist.service';
import { Group } from '../../models/group';
import { Company } from '../../models/comapny';
import { Department } from '../../models/department';
import { error } from 'console';
import { response } from 'express';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-group-create',
  templateUrl: './group-create.component.html',
  styleUrls: ['./group-create.component.css']
})
export class GroupCreateComponent {
  //atz
  selectedStaff: string[] = [];
  selectedStaffDisplay: string = '';
  // groups: { id: string, name: string, staff: string[] }[] = [];
  selectedGroupStaff: string[] = [];
  selectedGroup: { id: string, name: string } | null = null;

  //arkar
  groupId: number = 0;
  groupName?: string;
  staffIds?: number[];
  createBy?: string;
  message?: string;
  users: UserData[] = [];
  allUsers: UserData[] = [];
  selectStaffDisplay?: string = '';
  groups?: Group[];
  collapsedGroups: Set<number> = new Set<number>();
  company?: Company[];
  // collapsedGroups: Map<number, boolean> = new Map<number, boolean>();
  collapsedCompanies: Set<number> = new Set<number>();
  collapsedDepartments: Set<number> = new Set<number>();
  userRole: string | null = null;



  constructor(private groupService: GroupService, private list: GrouplistService, private authService: AuthService) { }

  toggleDepartments(companyId: number): void {
    if(this.collapsedCompanies.has(companyId)){
      this.collapsedCompanies.delete(companyId);
    } else {
      this.collapsedCompanies.add(companyId);
      this.loadDepartment(companyId);
    }
  }
  // toggleDepartment(companyId?: number): void {
  //   if (companyId !== undefined) {
  //     if (this.collapsedDepartments.has(companyId)) {
  //       this.collapsedDepartments.delete(companyId);
  //     } else {
  //       this.collapsedDepartments.add(companyId);
  //       this.loadDepartment(companyId);
  //     }
  //   }
  // }
  

  isDepartmentCollapsed(companyId: number): boolean{
    return this.collapsedCompanies.has(companyId);
  }




  //////////////////////////////////////////////////////////////////////////////////////////////////
  // StaffSelectChange(event: Event): void {
  //   const selectElement = event.target as HTMLSelectElement;
  //   const selectedOptions = Array.from(selectElement.selectedOptions);

  //   this.staffIds = selectedOptions.map(option => parseInt(option.value, 10));
  //   this.selectStaffDisplay = selectedOptions.map(option => option.text).join(', ');
  // }

  createGroup(): void {
    console.log("Group create is here!!")
    const groupCreation: GroupCreation = {
      groupName: this.groupName,
      staffIds: this.staffIds,
      createBy: this.authService.getUserId() || undefined
    };
    console.log("Group Name:", groupCreation.groupName)
    console.log("Staff id:", groupCreation.staffIds)

    this.groupService.createGroup(groupCreation).subscribe(
      (response: Group) => {
        this.message = `Group '${response.name}' create sucessfully!`;
        this.loadGroup();
      },
      (error) => {
        this.message = 'An error occurred while creating the group.';
        console.error(error);
      }
    );
  }

  ///////////////////////////////////////////////////////////////////////////////
//   getAvailableUsers(groupId: number): any[] {
//     const group = this.groups?.find(g => g.id === groupId);
//     const groupUserIds = group ? group.users?.map(user => user.id) : [];
    
//     return this.users.filter(user => !groupUserIds?.includes(user.id));
// }

 // Filter out users that are already part of a group
 getAvailableUsers(groupId: number): UserData[] {
  const group = this.groups?.find(g => g.id === groupId);
  const groupUserIds = group ? group.users?.map(user => user.id) : [];
  return this.users.filter(user => !groupUserIds?.includes(user.id));
}


  StaffSelectedChange(event: Event): void {
    const options = (event.target as HTMLSelectElement).options;
    const selectedStaff = Array.from(options)
                              .filter(option => option.selected);

    // Clear previous selections
    this.staffIds = [];
    this.selectedStaffDisplay = '';

    selectedStaff.forEach(option => {
        const staffId = parseInt(option.value);
        const staffNameEmail = option.textContent?.trim() || '';
        
        // Store staff ID
        this.staffIds?.push(staffId);

        // Store name and email for display
        if (this.selectedStaffDisplay) {
            this.selectedStaffDisplay += ', ';
        }
        this.selectedStaffDisplay += staffNameEmail;
    });
}

  addStaff(groupId: number): void {
    if (this.staffIds && this.staffIds.length > 0) {
      this.groupService.addStaffGroup(groupId, this.staffIds).subscribe(
        (response: Group) => {
          this.message = `Staff added to group successfully!`;
          // Reload the group data to reflect the changes
          this.loadGroup();
          // Clear the selected staff
          this.staffIds = [];
          this.selectedStaffDisplay = '';
        },
        (error) => {
          this.message = 'An error occurred while adding staff to the group.';
          console.error(error);
        }
      );
    }else {
      this.message = 'Staff IDs are not provided.';
    }
  }

  

  toggleStaff(groupId?: number): void {
    if(groupId !== undefined){
      if (this.collapsedGroups.has(groupId)) {
        this.collapsedGroups.delete(groupId);
      }else{
        this.collapsedGroups.add(groupId);
      }
    } 
  }

  idGroupCollapsed(groupId: number): boolean {
    return this.collapsedGroups.has(groupId);
  }

  deleteGroup(id: number): void{
    if(confirm("Are you sure you want to delete this group?")){
      this.list.deleteGroup(id).subscribe(
        response => {
          this.message = response;
          this.loadGroup();
        },
        error => {
          this.message = 'An error occurred while deleting the group.';
          console.error(error);
        }
      )
    }
  }

  loadCompany(): void {
    this.list.getAllCompany().subscribe({
      next: (data) => {
        this.company = data;
        console.log("Company:", this.company);
      },
      error: (error) => {
        this.message = error.message;
      }
    });
  }

  loadDepartment(companyId: number): void{
   this.list.getDepartmentByCompanyId(companyId).subscribe({
    next: (department: Department[]) => {
      const comapny = this.company?.find(c => c.id === companyId);
      if(comapny){
        comapny.department = department; // Assume departments are added to the company
      }
      console.log("Comapny Department:",comapny?.department)
    // next: (departments) => {
    //   // Handle the departments data here
    //   console.log(departments);
     },
    error: (error) => {
      console.error(`Error loading departments for company ${companyId}:`, error);
    }
   });
  }

  loadUser(): void{
    this.list.getAllUsers().subscribe({
      next: (data) => {
        this.allUsers = data;
      //  this.users = data;
      this.users = [...this.allUsers];
      },
      error: (error) => {
        this.message = error.message;
      }
    });
  }

  loadGroup(): void {
    this.groupService.getGroupWithUser().subscribe({
      next: (data) => {
        this.groups = data;
        console.log("Group List",this.groups)
      },
      error: (error) => {
        this.message = error.message;
      }
    });
  }

  // Display all users when "All Company" is clicked
  displayAllUsers(): void{
    this.users = [...this.allUsers];
    this.selectStaffDisplay = '';
  }

  // Display users by specific company
  displayUsersByCompany(companyId: number):void{
    this.users = this.allUsers.filter(user => user.company.id === companyId);
    this.selectStaffDisplay = '';
  }

  // Handle selection change for the staff dropdown
  StaffSelectChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedOptions = Array.from(selectElement.selectedOptions);

    this.staffIds = selectedOptions.map(option => parseInt(option.value, 10));
    this.selectStaffDisplay = selectedOptions.map(option => option.text).join(', ');
  }

  displayUsersByDepartmentAndCompany(departmentId: number, companyId: number): void{
    this.users = this.allUsers.filter(
      user => user.department.id === departmentId && user.company.id === companyId
    );
    this.selectStaffDisplay = '';
  }


  ngOnInit(): void {
    //arkar
    this.loadCompany();
    this.loadUser();
    this.loadGroup();
    this.userRole = this.authService.getUserRole();   
  }
}
