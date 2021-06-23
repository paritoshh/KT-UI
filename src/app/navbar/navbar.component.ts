import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile/profile.service';
import { AuthorizationService } from '../shared/authorization.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  username: string;

  constructor(private auth: AuthorizationService,
    private profileService: ProfileService) { }

  ngOnInit(): void {

    this.username = this.auth.getAuthenticatedUser();


    this.profileService.retrieveProfile(this.username)
      .subscribe(
        data => {
          this.username = data.firstName + " " + data.lastName;
        }
      );

  }

}
