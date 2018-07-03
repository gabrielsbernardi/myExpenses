import { Pipe, PipeTransform } from '@angular/core';

/**
 * Gabriel Bernardi e Matheus Waltrich
 */
@Pipe({
  name: 'creditoSearch',
})
export class CreditoSearchPipe implements PipeTransform {
  
  // Realiza a consulta baseada na descrição do crédito
  transform(items: any[], dsc: string): any[] {
    if(!items) return [];
    if(!dsc) return items;
    dsc = dsc.toLowerCase();
    return items.filter( it => {
      return it.dsc.toLowerCase().includes(dsc);
    });
  }
}
