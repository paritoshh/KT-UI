import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from 'src/app/profile/profile.service';
import { AuthorizationService } from 'src/app/shared/authorization.service';
import { Session } from 'src/app/shared/session.model';
import { SessionsService } from 'src/app/shared/sessions-service';

@Component({
  selector: 'app-own',
  templateUrl: './own.component.html',
  styleUrls: ['./own.component.css']
})
export class OwnComponent implements OnInit {
  registeredSessions: Session[];
  hostedSessions: Session[];
  sessions: Session[];
  loggedInEmail: string;
  registeredSessionsIds: string[];

  constructor(private sessionService: SessionsService, private route: ActivatedRoute,
    private profileService: ProfileService, private auth: AuthorizationService,
    private datepipe: DatePipe) { }

  ngOnInit(): void {
    this.loggedInEmail = this.auth.getAuthenticatedUser();

    //fetching existing profile details
    this.profileService.retrieveProfile(this.loggedInEmail)
      .subscribe(
        data => {
          console.log("data:: " + data);
          //this.profile = data;
          //this.isRegistered = data.registeredSessions.includes(this.id);
          //this.indexOfSessionWhichNeedsToBeRemoved = data.registeredSessions.indexOf(this.id);
          this.registeredSessionsIds = data.registeredSessions;
          this.populateRegisteredAndHostingSessions();
        }
      );
  }
  private populateRegisteredAndHostingSessions(){
    //fetching upcoming sessions details
    this.sessions = this.sessionService.getSessions();
    if (this.sessions == null || this.sessions == undefined) {
      this.sessionService.fetchAllSessionsDB()
        .subscribe(
          data => {
            console.log("data:: " + data.length);
            //checking a condition, if user doesn't have any registered session in his profile.
            if(this.registeredSessionsIds!=undefined || this.registeredSessionsIds!=null){
              this.registeredSessions = data.filter(s =>
                s.status.toLowerCase() === 'scheduled'
                &&
                this.registeredSessionsIds.includes(s.id)
              );
              this.registeredSessions.forEach(rSession=>
                rSession.scheduledDate = this.datepipe.transform(rSession.scheduledDate, 'MMM d, y, h:mm a')
              )
            }
            
            this.hostedSessions = data.filter(s =>
              s.status.toLowerCase() === 'scheduled'
              &&
              s.presenters.includes(this.loggedInEmail)
            );
            this.hostedSessions.forEach(hSession=>{
              hSession.scheduledDate = this.datepipe.transform(hSession.scheduledDate, 'MMM d, y, h:mm a');
            });
            this.sessionService.setSessions(data);
          }
        );

    }
    else {
      if(this.registeredSessionsIds!=undefined || this.registeredSessionsIds!=null){
        this.registeredSessions = this.sessions.filter(s =>
          s.status.toLowerCase() === 'scheduled'
          &&
          this.registeredSessionsIds.includes(s.id)
        );
        this.registeredSessions.forEach(rSession=>
          rSession.scheduledDate = this.datepipe.transform(rSession.scheduledDate, 'MMM d, y, h:mm a')
        )
      }
      this.hostedSessions = this.sessions.filter(s =>
        s.status.toLowerCase() === 'scheduled'
        &&
        s.presenters.includes(this.loggedInEmail)
      );
      this.hostedSessions.forEach(hSession=>{
        hSession.scheduledDate = this.datepipe.transform(hSession.scheduledDate, 'MMM d, y, h:mm a');
      });
    }
  }
}