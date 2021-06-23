import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { API_URL } from '../app.constants';
import { Profile } from './profile.model';
import { map } from 'rxjs/operators';
import { AuthorizationService } from '../shared/authorization.service';
import { RegisterSessionProfile } from './register-session-profile.model';
import { of } from 'rxjs';
import { UpdateProfileResponse } from './updateProfileResponse.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService implements OnInit {

  cache = {};


  private profileWithDefaultValues: Profile;
  private profile: Profile;

  constructor(private http: HttpClient, private auth: AuthorizationService) { }
  ngOnInit(): void {
  }


  updateProfile(profile: Profile, email: string) {

    console.log("profile data" + profile);
    return this.http
      .put<UpdateProfileResponse>(`${API_URL}/profiles/${email}`,
        profile)
      .pipe(map(response => {
        this.cache[email] = response.profile;
        return response;
      }));
  }

  retrieveProfile(email: string) {
    console.log("Email id in request:: " + email);

    if (this.cache[email]) {
      console.log('Returning cached value!')
      return of(this.cache[email])
    }

    return this.http.get<Profile>(`${API_URL}/profiles/${email}`)
      .pipe(map(rD => {
        this.cache[email] = rD;
        if (rD == null) {
          this.profileWithDefaultValues = {
            firstName: "",
            lastName: "",
            location: "",
            country: "",
            dob: "",
            skills: [],
            interestedSkills: [],
            experience: 0,
            email: "",
            learningPoints: 0,
            registeredSessions: [],
            hostedSessions: [],
            requestedSessions: []
          };
          return this.profileWithDefaultValues;
        }
        return rD;
      }));
  }

  registerUnregisterSession(profile: RegisterSessionProfile, email: string) {
    return this.http
      .put(`${API_URL}/profiles/${email}/updateRegisterSessions`,
        profile);
  }

  setProfile(profile: Profile) {
    this.profile = profile;

  }
  getProfile() {
    return this.profile;
  }
}
