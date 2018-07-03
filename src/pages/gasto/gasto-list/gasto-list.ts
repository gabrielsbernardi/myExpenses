import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

//Provider
import { GastoProvider } from '../../../providers/gasto/gasto';

import { GastoView } from '../../../providers/gasto/gasto-view-values';

/**
 * Gabriel Bernardi e Matheus Waltrich
 */
@IonicPage()
@Component({
  selector: 'page-gasto-list',
  templateUrl: 'gasto-list.html',
})
export class GastoListPage {
  gastos: Array<GastoView>;
  loader: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private provider: GastoProvider,
              private laodingCtrl: LoadingController) {
    document.getElementById('main-menu').hidden = false
    this.presentLoading("Carregando gastos...");
    this.gastos = this.provider.getAll();
    this.loader.dismiss();
  }

  // Chama a tela de detalhes do gasto passando o gasto específico selecionado
  detailGasto(gasto: any) {
    this.navCtrl.push('GastoDetailPage', {gasto: gasto});
  }

  // Apresenta dialog enquanto estiver fazendo o carregamento da tela
  private presentLoading(msg: string) {
    this.loader = this.laodingCtrl.create({
      content: msg
    });

    this.loader.present();
  }
}
