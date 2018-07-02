import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { AngularFireAuth } from "angularfire2/auth";
import { User } from "./user";
import * as firebase from 'firebase/app';

/**
 * Gabriel Bernardi e Matheus Waltrich
 */
@Injectable()
export class AuthService {
    user: Observable<firebase.User>;

    constructor(private angularFireAuth : AngularFireAuth) {
        this.user = angularFireAuth.authState;
    }

    createAccount(user: User) {
        return this.angularFireAuth.auth.createUserWithEmailAndPassword(user.email, user.password);
    }

    signIn(user: User) {
        return this.angularFireAuth.auth.signInWithEmailAndPassword(user.email, user.password);
    }

    signOut() {
        return this.angularFireAuth.auth.signOut();
    }

    resetPassword(email: string) {
        return this.angularFireAuth.auth.sendPasswordResetEmail(email);
    }

    userLogged() {
        return firebase.auth().currentUser;
    }

    usuarioautenticado() {
        return this.userLogged().emailVerified;
    }
}