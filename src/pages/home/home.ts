import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DespesasService } from '../../services/despesas.service';
import { DespesaDetalhePage } from '../despesa-detalhe/despesa-detalhe';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  despesas = [];
  constructor(private navCtrl: NavController, 
              private despesasService: DespesasService) {
    //this.despesas = despesasService.getDespesas();
    despesasService.getDespesas().subscribe((despesas) => {
        this.despesas = despesas;
      },
      (error) => console.log(error)
    )
  }
  
  showDespesaDetalhe(id) {
    this.navCtrl.push(DespesaDetalhePage, {id: id});
  }

  cadastrarDespesa() {
    this.navCtrl.push(DespesaDetalhePage, {id: 0});
  }
}
