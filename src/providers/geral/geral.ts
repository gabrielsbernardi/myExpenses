import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../auth/auth-service';
import { GraficoPieView } from './grafico-pie-view-values';

import * as firebase from 'firebase';
import { DecimalPipe } from '@angular/common';

/**
 * Gabriel Bernardi e Matheus Waltrich
 */
@Injectable()
export class GeralProvider {
  private PATH_CATEGORIA = 'categorias/' + this.auth.userLogged().uid + "/";
  private PATH_DESPESA = 'despesas/' + this.auth.userLogged().uid + "/";

  private pieValues: Array<GraficoPieView> = [];

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
    firebase.database().ref(this.PATH_DESPESA).on("child_added", function(despesa) {
      if (idCategoria == despesa.val().id_categoria) {
        valor += parseFloat(despesa.val().valor);
      }
    });

    return this.decimalPipe.transform(valor, '1.2-2');
  }
}
