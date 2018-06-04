import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DespesaListPage } from './despesa-list';

@NgModule({
  declarations: [
    DespesaListPage,
  ],
  imports: [
    IonicPageModule.forChild(DespesaListPage),
  ],
})
export class DespesaListPageModule {}
