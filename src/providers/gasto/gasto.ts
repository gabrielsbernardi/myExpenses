import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../auth/auth-service';

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
      let path = this.PATH + (despesa.data_compra).substring(0, 7) + '/';

      if (edicao) {
        this.remove(path, despesa.key);
      }
      this.db.list(path)
          .push({ key: despesa.key,
                  dsc: despesa.dsc,
                  valor: despesa.valor,
                  data_compra: despesa.data_compra,
                  num_parcela: despesa.num_parcela })
          .then(() =>resolve());
    });
  }

  private remove(path: string, key: string) {
    return this.db.list(path).remove(key);
  }
}
