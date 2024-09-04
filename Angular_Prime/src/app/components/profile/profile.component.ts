import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserData } from '../../models/userdata';
import { map, Observable, throwError } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { EditUserData } from '../../models/edituser';
import { ProfileService } from '../../services/profile.service';
import { response } from 'express';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  photoUrl: string = 'https://bootdey.com/img/Content/avatar/avatar7.png';
  defaultPhotoUrl: string = 'https://bootdey.com/img/Content/avatar/avatar7.png';
  showOptions: boolean = false;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  userData: UserData | null = null;
  editUserData?: EditUserData;
  editMode: boolean = false;
  originalData: UserData | null = null; // To store the original data for cancel
  userName?: string;
  userEmail?: string;
  userPhNumber?: string;
  newPhotoUrl?: string;

  

  constructor(private http: HttpClient, private auth: AuthService, private cd: ChangeDetectorRef, private profileService: ProfileService) {
    // this.photoUrl = this.profileService.getCurrentPhotoUrl();
   }

  onPhotoClick(): void {
    this.showOptions = !this.showOptions;
  }

  addPhoto(): void {
    this.photoUrl = 'https://example.com/new-photo.jpg';
    this.showOptions = false;
  }

  changePhoto(): void {
    this.photoUrl = 'https://example.com/changed-photo.jpg';
    this.showOptions = false;
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  getUserId(): string | null {
    return this.auth.getUserId();
  }
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('file', file);
      const userId = this.getUserId();
  
      if (userId) {
        formData.append('userId', userId);
        formData.append('upload_preset', 'your-upload-preset');
  
        this.http.put<{ url: string }>('http://localhost:8080/api/upload-profile-photo', formData).subscribe(
          (response) => {
            console.log("Photo upload successful", response);
            
            // Update the photoUrl with the new URL
            this.photoUrl = response.url;
            // this.profileService.updateProfilePhotoUrl(response.url); // Emit the new URL
  
            // Trigger change detection to update the view
            // this.cd.detectChanges();
  
            // Optionally, you can also update the userData object if you want the new URL to be reflected there too
            if (this.userData) {
              this.userData.photoUrl = response.url;
            }
  
            // Hide options after changing the photo
            this.showOptions = false;

            this.photoUrl = response.url;
            this.profileService.updateProfilePhotoUrl(response.url);
            this.cd.detectChanges();
          },
          (error) => {
            console.error('Upload failed:', error);
          }
        );
      } else {
        console.error('User ID is not available.');
      }
    }
  }
  

  clearPhoto(): void {
    const id = this.getUserId();
  
    if (id) {
      this.http.delete(`http://localhost:8080/api/profile/photo/${id}`).subscribe(
        () => {
          this.photoUrl = this.defaultPhotoUrl;  // Update to default photo
          this.profileService.updateProfilePhotoUrl(this.defaultPhotoUrl); // Notify the service about the change
          if (this.userData) {
            this.userData.photoUrl = this.defaultPhotoUrl;  // Clear photoUrl in userData
          }
          this.showOptions = false;
        },
        (error) => {
          console.error('Failed to clear photo:', error);
        }
      );
    } else {
      console.error('User ID is not available.');
    }
  }
  

  loadProfile(): Observable<UserData> {
    const id = this.getUserId();

    if (id) {
      return this.http.get<UserData>(`http://localhost:8080/api/profile/${id}`).pipe(
        map(userData => {
          if(!userData.photoUrl){
              userData.photoUrl = this.defaultPhotoUrl;
          }
          return userData;
        })
      );
    } else {
      console.error("User ID is not available.");
      return throwError(() => new Error("User ID is not available."));
    }
  }

  ngOnInit(): void {
    this.loadProfile().subscribe(
      data => {
        this.userData = data;
        this.userName = this.userData.name || '';
        this.photoUrl = this.userData.photoUrl || this.defaultPhotoUrl;
      },
      error => {
        console.error("Failed to load profile", error);
      }
    );
  }

  
  toggleEditMode() {
    if (this.editMode) {
      if(this.userData){
        this.userData.name = this.userName || '';
        this.userData.email = this.userEmail || '';
        this.userData.ph_number = this.userPhNumber || '';
        this.profileService.updateUserProfile(this.userData).subscribe(response => {
          this.editMode = false;
        });
      }
    } else {
       // Store a deep copy of the original data before editing
       if (this.userData) {
        this.originalData = { 
          id: this.userData.id,
          name: this.userData.name, 
          email: this.userData.email, 
          ph_number: this.userData.ph_number,
          role: this.userData.role,
          registration_code: this.userData.registration_code, 
          photoUrl: this.userData.photoUrl,
          company: this.userData.company,
          department: this.userData.department,
          staff_id: this.userData.staff_id,
          position: this.userData.position
        };
        this.userName = this.userData.name;
        this.userEmail = this.userData.email;
        this.userPhNumber = this.userData.ph_number;
      }
      this.editMode = true;
    }
  }

  cancelEdit() {
    if (this.userData && this.originalData) {
      this.userData = JSON.parse(JSON.stringify(this.originalData)); // Revert to original data
      this.userName = this.userData?.name || '';
      this.userEmail = this.userData?.email || '';
      this.userPhNumber = this.userData?.ph_number || '';
      this.photoUrl = this.userData?.photoUrl || this.defaultPhotoUrl; // Revert photo URL
    }
    this.editMode = false;
  }

}
