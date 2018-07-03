import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms'
import { Camera, CameraOptions } from '@ionic-native/camera';

//Provider
import { DespesaProvider } from '../../../providers/despesa/despesa';

import { FirebaseApp } from 'angularfire2';

/**
 * Gabriel Bernardi e Matheus Waltrich
 */
@IonicPage()
@Component({
  selector: 'page-despesa-edit-nf',
  templateUrl: 'despesa-edit-nf.html',
})
export class DespesaEditNfPage {
  fileToUpload: any;
  title: string
  despesa: any;
  loader: any;

  referencia;
  arquivo;
  captureDataUrl: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private formBuilder: FormBuilder,
              private provider: DespesaProvider,
              private toast: ToastController,
              private camera: Camera,
              private laodingCtrl: LoadingController,
              private despesaProvider: DespesaProvider) {
    this.presentLoading("Carregando comprovante...");
    this.despesa = this.navParams.data.despesa;
    this.captureDataUrl = this.despesa.url_imagem 
    if (this.captureDataUrl == '') {
      this.captureDataUrl = null;
    }
    this.setupPageTitle();
    this.loader.dismiss();
  }

  // Configura o título da página
  private setupPageTitle() {
    this.title = 'Comprovante: ' + this.despesa.dsc;
  }

  // Abre a câmera e prepara para a captura da imagem
  capture() {
    const cameraOptions: CameraOptions = {
        quality: 50,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(cameraOptions).then((imageData) => {
      this.captureDataUrl = 'data:image/jpeg;base64,' + imageData;
      this.upload();
    }, (err) => {
    });
  }

  // Faz o upload da imagem e salva o caminho na despesa
  private upload() {
    this.presentLoading("Salvando comprovante...");
    this.despesa = this.despesaProvider.upload(this.despesa, this.captureDataUrl, this.loader);
    this.captureDataUrl = this.despesa.url_imagem;
    this.showMessage('Comprovante salvo com sucesso.')
  }

  // Remove a imagem
  remove() {
    this.presentLoading("Removendo comprovante...");
    this.despesa = this.despesaProvider.removeImage(this.despesa, this.loader, true);
    this.captureDataUrl = null;
    this.showMessage('Comprovante removido com sucesso.')
    this.loader.dismiss();
  }

  // Exibe a mensagem com o valor passado por parâmetro
  private showMessage(message: string) {
    this.toast.create({ message: message, duration: 3000})
            .present();
  }

  // Dialog de carregamento enquanto estiver fazendo
  // execuções com o firebase 
  private presentLoading(msg: string) {
    this.loader = this.laodingCtrl.create({
      content: msg
    });

    this.loader.present();
  }

}
