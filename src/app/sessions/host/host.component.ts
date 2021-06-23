import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorizationService } from 'src/app/shared/authorization.service';
import { Session } from 'src/app/shared/session.model';
import { SessionsService } from 'src/app/shared/sessions-service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.css']
})
export class HostComponent implements OnInit {

  loggedInEmail: string;
  id: string;
  session: Session;
  presenters: string;
  tags: string[] = [];
  //For tags chips starts
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  //For tags chips ends
  //just to update the session cache with a newly created session, in case of cache is null.
  existingSessions: Session[] = [];
  minDate: Date;
  maxDate: Date;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  allTimings: string[] = ['12:00 AM', '1:00 AM', '1:30 AM', '2:00 AM', '2:30 AM',
    '3:00 AM', '3:30 AM', '4:00 AM', '4:30 AM', '5:00 AM', '5:30 AM', '6:00 AM',
    '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM',
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM',
    '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM',
    '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM', '11:00 PM',
    '11:30 PM'];
  allowedToTimings: string[] = [...this.allTimings];
  allowedFromTimings: string[] = [...this.allTimings];



  constructor(private auth: AuthorizationService,
    private sessionService: SessionsService,
    private route: ActivatedRoute,
    private _router: Router) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date();
    this.maxDate = new Date(currentYear, 11, 31);
  }

  ngOnInit(): void {

    //You can host upto 6 months in advance.
    this.maxDate.setMonth(this.maxDate.getMonth() + 6);

    this.loggedInEmail = this.auth.getAuthenticatedUser();
    this.id = this.route.snapshot.params['id'];

    //Find session details, if there is an id in the request.
    if (this.id != null && this.id != undefined) {

      this.session = this.sessionService.fetchSessionDetailsById(this.id);
      if (this.session == null || this.session == undefined) {
        this.sessionService.fetchSessionDetailsByIdFromDB(this.id)
          .subscribe(
            data => {
              this.session = data;
              this.presenters = this.session.presenters.join(", ");
              //this.tags = this.session.tags.join(", ");
              this.tags = this.session.tags;
            }
          );
      }

      else {
        this.presenters = this.session.presenters.join(", ");
        //this.tags = this.session.tags.join(", ");
        this.tags = this.session.tags;
      }

    }
    else {
      this.session = {
        topic: '',
        description: '',
        createdBy: '',
        id: '',
        presenters: [this.loggedInEmail],
        scheduledDate: '',
        fromTime: '',
        toTime: '',
        status: '',
        submittedAt: '',
        updatedAt: '',
        tags: [],
        email: this.loggedInEmail,
        feedbacks: []
      };
      this.presenters = this.session.presenters.join(", ");
    }

  }
  onChangeofToOptions(selectedToTime) {
    let index = this.allTimings.indexOf(selectedToTime);
    this.allowedFromTimings = [...this.allTimings]
    this.allowedFromTimings.splice(index, (this.allowedFromTimings.length - index));
  }
  onChangeofFromOptions(selectedFromTime) {
    let index = this.allTimings.indexOf(selectedFromTime);
    this.allowedToTimings = [...this.allTimings]
    this.allowedToTimings.splice(0, index + 1);
  }
  createSession() {
    /**
     * 1. trimmed the presenter emails
     * 2. Converted to Set to remove duplicates
     * 3. Convert back to Array.
     */
    var presentersArray = Array.from(new Set(this.presenters.split(',').map(p => p.trim())));

    this.session.presenters = presentersArray;
    var tagsArray = this.tags;
    this.session.tags = this.tags;
    this.session.scheduledDate = new Date(this.session.scheduledDate).toISOString().substring(0, 10);//[tagsArray];
    //to update the cache if it was null.
    this.populateExistingSessions();
    this.sessionService.createSession(this.session)
      .subscribe(
        newHostedSession => {
          console.log(newHostedSession);
          //Updating the newly created session into service.
          this.existingSessions.push(newHostedSession);
          this.sessionService.setSessions(this.existingSessions);
          this._router.navigate(['/sessions/own']);
        }
      );
  }

  populateExistingSessions() {

    // this.existingSessions = this.sessionService.getSessions();
    if (this.existingSessions == null || this.existingSessions == undefined) {
      this.sessionService.fetchAllSessionsDB()
        .subscribe(
          data => {
            this.existingSessions = data;
            this.sessionService.setSessions(data);
          }
        );
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.tags.push(value);
    }

    // Clear the input value
    event.input.value = '';
  }
  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

}
