import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms'
import { ImagePicker } from '@ionic-native/image-picker';

//Provider
import { DespesaProvider } from '../../../providers/despesa/despesa';

/**
 * Gabriel Bernardi e Matheus Waltrich
 */
@IonicPage()
@Component({
  selector: 'page-despesa-edit-nf',
  templateUrl: 'despesa-edit-nf.html',
})
export class DespesaEditNfPage {

  imgPath: string;
  fileToUpload: any;
  title: string
  despesa: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private formBuilder: FormBuilder,
              private provider: DespesaProvider,
              private toast: ToastController,
              private imagePicker: ImagePicker) {
    this.despesa = this.navParams.data.despesa;
    this.imgPath = this.despesa.url || {};
    this.setupPageTitle();
  }

  private setupPageTitle() {
    this.title = 'Comprovante: ' + this.despesa.dsc;
  }

  escolherFoto() {
    this.imagePicker.hasReadPermission()
      .then(hasPermission => {
        if (hasPermission) {
          this.pegarImagem();
        } else {
          this.solicitarPermissao();
        }
      })
      .catch((error) => {
        console.error('Erro ao verificar permissão', error);
      })
  }

  solicitarPermissao() {
    this.imagePicker.requestReadPermission()
      .then(hasPermission => {
        if (hasPermission) {
          this.pegarImagem();
        } else {
          console.error('Permissão negada.');
        }
      })
      .catch((error) => {
        console.log('Erro ao solicitar permissão', error);
      })
  }

  pegarImagem() {
    this.imagePicker.getPictures({
      maximumImagesCount: 1,
      outputType: 1 //base64
    })
      .then(results => {
        if (results.length > 0) {
          this.imgPath = 'data:image/png;base64,' + results[0];
          this.fileToUpload = results[0];
        } else {
          this.imgPath = '';
          this.fileToUpload = null;
          console.error('Permissão negada.');
        }
      })
      .catch((error) => {
        console.log('Erro ao recuperar a imagem', error);
      })
  }

  onSubmit() {
      this.provider.uploadAndSave({
        key: this.despesa.key,
        fileToUpload: this.fileToUpload
      });
      this.navCtrl.pop();
  }

  private showMessage(message: string) {
    this.toast.create({ message: message, duration: 3000})
            .present();
  }
}
