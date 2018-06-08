import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Observable } from 'rxjs/Observable';
import { Content } from 'ionic-angular';

//Provider
import { DespesaProvider } from '../../../providers/despesa/despesa';
import { CategoriaProvider } from '../../../providers/categoria/categoria';
import { GastoProvider } from '../../../providers/gasto/gasto';
import { categoriaView } from '../../../providers/categoria/categoria-view-values';

/**
 * Gabriel Bernardi e Matheus Waltrich
 */
@IonicPage()
@Component({
  selector: 'page-despesa-edit',
  templateUrl: 'despesa-edit.html',
})
export class DespesaEditPage implements AfterViewInit {
  @ViewChild(Content) content: Content;
  form: FormGroup;
  despesa: any;
  categorias: Array<categoriaView> = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private formBuilder: FormBuilder,
              private provider: DespesaProvider,
              private toast: ToastController,
              private categoriaProvider: CategoriaProvider,
              private gastoProvider: GastoProvider) {
    this.categorias = this.categoriaProvider.getAllCategotiasViewValues();
    this.despesa = this.navParams.data.despesa || {};
    this.createForm();
  }

  ngAfterViewInit() {
    this.setupPage();
  }

  private setupPage() {
    if (this.despesa.key) {
      this.updateBtnImageNF();
    }
  }

  createForm() {
    this.form = this.formBuilder.group({
      key: [this.despesa.key],
      dsc: [this.despesa.dsc, Validators.required],
      valor: [this.despesa.valor, Validators.required],
      local_compra: [this.despesa.local_compra],
      data_compra: [this.despesa.data_compra, Validators.required],
      num_parcela: [this.despesa.num_parcela, Validators.required],
      id_categoria: [this.despesa.id_categoria, Validators.required]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.provider.save(this.form.value)
        .then((result: any) => {
          if (!this.form.value.key) {
            this.form.value.key = result;
            this.updateBtnImageNF();
          } else {
            this.gastoProvider.remove(this.despesa.key);
          }
          this.gastoProvider.save(this.form.value);
          this.showMessage('Despesa salva com sucesso.')
        })
        .catch((e) => {
          this.showMessage('Erro ao salvar a Despesa.');
          console.error(e);
        });
        this.despesa = this.form.value;
        this.createForm();
        this.content.scrollToTop();
    }
  }

  removeDespesa() {
    var key = this.form.value.key;
    this.provider.remove(this.despesa)
      .then(() => {
        this.gastoProvider.remove(key);
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

  private updateBtnImageNF() {
    document.getElementById("btnImageNF").hidden = false;
  }
}