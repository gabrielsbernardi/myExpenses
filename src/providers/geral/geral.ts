import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../auth/auth-service';
import { GraficoPieView } from './grafico-pie-view-values';

import * as firebase from 'firebase';
import { DecimalPipe } from '@angular/common';
import { GraficoLineView } from './grafico-line-view-values';
import { DateTime } from 'ionic-angular';
import { GeralView } from './geral-view-values';

/**
 * Gabriel Bernardi e Matheus Waltrich
 */
@Injectable()
export class GeralProvider {
  private PATH_CATEGORIA = 'categorias/' + this.auth.userLogged().uid + "/";
  private PATH_DESPESA = 'despesas/' + this.auth.userLogged().uid + "/";
  private PATH_GASTO = 'gastos/' + this.auth.userLogged().uid + "/";

  private pieValues: Array<GraficoPieView> = [];
  private lineValues: Array<GraficoLineView> = [];

  constructor(private db: AngularFireDatabase,
              private auth: AuthService,
              private decimalPipe: DecimalPipe) { 
  }

  getPieValues() {
    var self = this;
    this.pieValues = [];

    var graficoPie;
    firebase.database().ref(this.PATH_CATEGORIA).on("child_added", function(categoria) {
      graficoPie = new GraficoPieView();
      graficoPie.tipo_categoria = categoria.val().tipo;
      graficoPie.valor_total_gastos = self.getValorTotalGastosPorCategoria(categoria.key);

      self.pieValues.push(graficoPie);
    });

    return this.pieValues;
  }

  private getValorTotalGastosPorCategoria(idCategoria: string) {
    var valor = 0.00;
    var current = new Date();
    var ano = current.getFullYear();
    var mes = current.getMonth() + 1;
    var dataAtual = current.getFullYear() + '-' + (mes.toString().length == 1 ? ('0' + mes) : mes);
    firebase.database().ref(this.PATH_GASTO + dataAtual + '/despesas/').on("child_added", function(despesa) {
      if (idCategoria == despesa.val().id_categoria) {
        valor += parseFloat(despesa.val().valor);
      }
    });

    return this.decimalPipe.transform(valor, '1.2-2');
  }

  getLineValues() {
    var self = this;
    this.lineValues = [];

    var paths = this.getPaths();

    var graficoLine;

    paths.forEach(path => {
      var valorDespesa;
      firebase.database().ref(this.PATH_GASTO + path + '/despesas/').on("child_added", function(despesa) {
        valorDespesa = self.decimalPipe.transform(despesa.val().valor, '1.2-2');
      });

      var valorCredito;
      firebase.database().ref(this.PATH_GASTO + path + '/creditos/').on("child_added", function(credito) {
        valorCredito = self.decimalPipe.transform(credito.val().valor, '1.2-2');
      });

      var graficoLineView = new GraficoLineView();
      graficoLineView.label = this.getDataExtenso(path);
      graficoLineView.valor_despesas = (typeof valorDespesa === 'undefined' ? 0.0 : valorDespesa);
      graficoLineView.valor_creditos = (typeof valorCredito === 'undefined' ? 0.0 : valorCredito);

      self.lineValues.push(graficoLineView);
    })

    return this.lineValues;
  }

  private getPaths() {
    var datas = [];
    var current = new Date();
    var mes = current.getMonth() + 1;
    var dataAtual = current.getFullYear() + '-' + (mes.toString().length == 1 ? ('0' + mes) : mes);

    var dataUmMesAntes = this.getMesAnterior(dataAtual);
    var dataDoisMesesAntes = this.getMesAnterior(dataUmMesAntes);

    var dataUmMesDepois = this.getMesDepois(dataAtual);
    var dataDoisMesesDepois = this.getMesDepois(dataUmMesDepois);

    datas.push(dataDoisMesesAntes);
    datas.push(dataUmMesAntes);
    datas.push(dataAtual);
    datas.push(dataUmMesDepois);
    datas.push(dataDoisMesesDepois);

    return datas;
  }

  private getMesAnterior(data: string) {
    var separaData = data.split('-');
    var ano = parseInt(separaData[0]);
    var mes = parseInt(separaData[1]);
    if (mes == 1) {
      return (ano - 1) + '-12';
    }

    mes = mes - 1;
    return ano + '-' + (mes.toString().length == 1 ? ('0' + mes) : mes);
  }

  private getMesDepois(data: string) {
    var separaData = data.split('-');
    var ano = parseInt(separaData[0]);
    var mes = parseInt(separaData[1]);
    if (mes == 12) {
      return (ano + 1) + '-01';
    }

    mes = mes + 1;
    return ano + '-' + (mes.toString().length == 1 ? ('0' + mes) : mes);
  }

  private getDataExtenso(data: string) {
    var separaData = data.split('-');
    var mesExtenso;
    switch(separaData[1]) {
      case '01':
        mesExtenso = 'JAN';
        break;
      case '02':
        mesExtenso = 'FEV';
        break;
      case '03':
        mesExtenso = 'MAR';
        break;
      case '04':
        mesExtenso = 'ABR';
        break;
      case '05':
        mesExtenso = 'MAI';
        break;
      case '06':
        mesExtenso = 'JUN';
        break;
      case '07':
        mesExtenso = 'JUL';
        break;
      case '08':
        mesExtenso = 'AGO';
        break;
      case '09':
        mesExtenso = 'SET';
        break;
      case '10':
        mesExtenso = 'OUT';
        break;
      case '11':
        mesExtenso = 'NOV';
        break;
      case '12':
        mesExtenso = 'DEZ';
        break;
    }

    var data = '';
    if (new Date().getFullYear().toString() != separaData[0]) {
      data = ' ' + separaData[0].substring(2, 4);
    }

    return mesExtenso + data;
  }

  getGeralViewValues() {
    var self = this;
    var valorDespesa;

    var current = new Date();
    var ano = current.getFullYear();
    var mes = current.getMonth() + 1;
    var path = current.getFullYear() + '-' + (mes.toString().length == 1 ? ('0' + mes) : mes);

    firebase.database().ref(this.PATH_GASTO + path + '/despesas/').on("child_added", function(despesa) {
      valorDespesa = self.decimalPipe.transform(despesa.val().valor, '1.2-2');
    });

    var valorCredito;
    firebase.database().ref(this.PATH_GASTO + path + '/creditos/').on("child_added", function(credito) {
      valorCredito = self.decimalPipe.transform(credito.val().valor, '1.2-2');
    });

    var geral = new GeralView();
    geral.title = this.getDataExtenso(path);
    geral.valor_despesas = (typeof valorDespesa === 'undefined' ? 0.0 : valorDespesa);
    geral.valor_creditos = (typeof valorCredito === 'undefined' ? 0.0 : valorCredito);
    geral.valor_total = this.decimalPipe.transform((geral.valor_creditos - geral.valor_despesas), '1.2-2');

    return geral;
  }
}
