// src/app/components/schedule-announce/schedule-announce.component.ts

import { Component, AfterViewInit, OnInit, Inject, PLATFORM_ID, ViewChild, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../../models/user';
import { RequestAnnounce, Status } from '../../models/requestAnnounce'; // Ensure Status enum is imported
import { RequestAnnounceService } from '../../services/request-announce.service';
import { Role } from '../../models/user'; // Assuming Role enum is imported from this location

@Component({
  selector: 'app-schedule-announce',
  templateUrl: './schedule-announce.component.html',
  styleUrls: ['./schedule-announce.component.css']
})
export class ScheduleAnnounceComponent implements AfterViewInit {
  user: User = {
    name: '',
    email: '',
    password: '',
    role: Role.USER, 
    confirmPassword:''
  };
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('filePreview') filePreview!: ElementRef;

  selectedPositions: string[] = [''];
  showUserSelection: boolean = false;
  selectedUsers: string[] = [];
  quillEditorContent: string = '';  // Store content from Quill editor
  attachedFile?: File;  // Store the attached file
  companies = [
    { id: 1, name: 'Company A' },
    { id: 2, name: 'Company B' },
    { id: 3, name: 'Company C' },
    { id: 3, name: 'Company C' }
,    { id: 3, name: 'Company C' },


  ];

  departments = [
    { id: 1, name: 'HR' },
    { id: 2, name: 'IT' },
    { id: 3, name: 'Sales' }
  ];

  positions = [
    { id: 1, name: 'Manager' },
    { id: 2, name: 'Engineer' },
    { id: 3, name: 'Technician' }
  ];

  // Variables to hold selected items
  selectedCompany: any = null;
  selectedDepartment: any = null;
  selectedPosition: any = null;
Role: any;

  // Method to handle company selection
  onCompanySelect(company: any) {
    this.selectedCompany = company;
  }

  // Method to handle department selection
  onDepartmentSelect(department: any) {
    this.selectedDepartment = department;
  }

  // Method to handle position selection
  onPositionSelect(position: any) {
    this.selectedPosition = position;
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private requestAnnounceService: RequestAnnounceService // Inject the service
  ) {}

  // ngOnInit() {
  //   this.user.role = 'USER'; // Example assignment
  // }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeQuillEditor();
      this.initializeSquareBoxClick();
    }
  }

  private initializeQuillEditor(): void {
    import('quill').then((QuillModule) => {
      const Quill = QuillModule.default;
      const quill = new Quill('#announcementEditor', {
        theme: 'snow',
        placeholder: 'Write your announcement here...',
        modules: {
          toolbar: [
            [{ 'font': [] }, { 'size': [] }],
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['link', 'image', 'video'],
            ['clean']
          ]
        }
      });
      quill.on('text-change', () => {
        this.quillEditorContent = quill.root.innerHTML;  // Get the content of the editor
      });
    }).catch(err => {
      console.error('Failed to load Quill:', err);
    });
  }

  private initializeSquareBoxClick(): void {
    const boxes = document.querySelectorAll('.square-box');
    boxes.forEach(box => {
      box.addEventListener('click', () => {
        if (box.classList.contains('selected')) {
          box.classList.remove('selected');
        } else {
          box.classList.add('selected');
        }
      });
    });
  }

  // Handle file input and preview the selected file
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.attachedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const previewElement = this.filePreview.nativeElement;
        previewElement.innerHTML = `<img src="${e.target.result}" class="img-thumbnail" alt="Selected File" />`;
      };
      reader.readAsDataURL(file);
    }
  }

  onPositionSelectChange(selectedPosition: string): void {
    if (selectedPosition === 'one-by-one') {
      this.showUserSelection = true;
    } else {
      this.showUserSelection = false;
    }
  }

  onUserSelectChange(user: string): void {
    if (!this.selectedUsers.includes(user)) {
      this.selectedUsers.push(user);
    }
  }

  removeSelectedUser(index: number): void {
    this.selectedUsers.splice(index, 1);
  }

  // Method to submit the request
  submitRequest(): void {
    let content = this.quillEditorContent;
    content = content.replace(/<p[^>]*>/g, '').replace(/<\/p>/g, ''); // Clean <p> tags
  
    // Additional cleanup if needed:
    content = content.replace(/<br>/g, ''); // Remove <br> tags
  // Remove closing </p> tags

    const request: RequestAnnounce = {
      title: (document.getElementById('announcementTitle') as HTMLInputElement).value,
      content: this.quillEditorContent,
      company: this.selectedCompany?.name || 'Default Company', // Use selected company or default
      department: this.selectedDepartment?.name || 'Default Department', // Use selected department or default
      positions: this.selectedPositions,
      scheduleDate: (document.getElementById('scheduleDate') as HTMLInputElement).value,
      scheduleHour: (document.getElementById('scheduleHour') as HTMLInputElement).value,
      attachedFile: this.attachedFile,
      selectedUsers: this.showUserSelection ? this.selectedUsers : undefined,
      cloudUrl: '', // Provide actual value if necessary
      fileExtension: '', // Provide actual value if necessary
      publicId: '', // Provide actual value if necessary
      resourceType: '', // Provide actual value if necessary
      status: Status.PENDING // Provide default status or set dynamically
      ,
      id: 0
    };

    this.requestAnnounceService.sendRequest(request).subscribe({
      next: (response) => {
        console.log('Announcement request sent successfully:', response);
      },
      error: (err) => {
        console.error('Error sending announcement request:', err);
      }
    });
  }
}
