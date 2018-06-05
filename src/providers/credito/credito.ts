import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../auth/auth-service';

/**
 * Gabriel Bernardi e Matheus Waltrich
 */
@Injectable()
export class CreditoProvider {
  private PATH = 'creditos/' + this.auth.userLogged().uid + "/";

  constructor(private db: AngularFireDatabase,
              private auth: AuthService) { 
  }

  getAll() {
    return this.db.list(this.PATH, ref => ref.orderByChild('data_inicial_recebimento'))
      .snapshotChanges()
      .map(changes => {
        return changes.map(credito => ({
          key: credito.payload.key,
          ...credito.payload.val()
        }));
      });
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

  save(credito: any) {
    return new Promise((resolve, reject) => {
      if (credito.key) {
        this.db.list(this.PATH)
          .update(credito.key, { dsc: credito.dsc, 
                                 valor: credito.valor,
                                 data_inicial_recebimento: credito.data_inicial_recebimento,
                                 num_parcela: credito.num_parcela})
          .then(() => resolve())
          .catch((e) => reject(e));
      } else {
        this.db.list(this.PATH)
          .push({ dsc: credito.dsc, 
                  valor: credito.valor,
                  data_inicial_recebimento: credito.data_inicial_recebimento,
                  num_parcela: credito.num_parcela })
          .then(() => resolve());
      }
    });
  }

  remove(key: string) {
    return this.db.list(this.PATH).remove(key);
  }
}
