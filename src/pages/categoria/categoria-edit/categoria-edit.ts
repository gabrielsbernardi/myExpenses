import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

//Provider
import { CategoriaProvider } from '../../../providers/categoria/categoria';

/**
 * Gabriel Bernardi e Matheus Waltrich
 */
@IonicPage()
@Component({
  selector: 'page-categoria-edit',
  templateUrl: 'categoria-edit.html',
})
export class CategoriaEditPage {
  title: string;
  form: FormGroup;
  categoria: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private formBuilder: FormBuilder,
              private provider: CategoriaProvider,
              private toast: ToastController) {
    this.categoria = this.navParams.data.categoria || {};
    this.createForm();
    this.setupPageTitle();
  }

  private setupPageTitle() {
    this.title = this.navParams.data.categoria ? 'Alteração da Categoria' : 'Nova Categoria'
  }

  createForm() {
    this.form = this.formBuilder.group({
      key: [this.categoria.key],
      tipo: [this.categoria.tipo, Validators.required],
      dsc: [this.categoria.dsc]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.provider.save(this.form.value)
        .then(() => {
          this.showMessage('Categoria salva com sucesso.');
          this.navCtrl.pop();
        })
        .catch((e) => {
          this.showMessage('Erro ao salvar a Categoria.');
          console.error(e);
        });
    }
  }

  private showMessage(message: string) {
    this.toast.create({ message: message, duration: 3000})
            .present();
  }
}