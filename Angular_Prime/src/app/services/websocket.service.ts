import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private client: Client;
  private notificationSubject = new Subject<any>();

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'), // Use SockJS correctly
      connectHeaders: {
        // Add any headers if needed
      },
      debug: (str) => {
        console.log('STOMP: ' + str);
      },
      reconnectDelay: 5000
    });

    this.client.onConnect = (frame) => {
      console.log('Connected to WebSocket');
    };

    this.client.activate();
  }

  connect(userId: number): void {
    this.client.onConnect = () => {
      this.client.subscribe(`/topic/notifications/${userId}`, (message: Message) => {
        this.notificationSubject.next(JSON.parse(message.body));
      });
    };
  }

  getNotifications(userId: number): Observable<any> {
    this.connect(userId);
    return this.notificationSubject.asObservable();
  }
}