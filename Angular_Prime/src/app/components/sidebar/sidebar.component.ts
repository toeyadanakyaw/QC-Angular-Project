import { Component, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { WebsocketService } from '../../services/websocket.service';
import { AuthService } from '../../services/auth.service';
import { Observable, throwError } from 'rxjs';
import { UserData } from '../../models/userdata';
import { HttpClient } from '@angular/common/http';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements AfterViewInit {
  showSidebar: boolean = true;
  userProfilePhotoUrl: string = 'https://via.placeholder.com/40';

  constructor(
    private http:HttpClient,
    private primengConfig: PrimeNGConfig,
    private router: Router,
    private elRef: ElementRef,
    private renderer: Renderer2,
    private websocket:WebsocketService,
    public authService: AuthService,
    private profilePhotoService: ProfileService
  ) { }

  ngOnInit() {
    this.primengConfig.zIndex = {
      modal: 1100,
      overlay: 1000,
      menu: 1000,
      tooltip: 1100
    };

    this.router.events.subscribe(() => {
      this.showSidebar = !['/login', '/register', '/forget-password', '/otp'].includes(this.router.url);
    });

    this.loadProfile().subscribe(
      (data) => {
        this.userProfilePhotoUrl = data.photoUrl || this.userProfilePhotoUrl;
      },
      (error) => {
        console.error('Failed to load user profile:', error);
      }
    );

    this.profilePhotoService.currentProfilePhotoUrl.subscribe(url => {
      this.userProfilePhotoUrl = url;
    });
    
  }
  

  ngAfterViewInit() {
    this.setupSidebarToggle();
  }

  private setupSidebarToggle() {
    console.log('Setting up sidebar toggle'); // Debugging line
    const sidebarToggle = this.elRef.nativeElement.querySelector('#sidebarToggle');
    const sidebar = this.elRef.nativeElement.querySelector('#sidebar');
    const content = this.elRef.nativeElement.querySelector('#content');

    if (sidebarToggle && sidebar && content) {
      this.renderer.listen(sidebarToggle, 'click', () => {
        sidebar.classList.toggle('d-none');
        content.classList.toggle('full-width');
        console.log("hello sidebar ts is work!!")
      });
    } else {
      console.error('Element(s) not found');
    }
  }

  getUserId(): string | null {
    return this.authService.getUserId();
  }

  loadProfile(): Observable<UserData> {
    const id = this.getUserId();

    if (id) {
      return this.http.get<UserData>(`http://localhost:8080/api/profile/${id}`);
    } else {
      console.error("User ID is not available.");
      return throwError(() => new Error("User ID is not available."));
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
