import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { API_URL } from '../app.constants';
import { Profile } from './profile.model';
import { map } from 'rxjs/operators';
import { AuthorizationService } from '../shared/authorization.service';
import { RegisterSessionProfile } from './register-session-profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService implements OnInit{


  private profileWithDefaultValues : Profile;
  constructor(private http: HttpClient, private auth: AuthorizationService) { }
  ngOnInit(): void {
  }


  updateProfile(profile : Profile, email: string){

    console.log("profile data"+ profile);
    return this.http
    .put(`${API_URL}/profiles/${email}`,
    profile);
  }

  retrieveProfile(email: string) {
    console.log("Email id in request:: "+email);
    return this.http.get<Profile>(`${API_URL}/profiles/${email}`)
    .pipe(map(rD=>{
      if(rD==null){
        this.profileWithDefaultValues={
          firstName: this.auth.getAuthenticatedUserName(),
          lastName: "",
          location: "",
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

  registerUnregisterSession(profile: RegisterSessionProfile, email : string){
    return this.http
    .put(`${API_URL}/profiles/${email}/updateRegisterSessions`,
    profile);
  }
}
