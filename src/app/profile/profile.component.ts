import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../shared/authorization.service';
import { Profile } from './profile.model';
import { ProfileService } from './profile.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  title = 'appBootstrap';
  
  model;

  profile: Profile;
  loggedInEmail: string;
  

  constructor(private profileService: ProfileService, private auth: AuthorizationService,
    private _router: Router) { }

  ngOnInit(): void {

        //fetching existing profile details
        this.loggedInEmail = this.auth.getAuthenticatedUser();
       // this.profile.email = this.loggedInEmail;
        console.log("User details loggedInEmail:: "+this.loggedInEmail);
        this.profileService.retrieveProfile(this.loggedInEmail)
        .subscribe(
          data=>{
            console.log("data:: "+data);
              this.profile = data;
          }
        );
  }


  updateProfile(){
    this.profileService.updateProfile(this.profile, this.loggedInEmail)
    .subscribe(
      data => {
        console.log(data);
        this._router.navigate(['/home']);
      }
    );
  }

}
