import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GastoDetailPage } from './gasto-detail';

@NgModule({
  declarations: [
    GastoDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(GastoDetailPage),
  ],
})
export class GastoDetailPageModule {}
