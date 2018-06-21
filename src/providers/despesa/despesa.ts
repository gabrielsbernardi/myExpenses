import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../auth/auth-service';
import { FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase';

import { DespesaView } from './despesa-view-values';
import { DecimalPipe } from '@angular/common';

/**
 * Gabriel Bernardi e Matheus Waltrich
 */
@Injectable()
export class DespesaProvider {
  private PATH = 'despesas/' + this.auth.userLogged().uid + '/';

  constructor(private db: AngularFireDatabase,
              private auth: AuthService,
              private fb: FirebaseApp,
              private decimalPipe: DecimalPipe) { 
  }

  getAll() {
    return this.db.list(this.PATH, ref => ref.orderByChild('data_compra'))
      .snapshotChanges()
      .map(changes => {
        return changes.map(despesa => ({
          key: despesa.payload.key,
          ...despesa.payload.val()
        }));
      });
  }

  getDespesaViewValues(idDespesa: string) {
    var self = this;
    var despesa;
    firebase.database().ref(this.PATH).on("child_added", function(d) {
      if (d.key == idDespesa) {
        despesa = new DespesaView();
        despesa.dsc = d.val().dsc;
        despesa.data = d.val().data_compra;
        despesa.valor = self.decimalPipe.transform((d.val().valor / d.val().num_parcela), '1.2-2');
        return despesa;
      }
    });
    return despesa;
  }

  get(key: string) {
    return this.db.object(this.PATH + key)
      .snapshotChanges()
      .map(despesa => {
        return { 
          key: despesa.payload.key,
          ...despesa.payload.val() }
     });
  }

  save(despesa: any) {
    return new Promise((resolve, reject) => {
      if (despesa.key) {
        this.db.list(this.PATH)
          .update(despesa.key, { dsc: despesa.dsc,
                                 valor: despesa.valor,
                                 local_compra: despesa.local_compra,
                                 data_compra: despesa.data_compra,
                                 num_parcela: despesa.num_parcela,
                                 id_categoria: despesa.id_categoria })
          .then((result: any) => resolve(despesa.key))
          .catch((e) => reject(e));
      } else {
        this.db.list(this.PATH)
          .push({ dsc: despesa.dsc,
                  valor: despesa.valor,
                  local_compra: despesa.local_compra,
                  data_compra: despesa.data_compra,
                  num_parcela: despesa.num_parcela,
                  id_categoria: despesa.id_categoria })
          .then((result: any) => resolve(result.key));
      }
    });
  }

  remove(item: any) {
    return this.db.list(this.PATH).remove(item.key);
  }

  savePhoto(despesa, image) {
    const pictures = this.fb.storage().ref('pictures/' + despesa.key);
    pictures.putString(image, 'data_url');
  }
}