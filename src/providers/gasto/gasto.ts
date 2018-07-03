import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../auth/auth-service';

import { Gasto } from "./gasto-values";
import { DespesaView } from "../despesa/despesa-view-values"
import { GastoView } from "./gasto-view-values"

import * as firebase from 'firebase';

import { Observable } from 'rxjs/Observable';

import { DespesaProvider } from "../despesa/despesa"
import { DecimalPipe } from '@angular/common';
import { GastoRemocao } from './gasto-remocao';

/**
 * Gabriel Bernardi e Matheus Waltrich
 */
@Injectable()
export class GastoProvider {
  private PATH = 'gastos/' + this.auth.userLogged().uid + '/';
  private arrayGastos: Array<GastoView> = [];
  private separator: string = '_@_';

  constructor(private db: AngularFireDatabase,
              private auth: AuthService,
              private despesaProvider: DespesaProvider,
              private decimalPipe: DecimalPipe) { 
  }

  // Recupera todos os gastos e créditos separados pelos meses
  getAll() {
    this.arrayGastos = [];
    var self = this;
    var gastoView;

    var pathPrincipal = this.PATH
    var refPrincipal = firebase.database().ref(pathPrincipal);
    
    refPrincipal.on("child_added", function(pathData) {
      gastoView = new GastoView();
      gastoView.data = self.formatDataApresentacao(pathData.key);

      var path = pathPrincipal + pathData.key + '/despesas/';
      var ref = firebase.database().ref(path);
      var valorGasto = 0;

      // Recupera as despesas
      ref.on("child_added", function(gasto) {
        valorGasto += parseFloat(gasto.val().valor);
        if (typeof gastoView.ids_despesas !== 'undefined') {
          gastoView.ids_despesas += self.separator + gasto.val().id_despesa;
        } else {
          gastoView.ids_despesas = gasto.val().id_despesa;
        }
      });

      var pathCredito = pathPrincipal + pathData.key + '/creditos/';
      var ref = firebase.database().ref(pathCredito);
      var valorCredito = 0;

      // Recupera os créditos
      ref.on("child_added", function(credito) {
        valorCredito += parseFloat(credito.val().valor);
        if (typeof gastoView.ids_creditos !== 'undefined') {
          gastoView.ids_creditos += self.separator + credito.val().id_credito;
        } else {
          gastoView.ids_creditos = credito.val().id_credito;
        }
      });

      gastoView.valorGasto = self.decimalPipe.transform(valorGasto, '1.2-2');
      gastoView.valorCredito = self.decimalPipe.transform(valorCredito, '1.2-2');
      gastoView.valor = valorCredito - valorGasto;
      // Faz o cálculo para saber qual o valor gasto do mês
      gastoView.valorFormatado = self.decimalPipe.transform(valorCredito - valorGasto, '1.2-2');

      self.arrayGastos.push(gastoView);
    });

    return this.arrayGastos;
  }

  // Formata a data como por exemplo JAN 19
  private formatDataApresentacao(data: any) {
    var ano = data.substring(0, 4);
    var mes = data.substring(5, 7);

    var dataFormatada;
    var mydate=new Date()
    if (ano == mydate.getFullYear().toString()) {
      return this.getMesExtenso(mes);
    }

    return this.getMesExtenso(mes) + ' ' + ano.substring(2, 4);
  }

  // Obten o nome inicial do mês
  private getMesExtenso(mes: string) {
    switch(mes) {
      case '01':
          return 'JAN';
      case '02':
        return 'FEV';
      case '03':
          return 'MAR';
      case '04':
        return 'ABR';
      case '05':
          return 'MAI';
      case '06':
        return 'JUN';
      case '07':
          return 'JUL';
      case '08':
        return 'AGO';
      case '09':
          return 'SET';
      case '10':
        return 'OUT';
      case '11':
          return 'NOV';
      case '12':
        return 'DEZ';
    }
  }

  // Obtem o gasto específico
  get(key: string) {
    return this.db.object(this.PATH + key)
      .snapshotChanges()
      .map(gastos => {
        return { 
          key: gastos.payload.key,
          ...gastos.payload.val() }
      });
  }

  // Salva o gasto baseado na despesa passada
  // Salva conforme o número de parcelas informado
  saveDespesa(despesa: any) {
    return new Promise((resolve, reject) => {
      var anoMesCompra = (despesa.data_compra).substring(0, 7);
      var numParcela = parseInt(despesa.num_parcela);
      if (numParcela > 1) {
        var valor = (parseFloat(despesa.valor) / numParcela).toFixed(2);

        var gasto;
        var anoParcela = parseInt(anoMesCompra.substring(0, 4));
        var mesParcela = parseInt(anoMesCompra.substring(5, 7));
        for (var i = 0; i < numParcela; i++) {
          gasto = new Gasto();
          gasto.valor = valor;
          
          if (i == 0) {
            gasto.data = anoMesCompra;
          } else {
            var mesAux = mesParcela;
            mesParcela = this.getMesProximaParcela(mesParcela);
            anoParcela = this.getAnoProximaParcela(anoParcela, mesAux > mesParcela);
            gasto.data = this.getFormatarDataParcela(anoParcela, mesParcela);
          }

          this.db.list(this.PATH + gasto.data + '/despesas/')
          .push({ id_despesa: despesa.key,
                  id_categoria: despesa.id_categoria,
                  valor: gasto.valor,
                  data: gasto.data });
        }
      } else {
        this.db.list(this.PATH + anoMesCompra + '/despesas/')
          .push({ id_despesa: despesa.key,
                  id_categoria: despesa.id_categoria,
                  valor: despesa.valor,
                  data: anoMesCompra });
      }
    });
  }

  // Remove os gastos
  removeDespesa(idDespesa: string) {
    var pathPrincipal = this.PATH
    var refPrincipal = firebase.database().ref(pathPrincipal);
    var gastoRemocao = [];
    refPrincipal.on("child_added", function(pathData) {
      var path = pathPrincipal + pathData.key + '/despesas/';
      var ref = firebase.database().ref(path);
      ref.orderByChild('id_despesa').equalTo(idDespesa).on("child_added", function(gasto) {
        var gr = new GastoRemocao;
        gr.path = path;
        gr.key = gasto.key;
        gastoRemocao.push(gr);
      });
    });

    gastoRemocao.forEach(gr => {
      this.db.list(gr.path).remove(gr.key);
    });
  }
 
  // Formata a data da parcela
  private getFormatarDataParcela(anoCompra: number, mesCompra: number) {
    if (mesCompra.toString().length == 1) {
      return anoCompra + '-0' + mesCompra;
    }
    return anoCompra + '-' + mesCompra;
  } 

  // Serve para recuperar mes da próxima parcela
  private getMesProximaParcela(mesParcela: number) {
    if (mesParcela == 12) {
      return 1;
    }
    return mesParcela + 1;
  }

  // Serve para recuperar o ano da próxima parcela
  private getAnoProximaParcela(anoParcela: number, virarAno: boolean) {
    if (virarAno) {
      return anoParcela + 1;
    }
    return anoParcela;
  }

  // Salva o crédito no mês baseado no número de parcelas
  saveCredito(credito: any) {
    return new Promise((resolve, reject) => {
      var anoMesRecebimento = (credito.data_inicial_recebimento).substring(0, 7);
      var numParcela = parseInt(credito.num_parcela);
      if (numParcela > 1) {
        var valor = (parseFloat(credito.valor) / numParcela).toFixed(2);

        var gasto;
        var anoParcela = parseInt(anoMesRecebimento.substring(0, 4));
        var mesParcela = parseInt(anoMesRecebimento.substring(5, 7));
        for (var i = 0; i < numParcela; i++) {
          gasto = new Gasto();
          gasto.valor = valor;
          
          if (i == 0) {
            gasto.data = anoMesRecebimento;
          } else {
            var mesAux = mesParcela;
            mesParcela = this.getMesProximaParcela(mesParcela);
            anoParcela = this.getAnoProximaParcela(anoParcela, mesAux > mesParcela);
            gasto.data = this.getFormatarDataParcela(anoParcela, mesParcela);
          }

          this.db.list(this.PATH + gasto.data + '/creditos/')
          .push({ id_credito: credito.key,
                  valor: gasto.valor,
                  data: gasto.data });
        }
      } else {
        this.db.list(this.PATH + anoMesRecebimento + '/creditos/')
          .push({ id_credito: credito.key,
                  valor: credito.valor,
                  data: anoMesRecebimento });
      }
    });
  }

  // Remove o crédito
  removeCredito(idCredito: string) {
    var pathPrincipal = this.PATH
    var refPrincipal = firebase.database().ref(pathPrincipal);
    var self = this;
    var gastoRemocao = [];
    refPrincipal.on("child_added", function(pathData) {
      var path = pathPrincipal + pathData.key + '/creditos/';
      var ref = firebase.database().ref(path);
      ref.orderByChild('id_credito').equalTo(idCredito).on("child_added", function(gasto) {
        var gr = new GastoRemocao;
        gr.path = path;
        gr.key = gasto.key;
        gastoRemocao.push(gr);
      });
    });

    gastoRemocao.forEach(gr => {
      this.db.list(gr.path).remove(gr.key);
    });
  }
}
