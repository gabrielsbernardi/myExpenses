import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

//Provider
import { DespesaProvider } from '../../../providers/despesa/despesa';
import { GastoProvider } from '../../../providers/gasto/gasto';
import { CategoriaProvider } from '../../../providers/categoria/categoria';

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
              private toast: ToastController,
              private gastoProvider: GastoProvider,
              private categoriaProvider: CategoriaProvider,
              private alertCtrl: AlertController) {
    this.showSearchbar = false;
    this.despesas = this.provider.getAll();
  }

  newDespesa() {
    if (this.categoriaProvider.getAllCategotiasViewValues().length > 0) {
      this.navCtrl.push('DespesaEditPage');
    } else {
      let alert = this.alertCtrl.create({
        title: 'Atenção',
        subTitle: 'Para criar uma despesa é necessário cadastrar ao menos uma categoria de despesa. Exemplos de categoria:<br> - Veículo<br> - Casa',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Ir Para Cadastro de Categoria',
            handler: () => {
              this.navCtrl.push('CategoriaEditPage');
            }
          }
        ]
      });
      alert.present();
    }
  }

  editDespesa(despesa: any) {
    this.navCtrl.push('DespesaEditPage', {despesa: despesa});
  }

  removeDespesa(despesa: any) {
    this.provider.remove(despesa)
      .then(() => {
        this.gastoProvider.remove(despesa.key);
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
