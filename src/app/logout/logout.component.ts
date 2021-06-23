import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../profile/profile.service';
import { AuthorizationService } from '../shared/authorization.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private authenticationService: AuthorizationService,
    private _router: Router,
    private profileService: ProfileService) { }

  ngOnInit(): void {

    this.profileService.cache = {};
    this.authenticationService.logOut();
    this._router.navigate(['/login']);
  }

}
