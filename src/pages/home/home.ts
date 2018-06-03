import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DespesasService } from '../../services/despesas.service';
import { DespesaDetalhePage } from '../despesa-detalhe/despesa-detalhe';
import { AuthService } from '../../providers/auth/auth-service';
import { SigninPage } from '../signin/signin';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  despesas = [];
  constructor(private navCtrl: NavController, 
              private despesasService: DespesasService,
              private authService: AuthService) {
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

  signOut() {
    this.authService.signOut()
      .then(() => {
        this.navCtrl.setRoot(SigninPage);
      })
      .catch((error) => {
        console.error(error);
      })
  }

  teste() {
    console.log(this.authService.currentUser());
  }

}
