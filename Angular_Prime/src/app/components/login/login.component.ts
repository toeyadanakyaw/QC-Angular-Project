  import { Component } from '@angular/core';
  import { Router } from '@angular/router';
  import { AlertService } from '../../services/alert.service';
  import { AuthService } from '../../services/auth.service'; // Proper import for AuthService
  import { User } from '../../models/user';
  import { AuthenticationResponse } from '../../models/authicatation';
  import { error, warn } from 'console';

  interface Alert {
    
    type: 'success' | 'error' | 'warning' | 'info' | 'confirm';
    title: string;
    message: string;
  }
  

  @Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
  })
  export class LoginComponent {
    lockDuration: number = 0;
lockTimer: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  alert: Alert | null = null;
  user: User = { name: '', email: '', password: '', confirmPassword:'' };
  loginResponse: string | undefined;

    // Inject AuthService and Router in the constructor
    constructor(
      private alertService: AlertService,
      private authService: AuthService,
      private router: Router
    ) {}

    showSuccessAlert() {
      this.alertService.showAlert('success', 'Success', 'Operation completed successfully');
    }

    showErrorAlert() {
      this.alertService.showAlert('error', 'Error', 'Something went wrong');
    }

    infoAlert() {
      this.alertService.showAlert('info', 'Info', 'Something went wrong');
    }

    warningAlert() {
      this.alertService.showAlert('warning', 'Warning', 'Something went wrong');
    }

    questionAlert() {
      this.alertService.showAlert('question', 'Question', 'sad');
    }

    // Login logic
    onSubmit(): void {
      this.authService.authenticate(this.user).subscribe(
        (response: AuthenticationResponse) => {
          this.loginResponse = response.message;
          this.showSuccessAlert();
          setTimeout(() => {
            this.router.navigate(['/dashboard']); 
          }, 1200);  
        },
        (error) => {
          console.error('Error status:', error.status);
          console.error('Error response:', error.error);
    
          const errorMessage = error?.error?.message || 'Login failed';
          if (errorMessage.includes('locked')) {
            const match = errorMessage.match(/in (\d+) minute/);
            if (match) {
              this.lockDuration = parseInt(match[1], 10);
              this.warningAlert();
              this.startLockCountdown();
            }
          } else {
            this.showErrorAlert();
          }
    
          this.loginResponse = errorMessage;
        }
      );
    }
    
    
    
    // Start the countdown timer
    startLockCountdown(): void {
      if (this.lockTimer) {
        clearInterval(this.lockTimer);

      }
    
      this.lockTimer = setInterval(() => {
        if (this.lockDuration > 0) {
          this.lockDuration--;
        } else {
          clearInterval(this.lockTimer);
        }
      }, 60000);  // Decrease by 1 minute every 60,000 milliseconds (1 minute)
    }
    
  }
