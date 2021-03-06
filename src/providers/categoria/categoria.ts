import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../auth/auth-service';

import * as firebase from 'firebase';
import { categoriaView } from './categoria-view-values';

/**
 * Gabriel Bernardi e Matheus Waltrich
 */
@Injectable()
export class CategoriaProvider {
  private PATH = 'categorias/' + this.auth.userLogged().uid + "/";

  constructor(private db: AngularFireDatabase,
              private auth: AuthService) { 
  }

  // Recupera todas as categorias
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

  // Recupera um objeto com todos os dados da categoria
  getAllCategotiasViewValues() {
    var categorias: Array<categoriaView> = [];
    firebase.database().ref(this.PATH).on("child_added", function(c) {
      var categoria = new categoriaView();
      categoria.key = c.key;
      categoria.tipo = c.val().tipo;
      categorias.push(categoria);
    });
    return categorias;
  }

  // Recupera uma categoia específica
  get(key: string) {
    return this.db.object(this.PATH + key)
      .snapshotChanges()
      .map(c => {
        return { 
          key: c.payload.key,
          ...c.payload.val() }
      });
  }

  // Salva a categoria
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

  // Remove a categoria
  remove(key: string) {
    return this.db.list(this.PATH).remove(key);
  }
}
