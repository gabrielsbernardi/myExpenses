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

  newCategoria() {
    this.navCtrl.push('CategoriaEditPage');
  }

  editCategoria(categoria: any) {
    this.navCtrl.push('CategoriaEditPage', {categoria: categoria});
  }

  removeCategoria(key: string) {
    this.provider.remove(key)
      .then(() => {
        this.showMessage('Categoria removida com sucesso')
      })
      .catch((e) => {
        this.showMessage('Erro ao remover a Categoria.')
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

  private presentLoading(msg: string) {
    this.loader = this.laodingCtrl.create({
      content: msg
    });

    this.loader.present();
  }
}
