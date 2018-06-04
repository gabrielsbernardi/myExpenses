import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategoriaEditPage } from './categoria-edit';

@NgModule({
  declarations: [
    CategoriaEditPage,
  ],
  imports: [
    IonicPageModule.forChild(CategoriaEditPage),
  ],
})
export class CategoriaEditPageModule {}
