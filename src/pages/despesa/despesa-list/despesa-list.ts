import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, ItemSliding, Item, LoadingController } from 'ionic-angular';
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
  loader: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private provider: DespesaProvider,
              private toast: ToastController,
              private gastoProvider: GastoProvider,
              private categoriaProvider: CategoriaProvider,
              private alertCtrl: AlertController,
              private laodingCtrl: LoadingController) {
    this.showSearchbar = false;
    this.presentLoading("Carregando despesas...");
    this.despesas = this.provider.getAll();
    this.loader.dismiss();
    this.categoriaProvider.getAllCategotiasViewValues();
  }

  // Redireciona para a tela de cadastro de despesa
  // caso já tenha uma categoria inclusa
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

  // Redireciona para a tela de edição de despesa passando a despesa selecionada
  editDespesa(despesa: any) {
    this.navCtrl.push('DespesaEditPage', {despesa: despesa});
  }

  // Remove a despesa selecionada
  removeDespesa(despesa: any) {
    this.presentLoading("Removendo despesa...");
    this.provider.remove(despesa)
      .then(() => {
        this.gastoProvider.removeDespesa(despesa.key);
        this.loader.dismiss();
        this.showMessage('Despesa removida com sucesso')
      })
      .catch((e) => {
        this.showMessage('Erro ao remover a Despesa.')
      });
  }

  // Exibe a mensagem com o valor passado por parâmetro
  private showMessage(message: string) {
    this.toast.create({ message: message, duration: 3000})
            .present();
  }

  // Verifica se deve ou não exibir a pesquisa de despesas
  toggleSearchbar() {
    this.showSearchbar = !this.showSearchbar;
  }

  // Abrir as opções da despesa com o click na linha
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
