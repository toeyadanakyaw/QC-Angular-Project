import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { WebsocketService } from '../services/websocket.service';
import { AuthService } from '../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];
  unreadCount: number = 0;
  userId: number | null = null;

  constructor(private websocket: WebsocketService, private auth: AuthService, private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.userId = this.auth.getUserId();
    if (this.userId) {
      this.loadUnseenNotifications(this.userId);
      this.subscribeToRealtimeNotifications(this.userId);
    }
  }

  loadUnseenNotifications(userId: number) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth.getToken()}`);
    this.http.get<any[]>(`http://localhost:8080/api/announcements/unseen/${userId}`, { headers })
      .subscribe({
        next: (notifications) => {
          this.notifications = notifications;
          this.unreadCount = notifications.length;
          this.updateBadge();
        },
        error: (err) => console.error('Error loading unseen notifications:', err)
      });
  }

  subscribeToRealtimeNotifications(userId: number) {
    this.websocket.getNotifications(userId).subscribe({
      next: (notification) => {
        this.notifications.unshift(notification);
        this.unreadCount++;
        this.updateBadge();
        this.cdr.detectChanges(); // Ensure change detection is triggered
      },
      error: (err) => console.error('Error receiving notification:', err)
    });
  }

  markAsSeen(notificationId: number) {
    this.http.put(`http://localhost:8080/api/announcements/mark-seen/${this.userId}`, { id: notificationId })
      .subscribe({
        next: () => {
          this.notifications = this.notifications.filter(n => n.id !== notificationId);
          this.unreadCount = this.notifications.length;
          this.updateBadge();
        },
        error: (err) => console.error('Error marking notification as seen:', err)
      });
  }

  updateBadge(): void {
    const badgeElement = document.getElementById('notification-badge');
    if (badgeElement) {
      badgeElement.textContent = this.unreadCount > 0 ? this.unreadCount.toString() : '';
    }
  }
}