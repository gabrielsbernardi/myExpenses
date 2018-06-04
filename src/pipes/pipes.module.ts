import { NgModule } from '@angular/core';
import { CategoriaSearchPipe } from './categoria-search/categoria-search';
import { DespesaSearchPipe } from './despesa-search/despesa-search';
@NgModule({
	declarations: [CategoriaSearchPipe,
    DespesaSearchPipe],
	imports: [],
	exports: [CategoriaSearchPipe,
    DespesaSearchPipe]
})
export class PipesModule {}
