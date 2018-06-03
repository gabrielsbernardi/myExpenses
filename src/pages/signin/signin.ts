import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { SignupPage } from '../signup/signup'
import { User } from '../../providers/auth/user';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../providers/auth/auth-service';
import { HomePage } from '../home/home';
import { ResetpasswordPage } from '../resetpassword/resetpassword';

/**
 * Gabriel Bernardi e Matheus Waltrich
 */
@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {

  user: User = new User();
  @ViewChild('form') form: NgForm;

  constructor(public navCtrl: NavController, 
              private toastCtrl: ToastController,
              private authService: AuthService) {
  }

  createAccount() {
    this.navCtrl.setRoot(SignupPage);
  }

  resetPassword() {
    this.navCtrl.setRoot(ResetpasswordPage);
  }

  signIn() {
    if (this.form.valid) {
      let toast = this.toastCtrl.create({ duration: 3000, position: 'bottom' });

      this.authService.signIn(this.user)
        .then((user: any) => {
          this.navCtrl.setRoot(HomePage);
        })
        .catch((error: any) => {
          if (error.code  == 'auth/invalid-email') {
            toast.setMessage('O e-mail digitado não é valido.');
          } else if (error.code  == 'auth/user-desabled') {
            toast.setMessage('O usuário está desativado.');
          } else if (error.code  == 'auth/user-not-found') {
            toast.setMessage('O usuário não foi encontrado.');
          } else if (error.code  == 'auth/wrong-password') {
            toast.setMessage('A senha digitada não é válida.');
          }
          toast.present();
        });
    }
  }
}
