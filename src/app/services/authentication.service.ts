import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private angularFireAuth: AngularFireAuth) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  loginWithEmail(email: string, password: string) {
    return this.angularFireAuth.auth.signInWithEmailAndPassword(email, password);
  }

  registerWithEmail(email: string, password: string) {
    return this.angularFireAuth.auth.createUserWithEmailAndPassword(email, password); 
  }

  getStatus() {
    return this.angularFireAuth.authState;
  }

  logOut() {
    return this.angularFireAuth.auth.signOut();
  }

  /*loginWithFacebook() {
    const provider = new firebase.auth.FacebookAuthProvider();
    return this.angularFireAuth.auth.signInWithPopup(provider);
  }
  loginWithGoogle() {
    const provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    return this.angularFireAuth.auth.signInWithPopup(provider);
  }*/

}
