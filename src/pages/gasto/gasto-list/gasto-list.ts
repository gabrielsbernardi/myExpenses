import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private provider: GastoProvider) {
    this.gastos = this.provider.getAll();
  }

  detailGasto(gasto: any) {
    this.navCtrl.push('GastoDetailPage', {gasto: gasto});
  }

}
