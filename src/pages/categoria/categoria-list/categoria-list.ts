import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ItemSliding, Item, LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

//Provider
import { CategoriaProvider } from '../../../providers/categoria/categoria';

/**
 * Gabriel Bernardi e Matheus Waltrich
 */
@IonicPage()
@Component({
  selector: 'page-categoria-list',
  templateUrl: 'categoria-list.html',
})
export class CategoriaListPage {
  showSearchbar: boolean;
  categorias: Observable<any>;
  loader: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private provider: CategoriaProvider,
              private toast: ToastController,
              private laodingCtrl: LoadingController) {
    this.showSearchbar = false;

    this.presentLoading("Carregando categorias...");
    this.categorias = this.provider.getAll();
    this.loader.dismiss();
  }

  // Redireciona para a tela de cadastro de categoria
  newCategoria() {
    this.navCtrl.push('CategoriaEditPage');
  }

  // Redireciona para a tela de edição de categoria passando a categoria selecionada
  editCategoria(categoria: any) {
    this.navCtrl.push('CategoriaEditPage', {categoria: categoria});
  }

  // Remove a categoria selecionada
  removeCategoria(key: string) {
    this.provider.remove(key)
      .then(() => {
        this.showMessage('Categoria removida com sucesso')
      })
      .catch((e) => {
        this.showMessage('Erro ao remover a Categoria.')
      });
  }

  // Exibe a mensagem com o valor passado por parâmetro
  private showMessage(message: string) {
    this.toast.create({ message: message, duration: 3000})
            .present();
  }

  // Verifica se deve ou não exibir a pesquisa de categorias
  toggleSearchbar() {
    this.showSearchbar = !this.showSearchbar;
  }

  // Abrir as opções da categoria com o click na linha
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
