import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Profile } from '../profile/profile.model';
import { ProfileService } from '../profile/profile.service';
import { AuthorizationService } from '../shared/authorization.service';
import { SessionsService } from '../shared/sessions-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  profile: Profile;
  loggedInEmail: string;

  constructor(
    private profileService: ProfileService,
    private auth: AuthorizationService,
    private _router: Router,
    private sessionService: SessionsService

  ) { }

  ngOnInit(): void {

    var sessions = this.sessionService.getSessions();
    //Trying to reduce service call in case user has some sessions stored in cache,
    //it means it's not a first time login.
    if (sessions == undefined || sessions == null) {
      this.verifyUserDetails();
    }
  }
  verifyUserDetails() {
    //fetching existing profile details
    this.loggedInEmail = this.auth.getAuthenticatedUser();
    console.log("User details loggedInEmail:: " + this.loggedInEmail);
    this.profileService.retrieveProfile(this.loggedInEmail)
      .subscribe(
        data => {
          console.log("data:: " + data);
          this.profile = data;
          // register user profile if he has loggedin first time.
          if (this.profile.email == "") {
            this.updateProfile();
          }
          this.profileService.setProfile(data);
        }
      );
  }

  updateProfile() {
    this.profileService.updateProfile(this.profile, this.loggedInEmail)
      .subscribe(
        data => {
          console.log(data);
          this._router.navigate(['/home']);
        }
      );
  }
}
