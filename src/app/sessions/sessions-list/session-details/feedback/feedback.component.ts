import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from 'src/app/profile/profile.service';
import { AuthorizationService } from 'src/app/shared/authorization.service';
import { Session } from 'src/app/shared/session.model';
import { SessionsService } from 'src/app/shared/sessions-service';
import { Feedback } from './feedback.model';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  @Input() feedbackToPassInFeedbackComponent: Feedback;
  @Input() session: Session;
  isFeedbackBlockVisible: boolean;
  loggedInEmail: string;
  id: string;
  @Input() isFeedBackSubmittedByThisUser: boolean;
  rating = 5;
  @Output() feedbackSubmittedConfirmation: EventEmitter<boolean> = new EventEmitter();

  constructor(private sessionService: SessionsService, private route: ActivatedRoute,
    private profileService: ProfileService, private auth: AuthorizationService) { }

  ngOnInit(): void {
    this.loggedInEmail = this.auth.getAuthenticatedUser();
    this.id = this.route.snapshot.params['id'];

// For sessions who doesnt have feedbacks objects.
    // if(this.session.feedbacks!=null || this.session.feedbacks!=undefined){
    //   this.feedback = this.session.feedbacks.filter(feedB => 
    //     feedB.provider.toLowerCase() === this.loggedInEmail.toLowerCase()
    //   )[0];
    // }
    
    if(this.feedbackToPassInFeedbackComponent==null || this.feedbackToPassInFeedbackComponent==undefined){
      this.feedbackToPassInFeedbackComponent = {
        feedback:undefined,
        rating: 5,
        provider: this.loggedInEmail
      }
     // this.isFeedBackSubmitted = false;
    }
    else{
      this.rating = this.feedbackToPassInFeedbackComponent.rating;
    }
  }

  submitFeedback() {
    this.feedbackToPassInFeedbackComponent.rating = this.rating;
    this.sessionService.updateFeedback(this.id, this.feedbackToPassInFeedbackComponent, this.loggedInEmail)
    .subscribe(
      data => {
        console.log(data);
        this.isFeedBackSubmittedByThisUser=true;
        this.feedbackSubmittedConfirmation.emit(this.isFeedBackSubmittedByThisUser);
      }
    );
  }

}
