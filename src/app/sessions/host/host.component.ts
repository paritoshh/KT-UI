import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorizationService } from 'src/app/shared/authorization.service';
import { Session } from 'src/app/shared/session.model';
import { SessionsService } from 'src/app/shared/sessions-service';

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
  tags: string;

  constructor(private auth: AuthorizationService,
    private sessionService: SessionsService,
    private route: ActivatedRoute,
    private _router: Router) { }

  ngOnInit(): void {

    this.loggedInEmail = this.auth.getAuthenticatedUser();
    this.id = this.route.snapshot.params['id'];

    //Find session details, if there is a id in request.
    if (this.id != null && this.id != undefined) {

      this.session = this.sessionService.fetchSessionDetailsById(this.id);
      if (this.session == null || this.session == undefined) {
        this.sessionService.fetchSessionDetailsByIdFromDB(this.id)
          .subscribe(
            data => {
              this.session = data;
              this.presenters = this.session.presenters.join(", ");
              this.tags = this.session.tags.join(", ");
            }
          );
      }

      else {
        this.presenters = this.session.presenters.join(", ");
        this.tags = this.session.tags.join(", ");
      }

    }
    else{
      this.session={
        topic:'',
        description:'',
        createdBy:'',
        id:'',
        presenters:[this.loggedInEmail],
        scheduledDate:'',
        status:'',
        submittedAt:'',
        updatedAt:'',
        tags:[],
        email:this.loggedInEmail,
        feedbacks: []
      };
      this.presenters = this.session.presenters.join(", ");
    }

  }

  createSession(){
    var presentersArray = this.presenters.split(',');
    this.session.presenters = presentersArray;
    var tagsArray = this.tags.split(',');
    this.session.tags = tagsArray;
    this.sessionService.createSession(this.session)
    .subscribe(
      data => {
        console.log(data);
        
        this._router.navigate(['/sessions/own']);
      }
    );
  }
}
