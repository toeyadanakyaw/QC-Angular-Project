import { Component, ViewEncapsulation } from '@angular/core';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { response } from 'express';
import { AuthenticationResponse } from '../../models/authicatation';
import { error } from 'console';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  user: User = { name: '', email: '', password: '', confirmPassword: ''};
  registrationResponse: string | undefined;

  constructor(private authService: AuthService, private router: Router) {}

  // Make sure this method is defined correctly
  onSubmit(): void {
    console.log("confirmPassword", this.user.confirmPassword);
    console.log("UserPassword", this.user.password);

    if(this.user.password !== this.user.confirmPassword){
      this.registrationResponse = "Password do not match";
      return;
    }
    this.authService.register(this.user).subscribe({
      next: (response: AuthenticationResponse) => {
        this.registrationResponse = response.message;
        console.log('Registration successful:', response);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        // Log detailed error info to help debug
        console.error('Error object:', error);
        console.log('Error status:', error.status);  
        console.log('Error message:', error.message);
        console.log('Full error:', error);  // Log the full error object
  
        // Use error status for more customized error handling
        if (error.status === 403) {
          this.registrationResponse = "Access denied: You don't have permission to register.";
        } else {
          this.registrationResponse = error.error?.message || 'An unknown error occurred.';
        }
      }
    });
  }
  
  
}