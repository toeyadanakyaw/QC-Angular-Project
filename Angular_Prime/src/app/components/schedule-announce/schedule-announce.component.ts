import { Component, AfterViewInit, Inject, PLATFORM_ID, ViewChild, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-schedule-announce',
  templateUrl: './schedule-announce.component.html',
  styleUrls: ['./schedule-announce.component.css']
})
export class ScheduleAnnounceComponent implements AfterViewInit {

  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('filePreview') filePreview!: ElementRef;

  selectedPositions: string[] = [''];
  showUserSelection: boolean = false;  // Toggle for user selection display
  selectedUsers: string[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

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
      this.showUserSelection = true; // Show user selection when "one-by-one" is selected
    } else {
      this.showUserSelection = false; // Hide user selection otherwise
    }
  }

  onUserSelectChange(user: string): void {
    if (!this.selectedUsers.includes(user)) {
      this.selectedUsers.push(user); // Add the selected user to the array
    }
  }

  removeSelectedUser(index: number): void {
    this.selectedUsers.splice(index, 1); // Remove the user from the array by index
  }
}
