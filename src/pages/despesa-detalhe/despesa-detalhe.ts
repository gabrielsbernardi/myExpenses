import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DespesasService } from '../../services/despesas.service';

/**
 * Generated class for the DespesaDetalhePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-despesa-detalhe',
  templateUrl: 'despesa-detalhe.html',
})
export class DespesaDetalhePage {
  id = null;
  despesa:any = {id: "", descricao: "", valor: "", data: ""};
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private despesasService: DespesasService) {
    this.id = navParams.get('id');

    if (this.id != 0) {
      //this.despesa = despesasService.getDespesa(this.id);
      despesasService.getDespesa(this.id)
        .subscribe((despesa) => {
          this.despesa = despesa;
        },
        (error) => console.log(error)
      );
    } else {
      this.despesa = {id: "", descricao: "", valor: "", data: ""};
    }
    console.log(this.despesa);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DespesaDetalhePage');
  }

  salvarDespesa() {
    if (this.despesa.id == "") {
      this.despesa.id = Date.now();
    }
    this.despesasService.store(this.despesa);
    alert("Salvo com succeso!");
  }

  excluirDespesa() {
    this.despesasService.excluirDespesa(this.despesa.id);
    console.log(this.despesa);
    alert("Exluído com succeso!");
  }
}
