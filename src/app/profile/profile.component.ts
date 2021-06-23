import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../shared/authorization.service';
import { Profile } from './profile.model';
import { ProfileService } from './profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  title = 'appBootstrap';

  profile: Profile;
  loggedInEmail: string;
  yearsOfExperience: string;
  monthsOfExperience: string;
  isProfileUpdateStatus: boolean;
  profileUpdateStatusMessage: string;


  constructor(private profileService: ProfileService, private auth: AuthorizationService,
    private _router: Router) { }

  ngOnInit(): void {

    //fetching existing profile details
    this.loggedInEmail = this.auth.getAuthenticatedUser();
    console.log("User details loggedInEmail:: " + this.loggedInEmail);
    this.profileService.retrieveProfile(this.loggedInEmail)
      .subscribe(
        data => {
          console.log("data:: " + data);
          this.profile = data;

          var exp = this.profile.experience.toString().split(".", 2);
          this.yearsOfExperience = exp[0];
          this.monthsOfExperience = exp[1];
        }
      );
  }


  updateProfile() {
    this.profile.experience = +(this.yearsOfExperience + "." + this.monthsOfExperience);
    this.profileService.updateProfile(this.profile, this.loggedInEmail)
      .subscribe(
        data => {
          this.isProfileUpdateStatus = true;
          this.profileUpdateStatusMessage = "Profile updated successfully.";

        }
      );
  }

}
