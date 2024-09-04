import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const expectedRole = next.data['expectedRole'];
    const userRole = this.authService.getUserRole();
    console.log("User Role", userRole);
    if (this.authService.isLoggedIn() && (!expectedRole || expectedRole.includes(userRole))) { // Call the method
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
