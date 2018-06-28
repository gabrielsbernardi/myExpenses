import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { DespesaView } from '../../../providers/despesa/despesa-view-values';
import { GastoView } from '../../../providers/gasto/gasto-view-values';

//Provider
import { DespesaProvider } from '../../../providers/despesa/despesa';
import { CreditoView } from '../../../providers/credito/credito-view-values';
import { CreditoProvider } from '../../../providers/credito/credito';

/**
 * Gabriel Bernardi e Matheus Waltrich
 */
@IonicPage()
@Component({
  selector: 'page-gasto-detail',
  templateUrl: 'gasto-detail.html',
})
export class GastoDetailPage {
  title: string;
  gasto: GastoView;
  despesas: Array<DespesaView> = [];
  creditos: Array<CreditoView> = [];
  dadosMesSelect: string;
  loader: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private despesaProvider: DespesaProvider,
              private creditoProvider: CreditoProvider,
              private laodingCtrl: LoadingController) {
    this.gasto = this.navParams.data.gasto;
    this.presentLoading("Carregando detalhes dos gastos...");
    this.carregarDespesas();
    this.carregarCreditos();
    this.title = this.gasto.data;
    this.loader.dismiss();
  }

  ionViewWillEnter(){
    this.dadosMesSelect = "gasto";
  }

  private carregarDespesas() {
    if (this.gasto.ids_despesas) {
      var ids = this.gasto.ids_despesas.split('_@_');
      ids.forEach(id => {
        var d = this.despesaProvider.getDespesaViewValues(id);
        if (typeof d !== 'undefined') {
          this.despesas.push(d);
        }
      });
    }
  }

  private carregarCreditos() {
    if (this.gasto.ids_creditos) {
      var ids = this.gasto.ids_creditos.split('_@_');
      ids.forEach(id => {
        var c = this.creditoProvider.getCreditoViewValues(id);
        if (typeof c !== 'undefined') {
          this.creditos.push(c);
        }
      });
    }
  }

  private presentLoading(msg: string) {
    this.loader = this.laodingCtrl.create({
      content: msg
    });

    this.loader.present();
  }
}
