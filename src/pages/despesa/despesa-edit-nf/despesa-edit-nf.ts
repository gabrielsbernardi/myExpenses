import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms'
import { Camera, CameraOptions } from '@ionic-native/camera';

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
              private camera: Camera) {
    this.despesa = this.navParams.data.despesa;
    this.imgPath = this.despesa.url || {};
    this.setupPageTitle();
  }

  private setupPageTitle() {
    this.title = 'Comprovante: ' + this.despesa.dsc;
  }

  takePhoto() {
    try {
      const options: CameraOptions = {
        quality: 100,
        targetHeight: 600,
        targetWidth: 600,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true
      }

      const result = this.camera.getPicture(options);
      const image = 'data:image/jpeg;base64,${result}';

      this.provider.savePhoto(this.despesa, image);
    } catch (e) {
      console.error(e);
    }
  }

  private showMessage(message: string) {
    this.toast.create({ message: message, duration: 3000})
            .present();
  }
}
