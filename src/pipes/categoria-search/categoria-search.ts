import { Pipe, PipeTransform } from '@angular/core';

/**
 * Gabriel Bernardi e Matheus Waltrich
 */
@Pipe({
  name: 'categoriaSearch',
})
export class CategoriaSearchPipe implements PipeTransform {
 
  // Pesquisa de categoria através do tipo
  transform(items: any[], tipo: string): any[] {
    if(!items) return [];
    if(!tipo) return items;
    tipo = tipo.toLowerCase();
    return items.filter( it => {
      return it.tipo.toLowerCase().includes(tipo);
    });
  }
}
