import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import chartJs from 'chart.js';
import { GeralProvider } from '../../providers/geral/geral';
import { GraficoPieView } from '../../providers/geral/grafico-pie-view-values';

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
  private cores: Array<string> = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private provider: GeralProvider) {
    this.popularCores();
    this.pieValues = this.provider.getPieValues();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.pieCanvas = this.getPieCanvas();
      this.lineCanvas = this.getLineCanvas();
    }, 150);
  }

  getChart(context, chartType, data, options?) {
    return new chartJs(context, {
      data,
      options,
      type: chartType
    })
  }

  getPieCanvas() {
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
    return this.getChart(this.pieCanvas.nativeElement, 'pie', data);
  }
  
  getLineCanvas() {
    const data = {
      labels: ['JAN', 'FEV', 'MAR', 'ABR'],
      datasets: [{
        label: 'Meu Dataset',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgb(0, 178, 255)',
        borderColor: 'rgb(231, 205, 35)',
        borderCapStyle: 'butt',
        borderJoinStyle: 'miter',
        pointRadius: 1,
        pointHitRadius: 10,
        data: [20, 15, 98, 4],
        scanGaps: false
      }, {
        label: 'Meu Dataset',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgb(117, 0, 49)',
        borderColor: 'rgb(51, 50, 46)',
        borderCapStyle: 'butt',
        borderJoinStyle: 'miter',
        pointRadius: 1,
        pointHitRadius: 10,
        data: [29, 135, 13, 70],
        scanGaps: false
      }]
    };

    return this.getChart(this.lineCanvas.nativeElement, 'line', data);
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