import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { SignupPage } from '../signup/signup'
import { User } from '../../providers/auth/user';
import { NgForm } from '@angular/forms';

//Services
import { AuthService } from '../../providers/auth/auth-service';

//Pages
import { GeralPage } from '../geral/geral';
import { ResetpasswordPage } from '../resetpassword/resetpassword';
import { GastoListPage } from '../gasto/gasto-list/gasto-list';

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
              private laodingCtrl: LoadingController,
              private alertCtrl: AlertController) {
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
        if (this.authService.usuarioautenticado()) {
          this.navCtrl.setRoot(GastoListPage);
        } else {
          this.showAlertUsuarioNaoAutenticado();
        }
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
      this.loader.dismiss();
    }
  }

  private showAlertUsuarioNaoAutenticado() {
    let alert = this.alertCtrl.create({
      title: 'Autenticação de Usuário Inválida',
      subTitle: 'Verificamos que seu usuário ainda não foi autenticado. Por favor, verifique sua caixa de entrada do e-mail.',
      buttons: [
        {
          text: 'Ok',
          role: 'ok'
        }
      ]
    });
    alert.present();
  }

  private presentLoading(msg: string) {
    this.loader = this.laodingCtrl.create({
      content: msg
    });

    this.loader.present();
  }
}
