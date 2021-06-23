import { DatePipe } from '@angular/common';
import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Profile } from 'src/app/profile/profile.model';
import { ProfileService } from 'src/app/profile/profile.service';
import { RegisterSessionProfile } from 'src/app/profile/register-session-profile.model';
import { AuthorizationService } from 'src/app/shared/authorization.service';
import { Session } from 'src/app/shared/session.model';
import { SessionsService } from 'src/app/shared/sessions-service';
import { Feedback } from './feedback/feedback.model';

@Component({
  selector: 'app-session-details',
  inputs: ['sessions'],
  templateUrl: './session-details.component.html',
  styleUrls: ['./session-details.component.css']
})
export class SessionDetailsComponent implements OnInit {

  session: Session;
  registerSessionProfileModel: RegisterSessionProfile;
  isFeedbackVisible: boolean;
  feedbackToPassInFeedbackComponent: Feedback;
  @ViewChild('closeButton') closebutton;


  id: string;
  presenters: string;
  tags: string[];
  isRegistered: boolean;
  profile: Profile;
  loggedInEmail: string;
  indexOfSessionWhichNeedsToBeRemoved: number;
  isHostingSession: boolean;
  isFeedBackSubmittedByThisUser: boolean = false;
  presentersNames: String[] = [];
  //sessionType: string;
  //this variable will be used to solve a defect, where user register a session and unregister right away.
  //That time -1 goes in case of unregister also.
  numberOfRegisteredSessions: number;
  isSessionDatePassed: Boolean;

  constructor(private sessionService: SessionsService, private route: ActivatedRoute,
    private profileService: ProfileService, private auth: AuthorizationService,
    private datepipe: DatePipe) { }

  ngOnInit(): void {

    this.loggedInEmail = this.auth.getAuthenticatedUser();
    this.id = this.route.snapshot.params['id'];

    //fetching a session details
    this.session = this.sessionService.fetchSessionDetailsById(this.id);
    if (this.session == null || this.session == undefined) {
      this.sessionService.fetchSessionDetailsByIdFromDB(this.id)
        .subscribe(
          data => {
            this.session = data;
            this.isHostingSession = data.presenters.includes(this.loggedInEmail);
            this.presenters = data.presenters.join(",");
            this.tags = data.tags;
            this.fetchProfileDetails();
            this.isFeedbackSubmitted();
            this.fetchProfileDetailsOfSessionPresenter();
            this.session.scheduledDate = this.datepipe.transform(this.session.scheduledDate, 'MMM d, y');
            this.isSessionDatePassed = new Date(this.session.scheduledDate) < new Date();
          }
        );
    }

    else {
      this.isHostingSession = this.session.presenters.includes(this.loggedInEmail);
      this.presenters = this.session.presenters.join(", ");
      this.tags = this.session.tags;
      this.fetchProfileDetails();
      this.isFeedbackSubmitted();
      this.fetchProfileDetailsOfSessionPresenter();
    }


  }
  //fetching existing profile details
  fetchProfileDetails() {
    this.profileService.retrieveProfile(this.loggedInEmail)
      .subscribe(
        data => {
          console.log("data:: " + data);
          this.profile = data;
          if (data.registeredSessions != null && data.registeredSessions != undefined) {
            this.isRegistered = data.registeredSessions.includes(this.id);
            //this.isHostingSession = data.hostedSessions.includes(this.id);
            this.indexOfSessionWhichNeedsToBeRemoved = data.registeredSessions.indexOf(this.id);
            this.numberOfRegisteredSessions = data.registeredSessions.length;
          }
        }
      );
  }

  //fetching existing profile details
  fetchProfileDetailsOfSessionPresenter() {
    let presenters = this.session.presenters;
    for (var presenter of presenters) {
      this.profileService.retrieveProfile(presenter)
        .subscribe(
          data => {
            this.presentersNames.push(data.firstName + " " + data.lastName);// = data.firstName + " " + data.lastName;
          }
        );

    }

  }

  //finding if user has submitted the feedback.
  isFeedbackSubmitted() {
    if (this.session.feedbacks != null && this.session.feedbacks != undefined) {
      this.session.feedbacks.forEach(f => {
        if (f.provider.toLowerCase() === this.loggedInEmail.toLowerCase()) {
          this.isFeedBackSubmittedByThisUser = true;
          this.feedbackToPassInFeedbackComponent = f;
          return;
        }

      });

    }

  }
  feedbackSubmittedConfirmationUpdate(feedBackSubmitionUpdate: boolean) {
    this.isFeedBackSubmittedByThisUser = feedBackSubmitionUpdate;
  }

  /**
     * 
     * Register / Deregister
     */
  registerUnregister() {

    //unregister flow
    if (this.isRegistered &&
      (this.indexOfSessionWhichNeedsToBeRemoved == undefined ||
        this.indexOfSessionWhichNeedsToBeRemoved == null
        || this.indexOfSessionWhichNeedsToBeRemoved == -1)) {
      //if a user doesn't have registerted session object.
      this.indexOfSessionWhichNeedsToBeRemoved = this.numberOfRegisteredSessions == undefined ? 0 : this.numberOfRegisteredSessions;
    }
    this.registerSessionProfileModel = {
      email: this.loggedInEmail,
      session: this.id,
      isRegister: !this.isRegistered,
      indexOfSessionWhichNeedsToBeRemoved: this.indexOfSessionWhichNeedsToBeRemoved
    }
    this.isRegistered = !this.isRegistered;
    this.profileService.registerUnregisterSession(this.registerSessionProfileModel, this.loggedInEmail)
      .subscribe(
        data => {
          console.log(data);
          this.profileService.cache = {};
        }
      );

  }

  /**
   * Cancel your hosting session.
   */

  /*

  this.auth.confirmAuthCode(code).subscribe(
     (data) => {
       this.codeWasConfirmed = true;
       this.confirmCode = false;
       alert('Verification success.');
     },
     (err) => {
       console.log(err);
       this.loginRegisterFlowErrorMessage = err.message;
       this.isErrorInEmailRegisterFlow = true;
     });this._router.navigate(['/sessions/own']);
     */

  cancelSession() {
    this.closebutton.nativeElement.click();
    this.sessionService.cancelHostedSession(this.id, this.loggedInEmail, this.session.scheduledDate, this.session.topic,
      this.session.description,
      this.session.presenters, 'Canceled')
      .subscribe(
        data => {
          console.log(data);
          this.session.status = 'canceled';
          //this.isFeedBackSubmittedByThisUser = true;
          //this.feedbackSubmittedConfirmation.emit(this.isFeedBackSubmittedByThisUser);
        }
      );
  }

  closeModal() {
    this.closebutton.nativeElement.click();
  }

  openFeedbackBlock() {
    this.isFeedbackVisible = !this.isFeedbackVisible;
  }

}
