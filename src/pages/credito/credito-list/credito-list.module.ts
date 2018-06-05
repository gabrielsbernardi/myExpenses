import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreditoListPage } from './credito-list';

@NgModule({
  declarations: [
    CreditoListPage,
  ],
  imports: [
    IonicPageModule.forChild(CreditoListPage),
  ],
})
export class CreditoListPageModule {}
