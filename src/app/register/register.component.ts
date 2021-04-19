import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../profile/profile.service';
import { AuthorizationService } from '../shared/authorization.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  confirmCode: boolean = false;
  codeWasConfirmed: boolean = false;
  error: string = "";
  email : string;

  constructor(private auth: AuthorizationService,
    private _router: Router,
    private profileService: ProfileService) { }

  ngOnInit(): void {
  }

  register(form: NgForm) {
    const email = form.value.email;
    this.email = email;
    const name = form.value.name;
    const password = form.value.password;
    this.auth.register(email, name, password).subscribe(
      (data) => {        
        this.confirmCode = true;
      },
      (err) => {
        console.log(err);
        this.error = "Registration Error has occurred";
      }
    );
  }
  validateAuthCode(form: NgForm) {
    const code = form.value.code;
    
    this.auth.confirmAuthCode(code).subscribe(
      (data) => {
        //this._router.navigateByUrl('/');
        this.codeWasConfirmed = true;
        this.confirmCode = false;
        alert('You must update your profile to start using this application.');
      },
      (err) => {
        console.log(err);
        this.error = "Confirm Authorization Error has occurred";
      });
  }

}
