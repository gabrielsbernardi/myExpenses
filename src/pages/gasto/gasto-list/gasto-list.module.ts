import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GastoListPage } from './gasto-list';

@NgModule({
  declarations: [
    GastoListPage,
  ],
  imports: [
    IonicPageModule.forChild(GastoListPage),
  ],
})
export class GastoListPageModule {}
