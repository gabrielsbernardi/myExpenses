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

    // Cria a conta
    createAccount(user: User) {
        return this.angularFireAuth.auth.createUserWithEmailAndPassword(user.email, user.password);
    }

    // Loga no sistema
    signIn(user: User) {
        return this.angularFireAuth.auth.signInWithEmailAndPassword(user.email, user.password);
    }

    // Sai do sistema
    signOut() {
        return this.angularFireAuth.auth.signOut();
    }
    
    // Manda um email para resetar a senha
    resetPassword(email: string) {
        return this.angularFireAuth.auth.sendPasswordResetEmail(email);
    }

    // Recupera o usuário logado
    userLogged() {
        return firebase.auth().currentUser;
    }

    // Verifica se o usuário está autenticado
    usuarioautenticado() {
        return this.userLogged().emailVerified;
    }
}
