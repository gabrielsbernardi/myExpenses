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
              private despesaProvider: DespesaProvider) { 
  }

  getAll() {
    this.arrayGastos = [];
    var self = this;
    var gastoView;

    var pathPrincipal = this.PATH
    var refPrincipal = firebase.database().ref(pathPrincipal);
    
    //var parcela = 0;
    refPrincipal.on("child_added", function(pathData) {
      //parcela++;
      gastoView = new GastoView();
      gastoView.data = self.formatDataApresentacao(pathData.key);

      var path = pathPrincipal + pathData.key + '/despesas/';
      var ref = firebase.database().ref(path);
      var valorGasto = 0;

      ref.on("child_added", function(gasto) {
        valorGasto += parseFloat(gasto.val().valor);
        //var pos_parcela = '_parcela:@' + parcela;
        if (typeof gastoView.ids_despesas !== 'undefined') {
          gastoView.ids_despesas += self.separator + gasto.val().id_despesa// + pos_parcela;
        } else {
          gastoView.ids_despesas = gasto.val().id_despesa// + pos_parcela;
        }
      });

      var pathCredito = pathPrincipal + pathData.key + '/creditos/';
      var ref = firebase.database().ref(pathCredito);
      var valorCredito = 0;

      ref.on("child_added", function(credito) {
        valorCredito += parseFloat(credito.val().valor);
        //var pos_parcela = '_parcela:@' + parcela;
        if (typeof gastoView.ids_creditos !== 'undefined') {
          gastoView.ids_creditos += self.separator + credito.val().id_credito// + pos_parcela;
        } else {
          gastoView.ids_creditos = credito.val().id_credito// + pos_parcela;
        }
      });

      gastoView.valorGasto = valorGasto;
      gastoView.valorCredito = valorCredito;
      gastoView.valor = valorCredito - valorGasto;

      self.arrayGastos.push(gastoView);
    });

    return this.arrayGastos;
  }

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

  get(key: string) {
    return this.db.object(this.PATH + key)
      .snapshotChanges()
      .map(gastos => {
        return { 
          key: gastos.payload.key,
          ...gastos.payload.val() }
      });
  }

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
                  valor: gasto.valor,
                  data: gasto.data });
        }
      } else {
        this.db.list(this.PATH + anoMesCompra + '/despesas/')
          .push({ id_despesa: despesa.key,
                  valor: despesa.valor,
                  data: anoMesCompra })
          .then(() =>resolve());
      }
    });
  }

  removeDespesa(idDespesa: string) {
    var pathPrincipal = this.PATH
    var refPrincipal = firebase.database().ref(pathPrincipal);
    var self = this;
    refPrincipal.on("child_added", function(pathData) {
      var path = pathPrincipal + pathData.key + '/despesas/';
      var ref = firebase.database().ref(path);
      ref.orderByChild('id_despesa').equalTo(idDespesa).on("child_added", function(gasto) {
        self.db.list(path).remove(gasto.key);
      });
    });
  }

  private getFormatarDataParcela(anoCompra: number, mesCompra: number) {
    if (mesCompra.toString().length == 1) {
      return anoCompra + '-0' + mesCompra;
    }
    return anoCompra + '-' + mesCompra;
  } 

  private getMesProximaParcela(mesParcela: number) {
    if (mesParcela == 12) {
      return 1;
    }
    return mesParcela + 1;
  }

  private getAnoProximaParcela(anoParcela: number, virarAno: boolean) {
    if (virarAno) {
      return anoParcela + 1;
    }
    return anoParcela;
  }

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
                  data: anoMesRecebimento })
          .then(() =>resolve());
      }
    });
  }

  removeCredito(idCredito: string) {
    var pathPrincipal = this.PATH
    var refPrincipal = firebase.database().ref(pathPrincipal);
    var self = this;
    refPrincipal.on("child_added", function(pathData) {
      var path = pathPrincipal + pathData.key + '/creditos/';
      var ref = firebase.database().ref(path);
      ref.orderByChild('id_credito').equalTo(idCredito).on("child_added", function(gasto) {
        self.db.list(path).remove(gasto.key);
      });
    });
  }
}
