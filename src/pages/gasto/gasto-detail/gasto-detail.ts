import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { DespesaView } from '../../../providers/despesa/despesa-view-values';
import { GastoView } from '../../../providers/gasto/gasto-view-values';

//Provider
import { DespesaProvider } from '../../../providers/despesa/despesa';
import { CreditoView } from '../../../providers/credito/credito-view-values';
import { CreditoProvider } from '../../../providers/credito/credito';
import { DecimalPipe } from '@angular/common';

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

  despesasCarregadas: Observable<any>;
  creditosCarregadas: Observable<any>;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private despesaProvider: DespesaProvider,
              private creditoProvider: CreditoProvider,
              private laodingCtrl: LoadingController,
              private decimalPipe: DecimalPipe) {
    this.gasto = this.navParams.data.gasto;
    this.presentLoading("Carregando detalhes dos gastos...");
    this.carregarDespesas();
    this.carregarCreditos();
    this.title = this.gasto.data;
    this.loader.dismiss();
  }
  
  // Seleciona a tab de gastos como a inicial
  ionViewWillEnter(){
    this.dadosMesSelect = "gasto";
  }

  // Carrega todas as despesas referente ao mês
  private carregarDespesas() {
    if (this.gasto.ids_despesas) {
      var self = this;
      this.despesasCarregadas = this.despesaProvider.getAll();
      var ids = this.gasto.ids_despesas.split('_@_');
      ids.forEach(id => {
        this.despesasCarregadas.forEach(dc => {
          dc.forEach(d => {
            if (d.key == id) {
              var despesa = new DespesaView();
              despesa.dsc = d.dsc;
              despesa.data = d.data_compra;
              despesa.valor = self.decimalPipe.transform((d.valor / d.num_parcela), '1.2-2');
              this.despesas.push(despesa);
            }
          });
        })
      })
    }
  }

  // Carrega todos os créditos referente ao mês
  private carregarCreditos() {
    if (this.gasto.ids_creditos) {
      var self = this;
      this.creditosCarregadas = this.creditoProvider.getAll();
      var ids = this.gasto.ids_creditos.split('_@_');
      ids.forEach(id => {
        this.creditosCarregadas.forEach(cc => {
          cc.forEach(c => {
            if (c.key == id) {
              var credito = new CreditoView();
              credito.dsc = c.dsc;
              credito.data = c.data_inicial_recebimento;
              credito.valor = self.decimalPipe.transform((c.valor / c.num_parcela), '1.2-2');
              this.creditos.push(credito);
            }
          });
        })
      })
    }
  }

  // Apresenta dialog enquanto estiver fazendo o carregamento da tela
  private presentLoading(msg: string) {
    this.loader = this.laodingCtrl.create({
      content: msg
    });

    this.loader.present();
  }
}
