import { DatePipe } from '@angular/common';
import { Component, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Session } from '../../shared/session.model';
import { SessionsService } from '../../shared/sessions-service';

@Component({
  selector: 'app-sessions-list',
  templateUrl: './sessions-list.component.html',
  styleUrls: ['./sessions-list.component.css']
})
export class SessionsListComponent implements OnInit {

  sessions: Session[];
  sessionType: string;
  requestedSessionType: string;
  date: Date;



  constructor(private sessionService: SessionsService, private route: ActivatedRoute,
    public datepipe: DatePipe) { }


  ngOnInit(): void {



    this.sessionType = this.route.snapshot.params['sessionType'];
    switch (this.sessionType) {
      case 'recent':
        this.requestedSessionType = 'done';
        break;
      case 'upcoming':
        this.requestedSessionType = 'scheduled';
        break;
      default:
        this.requestedSessionType = 'pending';
    }

    //fetching upcoming sessions details
    //this.sessions = this.sessionService.getSessions();
    if (this.sessions == null || this.sessions == undefined) {
      this.sessionService.fetchAllSessionsDB()
        .subscribe(
          data => {
            console.log("data:: " + data.length);
            this.sessions = data.filter(s =>

              this.filterSessionsByDateAndStatus(s.scheduledDate, s.status)

            );
            this.sessions.forEach(session => {
              session.scheduledDate = this.datepipe.transform(session.scheduledDate, 'MMM d, y');
            })
            this.sessionService.setSessions(data);
          }
        );

    }
    else {
      this.sessions = this.sessions.filter(s =>
        s.status.toLowerCase() === this.requestedSessionType
      );
      this.sessions.forEach(session => {
        session.scheduledDate = this.datepipe.transform(session.scheduledDate, 'MMM d, y');
      })
    }

  }

  /**
   * 
   * @param scheduledDate 
   */
  filterSessionsByDateAndStatus(scheduledDate: string, status: string) {
    let dateCondition: Boolean;
    if (this.requestedSessionType == 'done') {
      dateCondition = new Date(scheduledDate) < new Date() || status.toLowerCase() === this.requestedSessionType;
      return dateCondition
    }
    else {
      dateCondition = new Date(scheduledDate) >= new Date() && status.toLowerCase() === this.requestedSessionType;
      return dateCondition
    }
  }

}
