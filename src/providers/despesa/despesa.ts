import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../auth/auth-service';
import { FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase';

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

  // Recupera todas as despesas
  getAll() {
    var self = this;
    return this.db.list(this.PATH, ref => ref.orderByChild('data_compra'))
      .snapshotChanges()
      .map(changes => {
        return changes.map(despesa => ({
          key: despesa.payload.key,
          valor_formatado: self.decimalPipe.transform(despesa.payload.val().valor, '1.2-2'),
          data_formatada: self.formatDate(despesa.payload.val().data_compra),
          ...despesa.payload.val()
        }));
      });
  }

  // Formata a data no padrão dd/MM/yyyy
  private formatDate(d) {
    var date = new Date(d);
    let month = String(date.getMonth() + 1);
    let day = String(date.getDate());
    const year = String(date.getFullYear());

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return `${day}/${month}/${year}`;
  }

  // Recupera uma despesa específica
  get(key: string) {
    return this.db.object(this.PATH + key)
      .snapshotChanges()
      .map(despesa => {
        return { 
          key: despesa.payload.key,
          ...despesa.payload.val() }
     });
  }

  // Salva a despesa
  save(despesa: any) {
    return new Promise((resolve, reject) => {
      if (!despesa.url_imagem) {
        despesa.url_imagem = '';
      }

      if (!despesa.url_local_compraimagem) {
        despesa.local_compra = '';
      }

      if (!despesa.nome_imagem) {
        despesa.nome_imagem = '';
      }

      if (despesa.key) {
        this.db.list(this.PATH)
          .update(despesa.key, { dsc: despesa.dsc,
                                 valor: despesa.valor,
                                 local_compra: despesa.local_compra,
                                 data_compra: despesa.data_compra,
                                 num_parcela: despesa.num_parcela,
                                 id_categoria: despesa.id_categoria,
                                 url_imagem: despesa.url_imagem,
                                 nome_imagem: despesa.nome_imagem })
          .then((result: any) => resolve(despesa.key))
          .catch((e) => reject(e));
      } else {
        this.db.list(this.PATH)
          .push({ dsc: despesa.dsc,
                  valor: despesa.valor,
                  local_compra: despesa.local_compra,
                  data_compra: despesa.data_compra,
                  num_parcela: despesa.num_parcela,
                  id_categoria: despesa.id_categoria,
                  url_imagem: despesa.url_imagem,
                  nome_imagem: despesa.nome_imagem })
          .then((result: any) => resolve(result.key));
      }
    });
  }

  // Remove a despesa
  remove(item: any) {
    this.removeImage(item, null, false);
    return this.db.list(this.PATH).remove(item.key);
  }

  // Faz o upload do comprovante e seta o caminho da imagem na despesa
  upload(despesa: any, captureDataUrl: string, loader: any) {
    var self = this;
    let storageRef = firebase.storage().ref();
    const filename = Math.floor(Date.now() / 1000);
    const imageRef = storageRef.child(`comprovates/${this.auth.userLogged().uid}/${filename}.jpg`);
    imageRef.putString(captureDataUrl, firebase.storage.StringFormat.DATA_URL).then((snapshot)=> {
      despesa.url_imagem = snapshot.downloadURL;
      despesa.nome_imagem = filename;
      self.save(despesa);
      loader.dismiss();
      return despesa;
    });
  }

  // Remove a imagem da despesa e exclui da storage
  removeImage(despesa: any, loader: any, salvarDespesa: boolean) {
    var self = this;
    let storageRef = firebase.storage().ref();
    const imageRef = storageRef.child(`comprovates/${this.auth.userLogged().uid}/${despesa.nome_imagem}.jpg`);
    imageRef.delete().then(function() {
      if (salvarDespesa) {
        despesa.url_imagem = '';
        despesa.nome_imagem = '';
        self.save(despesa);
        loader.dismiss();
        return despesa;
      }
    }).catch(function(error) {
    });
  }
}
