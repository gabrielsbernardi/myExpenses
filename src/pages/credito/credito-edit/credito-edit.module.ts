import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreditoEditPage } from './credito-edit';

@NgModule({
  declarations: [
    CreditoEditPage,
  ],
  imports: [
    IonicPageModule.forChild(CreditoEditPage),
  ],
})
export class CreditoEditPageModule {}
