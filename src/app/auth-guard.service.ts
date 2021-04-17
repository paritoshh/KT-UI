import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivateChild
} from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthorizationService } from './shared/authorization.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthorizationService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    if (this.authService.isLoggedIn()) {
      return true;
    }
    this.router.navigate(['login']);
    return false;
  }

  // canActivateChild(route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot) {
  //   return this.canActivate(route, state);
  // }
}
