import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ItemSliding, Item, LoadingController } from 'ionic-angular';
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
  loader: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private provider: CreditoProvider,
              private toast: ToastController,
              private gastoProvider: GastoProvider,
              private laodingCtrl: LoadingController) {
    this.showSearchbar = false;

    this.presentLoading("Carregando créditos...");
    this.creditos = this.provider.getAll();
    this.loader.dismiss();
  }

  // Redireciona para a tela de cadastro de crédito
  newCredito() {
    this.navCtrl.push('CreditoEditPage');
  }

  // Redireciona para a tela de edição de crédito passando o crédito selecionada
  editCredito(credito: any) {
    this.navCtrl.push('CreditoEditPage', {credito: credito});
  }

  // Remove o credito selecionado
  removeCredito(credito: any) {
    this.presentLoading("Removendo crédito...");
    this.provider.remove(credito.key)
      .then(() => {
        this.gastoProvider.removeCredito(credito.key);
        this.loader.dismiss();
        this.showMessage('Credito removido com sucesso')
      })
      .catch((e) => {
        this.showMessage('Erro ao remover o Credito.')
      });
  }

  // Exibe a mensagem com o valor passado por parâmetro
  private showMessage(message: string) {
    this.toast.create({ message: message, duration: 3000})
            .present();
  }

  // Verifica se deve ou não exibir a pesquisa de créditos
  toggleSearchbar() {
    this.showSearchbar = !this.showSearchbar;
  }

  // Abrir as opções do crédito com o click na linha
  public open(itemSlide: ItemSliding, item: Item) {
    itemSlide.setElementClass("active-sliding", true);
    itemSlide.setElementClass("active-slide", true);
    itemSlide.setElementClass("active-options-left", true);
    item.setElementStyle("transform", "translate3d(63px, 0px, 0px)");
  }

  // Dialog de carregamento enquanto estiver fazendo
  // execuções com o firebase 
  private presentLoading(msg: string) {
    this.loader = this.laodingCtrl.create({
      content: msg
    });

    this.loader.present();
  }
}
