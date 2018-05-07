import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DespesaDetalhePage } from './despesa-detalhe';

@NgModule({
  declarations: [
    DespesaDetalhePage,
  ],
  imports: [
    IonicPageModule.forChild(DespesaDetalhePage),
  ],
})
export class DespesaDetalhePageModule {}
