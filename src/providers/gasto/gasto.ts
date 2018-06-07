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

    refPrincipal.on("child_added", function(pathData) {
      gastoView = new GastoView();
      gastoView.data = self.formatDataApresentacao(pathData.key);

      var path = pathPrincipal + pathData.key + '/';
      var ref = firebase.database().ref(path);
      var valor = 0;

      ref.on("child_added", function(gasto) {
        valor += parseFloat(gasto.val().valor);
        if (typeof gastoView.ids_despesas !== 'undefined') {
          gastoView.ids_despesas += self.separator + gasto.val().id_despesa;
        } else {
          gastoView.ids_despesas = gasto.val().id_despesa;
        }
      });

      gastoView.key = '123'
      gastoView.valor = valor;

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

  save(despesa: any) {
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

          this.db.list(this.PATH + gasto.data + '/')
          .push({ id_despesa: despesa.key,
                  valor: gasto.valor,
                  data: gasto.data });
        }
      } else {
        this.db.list(this.PATH + anoMesCompra + '/')
          .push({ id_despesa: despesa.key,
                  valor: despesa.valor,
                  data: anoMesCompra })
          .then(() =>resolve());
      }
    });
  }

  remove(idDespesa: string) {
    var pathPrincipal = this.PATH
    var refPrincipal = firebase.database().ref(pathPrincipal);
    var self = this;
    refPrincipal.on("child_added", function(pathData) {
      var path = pathPrincipal + pathData.key + '/';
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
}
