import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ItemSliding, Item } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

//Provider
import { CreditoProvider } from '../../../providers/credito/credito';
import { GastoProvider } from '../../../providers/gasto/gasto';

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
              private toast: ToastController,
              private gastoProvider: GastoProvider) {
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
        this.gastoProvider.removeCredito(credito.key);
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

  public open(itemSlide: ItemSliding, item: Item) {
    itemSlide.setElementClass("active-sliding", true);
    itemSlide.setElementClass("active-slide", true);
    itemSlide.setElementClass("active-options-left", true);
    item.setElementStyle("transform", "translate3d(63px, 0px, 0px)");
  }
}
