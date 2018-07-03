import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
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
  exibirFabBtnOptions: boolean = false;
  title: string;
  loader: any;

  private dataAntiga;
  private numParcelasAntiga;
  private valorAntigo;
  private categoriaAntiga;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private formBuilder: FormBuilder,
              private provider: DespesaProvider,
              private toast: ToastController,
              private categoriaProvider: CategoriaProvider,
              private gastoProvider: GastoProvider,
              private laodingCtrl: LoadingController) {
    this.presentLoading("Carregando despesa...");
    this.categorias = this.categoriaProvider.getAllCategotiasViewValues();
    this.despesa = this.navParams.data.despesa || {};
    if (this.despesa) {
      this.dataAntiga = this.despesa.data_compra;
      this.numParcelasAntiga = this.despesa.num_parcela;
      this.valorAntigo = this.despesa.valor;
      this.categoriaAntiga = this.despesa.id_categoria;
    }
    this.createForm();
    this.setupPageTitle();
    this.exibirFabBtnOptions = this.despesa.key;
    this.loader.dismiss();
  }

  // Configura o título da página
  private setupPageTitle() {
    this.title = this.navParams.data.despesa ? 'Alteração da Despesa' : 'Nova Despesa'
  }

  ngAfterViewInit() {
    this.setupPage();
  }

  // Verifica se é para mostrar o ícone de edição do comprovante
  private setupPage() {
    if (this.despesa.key) {
      this.updateBtnImageNF();
    }
  }

  // Cria os valores que devem ser utilizados na tela
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

  // Salva as despesas e calcula as despesas mensais
  // Caso for uma edição é verificado se houve alterações
  // na data, número de parcelas, categoria ou o valor
  // Se true então atualiza o calculo das despesas mensais
  // Senão apenas salva. 
  onSubmit() {
    if (this.form.valid) {
      this.presentLoading("Salvando despesa...");
      var salvarGastos = false;
      this.provider.save(this.form.value)
        .then((result: any) => {
          if (!this.despesa.key) {
            this.form.value.key = result;
            this.updateBtnImageNF();
            this.exibirFabBtnOptions = true;
            salvarGastos = true;
          }
          this.despesa = this.form.value;
          this.showMessage('Despesa salva com sucesso.')
        })
        .then(() => {
          if (salvarGastos) {
            this.gastoProvider.saveDespesa(this.form.value);
          } else {
            this.atualizarGastos();
          }

          this.createForm();
          this.dataAntiga = this.despesa.data_compra;
          this.numParcelasAntiga = this.despesa.num_parcela;
          this.valorAntigo = this.despesa.valor;
          this.categoriaAntiga = this.despesa.id_categoria;

          this.content.scrollToTop();
          this.setupPageTitle();
          this.loader.dismiss();
        })
        .catch((e) => {
          this.showMessage('Erro ao salvar a Despesa.');
          console.error(e);
        });
    }
  }

  // Método para atualizar os gastos mensais
  private atualizarGastos() {
    if (this.despesa.key && (this.dataAntiga != this.despesa.data_compra 
          || this.numParcelasAntiga != this.despesa.num_parcela
          || this.valorAntigo != this.despesa.valor
          || this.categoriaAntiga != this.despesa.id_categoria)) {
      this.gastoProvider.removeDespesa(this.despesa.key);
      this.gastoProvider.saveDespesa(this.despesa);
    }
  }

  // Remove os despesas
  removeDespesa() {
    this.presentLoading("Removendo despesa...");
    var despesaAux = this.form.value;
    this.provider.remove(this.despesa)
      .then(() => {
        this.gastoProvider.removeDespesa(despesaAux);
        this.loader.dismiss();
        this.showMessage('Despesa removida com sucesso');
        this.navCtrl.pop();
      })
      .catch((e) => {
        this.showMessage('Erro ao remover a Despesa.')
      });
  }

  // Redireciona para a tela de edição de comprovante
  editDespesaNF() {
    this.navCtrl.push('DespesaEditNfPage', {despesa: this.despesa});
  }

  // Exibe a mensagem com o valor passado por parâmetro
  private showMessage(message: string) {
    this.toast.create({ message: message, duration: 3000})
            .present();
  }

  // Exibe o botão de adicionar comprovante
  private updateBtnImageNF() {
    document.getElementById("btnImageNF").hidden = false;
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