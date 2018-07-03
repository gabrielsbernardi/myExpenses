import { Pipe, PipeTransform } from '@angular/core';

/**
 * Gabriel Bernardi e Matheus Waltrich
 */
@Pipe({
  name: 'despesaSearch',
})
export class DespesaSearchPipe implements PipeTransform {
  
  // Realiza a consulta baseada na descrição da despesa
  transform(items: any[], dsc: string): any[] {
    if(!items) return [];
    if(!dsc) return items;
    dsc = dsc.toLowerCase();
    return items.filter( it => {
      return it.dsc.toLowerCase().includes(dsc);
    });
  }
}
