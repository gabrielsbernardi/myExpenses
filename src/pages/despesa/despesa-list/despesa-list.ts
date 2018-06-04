import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

//Provider
import { DespesaProvider } from '../../../providers/despesa/despesa';

/**
 * Gabriel Bernardi e Matheus Waltrich
 */
@IonicPage()
@Component({
  selector: 'page-despesa-list',
  templateUrl: 'despesa-list.html',
})
export class DespesaListPage {
  showSearchbar: boolean;
  despesas: Observable<any>;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private provider: DespesaProvider,
              private toast: ToastController) {
    this.showSearchbar = false;
    this.despesas = this.provider.getAll();
  }

  newDespesa() {
    this.navCtrl.push('DespesaEditPage');
  }

  editDespesa(despesa: any) {
    this.navCtrl.push('DespesaEditPage', {despesa: despesa});
  }

  removeDespesa(despesa: any) {
    this.provider.remove(despesa)
      .then(() => {
        this.showMessage('Despesa removida com sucesso')
      })
      .catch((e) => {
        this.showMessage('Erro ao remover a Despesa.')
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
