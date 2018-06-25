import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../auth/auth-service';
import * as firebase from 'firebase';
import { CreditoView } from './credito-view-values';
import { DecimalPipe } from '@angular/common';

/**
 * Gabriel Bernardi e Matheus Waltrich
 */
@Injectable()
export class CreditoProvider {
  private PATH = 'creditos/' + this.auth.userLogged().uid + "/";

  constructor(private db: AngularFireDatabase,
              private auth: AuthService,
              private decimalPipe: DecimalPipe) { 
  }

  getAll() {
    var self = this;
    return this.db.list(this.PATH, ref => ref.orderByChild('data_inicial_recebimento'))
      .snapshotChanges()
      .map(changes => {
        return changes.map(credito => ({
          key: credito.payload.key,
          valor_formatado: self.decimalPipe.transform(credito.payload.val().valor, '1.2-2'),
          data_formatada: self.formatDate(credito.payload.val().data_inicial_recebimento),
          ...credito.payload.val()
        }));
      });
  }

  private formatDate(d) {
    var date = new Date(d);
    let month = String(date.getMonth() + 1);
    let day = String(date.getDate());
    const year = String(date.getFullYear());

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return `${day}/${month}/${year}`;
  }

  get(key: string) {
    return this.db.object(this.PATH + key)
      .snapshotChanges()
      .map(credito => {
        return { 
          key: credito.payload.key,
          ...credito.payload.val() }
      });
  }

  getCreditoViewValues(idDespesa: string) {
    var self = this;
    var credito;
    firebase.database().ref(this.PATH).on("child_added", function(c) {
      if (c.key == idDespesa) {
        credito = new CreditoView();
        credito.dsc = c.val().dsc;
        credito.data = c.val().data_inicial_recebimento;
        credito.valor = self.decimalPipe.transform((c.val().valor / c.val().num_parcela), '1.2-2');
        return credito;
      }
    });
    return credito;
  }

  save(credito: any) {
    return new Promise((resolve, reject) => {
      if (credito.key) {
        this.db.list(this.PATH)
          .update(credito.key, { dsc: credito.dsc, 
                                 valor: credito.valor,
                                 data_inicial_recebimento: credito.data_inicial_recebimento,
                                 num_parcela: credito.num_parcela})
          .then((result: any) => resolve(credito.key))
          .catch((e) => reject(e));
      } else {
        this.db.list(this.PATH)
          .push({ dsc: credito.dsc, 
                  valor: credito.valor,
                  data_inicial_recebimento: credito.data_inicial_recebimento,
                  num_parcela: credito.num_parcela })
          .then((result: any) => resolve(result.key))
      }
    });
  }

  remove(key: string) {
    return this.db.list(this.PATH).remove(key);
  }
}