import { NgModule } from '@angular/core';
import { CategoriaSearchPipe } from './categoria-search/categoria-search';
import { DespesaSearchPipe } from './despesa-search/despesa-search';
import { CreditoSearchPipe } from './credito-search/credito-search';
@NgModule({
	declarations: [CategoriaSearchPipe,
    DespesaSearchPipe,
    CreditoSearchPipe],
	imports: [],
	exports: [CategoriaSearchPipe,
    DespesaSearchPipe,
    CreditoSearchPipe]
})
export class PipesModule {}
