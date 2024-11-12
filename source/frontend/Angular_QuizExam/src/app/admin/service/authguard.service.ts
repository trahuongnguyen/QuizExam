import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user = this.authService.userLogged;
    const roles = route.data["roles"] as Array<String>;
    if (user!=null) {
      let role = localStorage.getItem(this.authService.roleKey);
      // logged in so return true
      if(roles.includes(role!)){
        return true;
      }
      this.router.navigate(['admin']);
      return false;
    }
    // not logged in so redirect to login page with the return url
    this.router.navigate(['admin/login']);
    return false;
  }
}
