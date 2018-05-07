import { Injectable } from '@angular/core';
import { AngularFireDatabase } from "angularfire2/database/database"

@Injectable()
export class DespesasService {
    despesas = [
        {id: 1, descricao:'Despesa 1', valor:70.5, data: '04/05/2018'},
        {id: 2, descricao:'Despesa 2', valor:100.75, data: '20/05/2018'},
        {id: 3, descricao:'Despesa 3', valor:23, data: '18/05/2018'}
    ];

    constructor(private afDB: AngularFireDatabase) {
        
    }

    public getDespesas() {
        //return this.despesas;
        return this.afDB.list('despesa').valueChanges();
    }

    public getDespesa(id) {
        //return this.despesas.filter((despesa) => { return despesa.id == id})[0];
        return this.afDB.object('despesa/' + id).valueChanges();
    }

    public store(despesa) {
        this.afDB.database.ref('despesa/' + despesa.id).set(despesa);
    }

    public excluirDespesa(id) {
        this.afDB.database.ref('despesa/' + id).remove();
    }
}