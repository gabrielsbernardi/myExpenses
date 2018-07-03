import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
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
  loader: any;

  private dataAntiga;
  private numParcelasAntiga;
  private valorAntigo;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private formBuilder: FormBuilder,
              private provider: CreditoProvider,
              private toast: ToastController,
              private gastoProvider: GastoProvider,
              private laodingCtrl: LoadingController) {
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
  
  // Configura o título da página
  private setupPageTitle() {
    this.title = this.navParams.data.credito ? 'Alteração da Crédito' : 'Novo Crédito'
  }

  // Cria os valores que devem ser utilizados na tela
  createForm() {
    this.form = this.formBuilder.group({
      key: [this.credito.key],
      dsc: [this.credito.dsc, Validators.required],
      valor: [this.credito.valor, Validators.required],
      data_inicial_recebimento: [this.credito.data_inicial_recebimento, Validators.required],
      num_parcela: [this.credito.num_parcela, Validators.required]
    });
  }

  // Salva os créditos e calcula as despesas mensais
  // Caso for uma edição é verificado se houve alterações
  // na data, número de parcelas ou o valor
  // Se true então atualiza o calculo das despesas mensais
  // Senão apenas salva. 
  onSubmit() {
    if (this.form.valid) {
      this.presentLoading("Salvando crédito...");
      var salvarGastos = false;
      this.provider.save(this.form.value)
        .then((result: any) => {
          if (!this.credito.key) {
            this.form.value.key = result;
            salvarGastos = true;
          }

          this.credito = this.form.value;
        })
        .then(() => {
          if (salvarGastos) {
            this.gastoProvider.saveCredito(this.form.value);
          } else {
            this.atualizarGastos();
          }

          this.loader.dismiss();
          this.showMessage('Crédito salvo com sucesso.');
          this.navCtrl.pop();
        })
        .catch((e) => {
          this.showMessage('Erro ao salvar o Crédito.');
          console.error(e);
        });
    }
  }

  // Método para atualizar os gastos mensais
  private atualizarGastos() {
    if (this.credito.key && (this.dataAntiga != this.credito.data_inicial_recebimento 
          || this.numParcelasAntiga != this.credito.num_parcela
          || this.valorAntigo != this.credito.valor)) {
        this.gastoProvider.removeCredito(this.credito.key);
        this.gastoProvider.saveCredito(this.credito);
    }
  }

  // Remove os créditos
  removeCredito() {
    this.presentLoading("Removendo crédito...");
    var key = this.form.value.key;
    this.provider.remove(this.credito.key)
      .then(() => {
        this.gastoProvider.removeCredito(key);
        this.loader.dismiss();
        this.showMessage('Crédito removido com sucesso');
        this.navCtrl.pop();
      })
      .catch((e) => {
        this.showMessage('Erro ao remover o Crédito.')
      });
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
