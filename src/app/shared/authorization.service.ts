import { Injectable } from '@angular/core';
import { AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool, CognitoUserSession } from 'amazon-cognito-identity-js';
import { Observable } from 'rxjs';
import { ProfileService } from '../profile/profile.service';

const poolData = {
  UserPoolId: 'ap-south-1_G4GJ5YWee', // Your user pool id here
  ClientId: '4s31g6lhih98eqk23ltcggo2eb' // Your client id here  
};
export const TOKEN = 'token';
export const AUTHENTICATED_USER = 'authenticaterUser';
export const USER_EMAIL = 'loggedin_user_email';
export const NAME = 'name';


const userPool = new CognitoUserPool(poolData);

@Injectable()
export class AuthorizationService {
  cognitoUser: any;

  constructor() { }

  register(email, name, password) {

    const attributeList = [];
    const nameAttribute = {
      Name: 'name',
      Value: name
    }
    attributeList.push(new CognitoUserAttribute(nameAttribute));

    return Observable.create(observer => {
      userPool.signUp(email, password, attributeList, null, (err, result) => {
        if (err) {
          console.log("signUp error", err);
          observer.error(err);
        }

        this.cognitoUser = result.user;
        console.log("signUp success", result);
        observer.next(result);
        observer.complete();
      });
    });

  }

  confirmAuthCode(code) {
    const user = {
      Username: this.cognitoUser.username,
      Pool: userPool
    };
    return Observable.create(observer => {
      const cognitoUser = new CognitoUser(user);
      cognitoUser.confirmRegistration(code, true, function (err, result) {
        if (err) {
          console.log(err);
          observer.error(err);
        }
        console.log("confirmAuthCode() success", result);
        observer.next(result);
        observer.complete();
      });
    });
  }

  confirmAuthCodeLater(code, username) {
    const user = {
      Username: username,
      Pool: userPool
    };
    return Observable.create(observer => {
      const cognitoUser = new CognitoUser(user);
      cognitoUser.confirmRegistration(code, true, function (err, result) {
        if (err) {
          console.log(err);
          observer.error(err);
        }
        console.log("confirmAuthCode() success", result);
        observer.next(result);
        observer.complete();
      });
    });
  }

  signIn(username: string, password: string): Observable<any> {

    //https://docs.aws.amazon.com/cognito/latest/developerguide/authentication.html

    const obs = Observable.create((observer) => {

      const authData = {
        Username: username,
        Password: password
      };

      const authDetails = new AuthenticationDetails(authData);

      const userData = {
        Username: username,
        Pool: userPool
      };

      const cognitoUser = new CognitoUser(userData);

      cognitoUser.authenticateUser(authDetails, {
        onSuccess(result: CognitoUserSession) {
          sessionStorage.setItem(AUTHENTICATED_USER, result.getIdToken().decodePayload().email);
          sessionStorage.setItem(TOKEN, result.getIdToken().getJwtToken());
          sessionStorage.setItem(NAME, result.getIdToken().decodePayload().name);
          //sessionStorage.setItem(USER_EMAIL, userPool.getCurrentUser().getSignInUserSession().getIdToken().decodePayload().email);
          observer.next({ userName: userPool.getCurrentUser().getUsername(), token: result.getIdToken().getJwtToken() });
          console.log(result);
        }, onFailure(err) {
          console.log(err);
          alert(err.message);
        }
      });

    });

    return obs;

  }

  isLoggedIn() {
    return userPool.getCurrentUser() != null;
  }

  getAuthenticatedUser() {
    return sessionStorage.getItem(AUTHENTICATED_USER);
  }

  getAuthenticatedUserName() {
    return sessionStorage.getItem(NAME);
  }
  isUserLoggedIn() {
    const user = sessionStorage.getItem(AUTHENTICATED_USER);
    return !(user === null);
  }

  logOut() {
    console.log(sessionStorage.getItem(TOKEN))
    sessionStorage.removeItem(AUTHENTICATED_USER);
    sessionStorage.removeItem(TOKEN);
    sessionStorage.removeItem(NAME);

    if (userPool && userPool.getCurrentUser())
      userPool.getCurrentUser().signOut();
  }
  getAuthenticatedToken() {
    if (this.getAuthenticatedUser()) {
      return sessionStorage.getItem(TOKEN);
    }
  }
}