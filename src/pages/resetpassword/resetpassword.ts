import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../providers/auth/auth-service';
import { SigninPage } from '../signin/signin';

/**
 * Gabriel Bernardi e Matheus Waltrich
 */
@IonicPage()
@Component({
  selector: 'page-resetpassword',
  templateUrl: 'resetpassword.html',
})
export class ResetpasswordPage {
  userEmail: string = '';
  @ViewChild('form') form: NgForm;

  constructor(public navCtrl: NavController, 
              private toastCtrl: ToastController,
              private authService: AuthService) {
  }

  resetPassword() {
    if (this.form.valid) {
      let toast = this.toastCtrl.create({ duration: 3000, position: 'bottom' });

      this.authService.resetPassword(this.userEmail)
        .then((user: any) => {
          toast.setMessage('Solicitação foi enviada para seu e-mail');
          toast.present();
          
          this.navCtrl.setRoot(SigninPage);
        })
        .catch((error: any) => {
          if (error.code  == 'auth/invalid-email') {
            toast.setMessage('O e-mail digitado não é valido.');
          } else if (error.code  == 'auth/user-not-found') {
            toast.setMessage('O usuário não foi encontrado.');
          }
          toast.present();
        });
    }
  }
}
