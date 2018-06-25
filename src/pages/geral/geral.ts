import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import chartJs from 'chart.js';
import { GeralProvider } from '../../providers/geral/geral';
import { GraficoPieView } from '../../providers/geral/grafico-pie-view-values';
import { GraficoLineView } from '../../providers/geral/grafico-line-view-values';
import { GeralView } from '../../providers/geral/geral-view-values';
import { DecimalPipe } from '@angular/common';

/**
 * Gabriel Bernardi e Matheus Waltrich
 */
@IonicPage()
@Component({
  selector: 'page-geral',
  templateUrl: 'geral.html',
})
export class GeralPage {
  @ViewChild('pieCanvas') pieCanvas: any;
  @ViewChild('lineCanvas') lineCanvas: any;

  private pieValues: Array<GraficoPieView> = [];
  private lineValues: Array<GraficoLineView> = [];
  private geralViewValues: GeralView;
  private cores: Array<string> = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private provider: GeralProvider,
            private decimalPipe: DecimalPipe) {
    document.getElementById('main-menu').hidden = false
    this.popularCores();
    this.geralViewValues = this.provider.getGeralViewValues();
    this.pieValues = this.provider.getPieValues();
    this.lineValues = this.provider.getLineValues();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.pieCanvas = this.getPieCanvas();
      this.lineCanvas = this.getLineCanvas();
    }, 150);
  }

  getPieCanvas() {
    var self = this;
    var labels = [];
    var datas = [];
    var backgroundColors = [];

    var cor = 0;
    this.pieValues.forEach(value => { 
      labels.push(value.tipo_categoria);
      datas.push(value.valor_total_gastos);
      backgroundColors.push(this.cores[cor]);
      cor++;
    })

    const data = {
      labels: labels,
      datasets: [{
        data: datas,
        backgroundColor: backgroundColors
      }]
    }

    return new chartJs(this.pieCanvas.nativeElement, {
      data,
      options: {
        tooltips: {
          enabled: true,
          callbacks: {
            label: function(tooltipItem, data) {
              return 'R$ ' + self.decimalPipe.transform(parseFloat(data['datasets'][0]['data'][tooltipItem['index']]), '1.2-2');
            }
          }
        }
      },
      type: 'pie'
    })
  }
  
  getLineCanvas() {
    var self = this;
    var labels = [];
    var dadosDespesas = [];
    var dadosCreditos = [];

    this.lineValues.forEach(value => { 
      labels.push(value.label);
      dadosDespesas.push(value.valor_despesas);
      dadosCreditos.push(value.valor_creditos);
    })

    const data = {
      labels: labels,
      datasets: [{
        label: 'Despesa',
        fill: false,
        lineTension: 0.1,
        backgroundColor: this.cores[10],
        borderColor: this.cores[10],
        borderCapStyle: 'butt',
        borderJoinStyle: 'miter',
        pointRadius: 1,
        pointHitRadius: 10,
        data: dadosDespesas,
        scanGaps: false
      }, {
        label: 'Crédito',
        fill: false,
        lineTension: 0.1,
        backgroundColor: this.cores[11],
        borderColor: this.cores[11],
        borderCapStyle: 'butt',
        borderJoinStyle: 'miter',
        pointRadius: 1,
        pointHitRadius: 10,
        data: dadosCreditos,
        scanGaps: false
      }]
    };

    return new chartJs(this.lineCanvas.nativeElement, {
      data,
      options: {
        scales: {
          yAxes: [{
              ticks: {
                  callback: function(value, index, values) {
                      return 'R$ ' + self.decimalPipe.transform(value, '1.2-2');
                  }
              }
          }]
        },
        tooltips: {
          enabled: true,
          callbacks: {
            label: function(tooltipItems, data) {
              return 'R$ ' + self.decimalPipe.transform(parseFloat(tooltipItems.yLabel), '1.2-2');
            }
          }
        }
      },
      type: 'line'
    })
  }

  private popularCores() {
    this.cores.push("#16A085");
    this.cores.push("#F39C12");
    this.cores.push("#27AE60");
    this.cores.push("#D35400");
    this.cores.push("#2980B9");
    this.cores.push("#C0392B");
    this.cores.push("#2C3E50");
    this.cores.push("#7F8C8D");
    this.cores.push("#0925C6");
    this.cores.push("#095BD0");
    this.cores.push("#017DB9");
    this.cores.push("#09C3D0");
    this.cores.push("#09C69D");
  }

  private getCor() {
    return this.cores[Math.floor(Math.random() * (12 - 0 + 1)) + 0];
  }
}