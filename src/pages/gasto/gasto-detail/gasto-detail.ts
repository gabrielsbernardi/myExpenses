import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { DespesaView } from '../../../providers/despesa/despesa-view-values';
import { GastoView } from '../../../providers/gasto/gasto-view-values';

//Provider
import { DespesaProvider } from '../../../providers/despesa/despesa';

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

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private provider: DespesaProvider) {
    this.gasto = this.navParams.data.gasto;
    this.carregarDespesas();
    this.title = this.gasto.data;
  }

  private carregarDespesas() {
    var ids = this.gasto.ids_despesas.split('_@_');
    ids.forEach(id => {
      var d = this.provider.getDespesaViewValues(id);
      if (typeof d !== 'undefined') {
        this.despesas.push(d);
      }
    });
  }
}
