import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../auth/auth-service';

import * as firebase from 'firebase';

/**
 * Gabriel Bernardi e Matheus Waltrich
 */
@Injectable()
export class GastoProvider {
  private PATH = 'gastos/' + this.auth.userLogged().uid + '/';

  constructor(private db: AngularFireDatabase,
              private auth: AuthService) { 
  }

  getAll() {
    return this.db.list(this.PATH, ref => ref.orderByChild('data'))
      .snapshotChanges()
      .map(changes => {
        return changes.map(gastos => ({
          key: gastos.payload.key,
          ...gastos.payload.val()
        }));
      });
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

  save(despesa: any, edicao: boolean) {
    return new Promise((resolve, reject) => {
      var mesDiaCompra = (despesa.data_compra).substring(0, 7);

      var numParcela = parseInt(despesa.num_parcela);
      if (numParcela > 1) {
        if (edicao) {
          this.remove( despesa.key);
        }
      } else {
        this.db.list(this.PATH)
          .push({ key: despesa.key + '_' + mesDiaCompra,
                  dsc: despesa.dsc,
                  valor: despesa.valor,
                  data_compra: despesa.data_compra,
                  num_parcela: despesa.num_parcela })
          .then(() =>resolve());
      }
    });
  }

  private remove( key: string) {
    var ref = firebase.database().ref(this.PATH);
    ref.orderByKey().startAt(key).on("child_added", function(snapshot) {
      console.log(snapshot.key);
    });

    return this.db.list(this.PATH).remove(key);
  }
}
