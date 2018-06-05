import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

//Provider
import { CreditoProvider } from '../../../providers/credito/credito';

/**
 * Gabriel Bernardi e Matheus Waltrich
 */
@IonicPage()
@Component({
  selector: 'page-credito-list',
  templateUrl: 'credito-list.html',
})
export class CreditoListPage {

  showSearchbar: boolean;
  creditos: Observable<any>;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private provider: CreditoProvider,
              private toast: ToastController) {
    this.showSearchbar = false;
    this.creditos = this.provider.getAll();
  }

  newCredito() {
    this.navCtrl.push('CreditoEditPage');
  }

  editCredito(credito: any) {
    this.navCtrl.push('CreditoEditPage', {credito: credito});
  }

  removeCredito(credito: any) {
    this.provider.remove(credito.key)
      .then(() => {
        this.showMessage('Credito removido com sucesso')
      })
      .catch((e) => {
        this.showMessage('Erro ao remover o Credito.')
      });
  }

  private showMessage(message: string) {
    this.toast.create({ message: message, duration: 3000})
            .present();
  }

  toggleSearchbar() {
    this.showSearchbar = !this.showSearchbar;
  }

}
