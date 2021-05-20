import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthorizationService } from './shared/authorization.service';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate{

  constructor(
    private authenticationService: AuthorizationService,
    private router: Router
    ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (this.authenticationService.isUserLoggedIn())
      return true;

    this.router.navigate(['login']);

    return false;
  }
}