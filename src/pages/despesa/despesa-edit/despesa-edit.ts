import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Observable } from 'rxjs/Observable';

//Provider
import { DespesaProvider } from '../../../providers/despesa/despesa';
import { CategoriaProvider } from '../../../providers/categoria/categoria';

/**
 * Gabriel Bernardi e Matheus Waltrich
 */
@IonicPage()
@Component({
  selector: 'page-despesa-edit',
  templateUrl: 'despesa-edit.html',
})
export class DespesaEditPage {
  title: string;
  form: FormGroup;
  despesa: any;
  categorias: Observable<any>;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private formBuilder: FormBuilder,
              private provider: DespesaProvider,
              private toast: ToastController,
              private categoriaProvider: CategoriaProvider) {
    this.categorias = this.categoriaProvider.getAll();
    this.despesa = this.navParams.data.despesa || {};
    this.createForm();
    this.setupPageTitle();
  }

  private setupPageTitle() {
    this.title = this.navParams.data.despesa ? 'Alteração de Despesa' : 'Nova Despesa'
  }

  createForm() {
    this.form = this.formBuilder.group({
      key: [this.despesa.key],
      dsc: [this.despesa.dsc, Validators.required],
      valor: [this.despesa.valor, Validators.required],
      local_compra: [this.despesa.local_compra],
      data_compra: [this.despesa.data_compra, Validators.required],
      num_parcela: [this.despesa.num_parcela, Validators.required]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.provider.save(this.form.value)
        .then((result: any) => {
          console.log(result);
          this.showMessage('Despesa salva com sucesso.');
        })
        .catch((e) => {
          this.showMessage('Erro ao salvar a Despesa.');
          console.error(e);
        });
    }
  }

  removeDespesa() {
    this.provider.remove(this.despesa)
      .then(() => {
        this.showMessage('Despesa removida com sucesso');
        this.navCtrl.pop();
      })
      .catch((e) => {
        this.showMessage('Erro ao remover a Despesa.')
      });
  }

  editDespesaNF() {
    this.navCtrl.push('DespesaEditNfPage', {despesa: this.despesa});
  }

  private showMessage(message: string) {
    this.toast.create({ message: message, duration: 3000})
            .present();
  }
}