import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../auth/auth-service';
import { FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase';

import { GastoProvider } from '../gasto/gasto'

/**
 * Gabriel Bernardi e Matheus Waltrich
 */
@Injectable()
export class DespesaProvider {
  private PATH = 'despesas/' + this.auth.userLogged().uid + '/';

  constructor(private db: AngularFireDatabase,
              private auth: AuthService,
              private fb: FirebaseApp,
              private gastoProvider: GastoProvider) { 
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
                                 num_parcela: despesa.num_parcela })
          .then((result: any) => resolve(despesa.key))
          .catch((e) => reject(e));
      } else {
        this.db.list(this.PATH)
          .push({ dsc: despesa.dsc,
                  valor: despesa.valor,
                  local_compra: despesa.local_compra,
                  data_compra: despesa.data_compra,
                  num_parcela: despesa.num_parcela })
          .then((result: any) => resolve(result.key));
      }
    });
  }

  remove(item: any) {
    return this.db.list(this.PATH).remove(item.key)
      .then(() => {
        if (item.fullPath) {
          this.removeFile(item.fullPath);
        }
      });
  }

  public uploadAndSave(item: any) {
    let despesa = { key: item.key, url: '', fullPath: ''}

    let storageRef = this.fb.storage().ref();
    let basePath = '/despesas/' + this.auth.userLogged().uid + '/';
    despesa.fullPath = basePath + despesa.key + '.png';

    let uploadTask = storageRef.child(despesa.fullPath).putString(item.fileToUpload, 'base64');

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, 
      (snapshot) => {
        var progress = (uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes) * 100;
        console.log(progress + "% done");
      },
      (error) => {
        console.log(error);
      },
      () => {
        despesa.url = uploadTask.snapshot.downloadURL;
        return new Promise((resolve, reject) => {
            this.db.list(this.PATH)
              .update(despesa.key, { url: despesa.url, fullPath: despesa.fullPath })
              .then(() => resolve())
              .catch((e) => reject(e));
        });
      } 
    )
  }

  removeFile(fullPath: string) {
    let storageRef = this.fb.storage().ref();
    storageRef.child(fullPath).delete();
  }
}