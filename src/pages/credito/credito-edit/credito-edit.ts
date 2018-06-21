import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

//Provider
import { CreditoProvider } from '../../../providers/credito/credito';
import { GastoProvider } from '../../../providers/gasto/gasto';

/**
 * Gabriel Bernardi e Matheus Waltrich
 */
@IonicPage()
@Component({
  selector: 'page-credito-edit',
  templateUrl: 'credito-edit.html',
})
export class CreditoEditPage {
  title: string;
  form: FormGroup;
  credito: any;
  exibirFabBtnOptions: boolean = false;

  private dataAntiga;
  private numParcelasAntiga;
  private valorAntigo;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private formBuilder: FormBuilder,
              private provider: CreditoProvider,
              private toast: ToastController,
              private gastoProvider: GastoProvider) {
    this.credito = this.navParams.data.credito || {};
    if (this.credito) {
      this.dataAntiga = this.credito.data_inicial_recebimento;
      this.numParcelasAntiga = this.credito.num_parcela;
      this.valorAntigo = this.credito.valor;
    }
    this.createForm();
    this.setupPageTitle();
    this.exibirFabBtnOptions = this.credito.key;
  }

  private setupPageTitle() {
    this.title = this.navParams.data.credito ? 'Alteração da Crédito' : 'Novo Crédito'
  }

  createForm() {
    this.form = this.formBuilder.group({
      key: [this.credito.key],
      dsc: [this.credito.dsc, Validators.required],
      valor: [this.credito.valor, Validators.required],
      data_inicial_recebimento: [this.credito.data_inicial_recebimento, Validators.required],
      num_parcela: [this.credito.num_parcela, Validators.required]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      var salvarGastos = false;
      this.provider.save(this.form.value)
        .then((result: any) => {
          if (!this.credito.key) {
            this.form.value.key = result;
            salvarGastos = true;
          }

          this.credito = this.form.value;
          this.showMessage('Crédito salvo com sucesso.');
        })
        .then(() => {
          if (salvarGastos) {
            this.gastoProvider.saveCredito(this.form.value);
          } else {
            this.atualizarGastos();
          }
          this.navCtrl.pop();
        })
        .catch((e) => {
          this.showMessage('Erro ao salvar o Crédito.');
          console.error(e);
        });
    }
  }

  private atualizarGastos() {
    if (this.credito.key && (this.dataAntiga != this.credito.data_inicial_recebimento 
          || this.numParcelasAntiga != this.credito.num_parcela
          || this.valorAntigo != this.credito.valor)) {
        this.gastoProvider.removeCredito(this.credito.key);
        this.gastoProvider.saveCredito(this.credito);
    }
  }

  removeCredito() {
    var key = this.form.value.key;
    this.provider.remove(this.credito.key)
      .then(() => {
        this.gastoProvider.removeCredito(key);
        this.showMessage('Crédito removido com sucesso');
        this.navCtrl.pop();
      })
      .catch((e) => {
        this.showMessage('Erro ao remover o Crédito.')
      });
  }

  private showMessage(message: string) {
    this.toast.create({ message: message, duration: 3000})
            .present();
  }
}
