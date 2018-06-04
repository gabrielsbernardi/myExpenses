import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../auth/auth-service';

/**
 * Gabriel Bernardi e Matheus Waltrich
 */
@Injectable()
export class CategoriaProvider {
  private PATH = 'categorias/' + this.auth.userLogged().uid + "/";

  constructor(private db: AngularFireDatabase,
              private auth: AuthService) { 
  }

  getAll() {
    return this.db.list(this.PATH, ref => ref.orderByChild('tipo'))
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({
          key: c.payload.key,
          ...c.payload.val()
        }));
      });
  }

  get(key: string) {
    return this.db.object(this.PATH + key)
      .snapshotChanges()
      .map(c => {
        return { 
          key: c.payload.key,
          ...c.payload.val() }
      });
  }

  save(categoria: any) {
    return new Promise((resolve, reject) => {
      if (categoria.key) {
        this.db.list(this.PATH)
          .update(categoria.key, { tipo: categoria.tipo, 
                                   dsc: categoria.dsc })
          .then(() => resolve())
          .catch((e) => reject(e));
      } else {
        this.db.list(this.PATH)
          .push({ tipo: categoria.tipo, 
                  dsc: categoria.dsc })
          .then(() => resolve());
      }
    });
  }

  remove(key: string) {
    return this.db.list(this.PATH).remove(key);
  }
}
