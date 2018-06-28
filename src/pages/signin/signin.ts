import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ToastController, LoadingController } from 'ionic-angular';
import { SignupPage } from '../signup/signup'
import { User } from '../../providers/auth/user';
import { NgForm } from '@angular/forms';

//Services
import { AuthService } from '../../providers/auth/auth-service';

//Pages
import { GeralPage } from '../geral/geral';
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
  loader: any;

  constructor(public navCtrl: NavController, 
              private toastCtrl: ToastController,
              private authService: AuthService,
              private laodingCtrl: LoadingController) {
    document.getElementById('main-menu').hidden = true
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

      this.presentLoading("Verificando conta...");
      this.authService.signIn(this.user)
        .then((user: any) => {
          this.navCtrl.setRoot(GeralPage);
          this.loader.dismiss();
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

  private presentLoading(msg: string) {
    this.loader = this.laodingCtrl.create({
      content: msg
    });

    this.loader.present();
  }
}
