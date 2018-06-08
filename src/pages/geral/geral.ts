import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import chartJs from 'chart.js';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
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
    const data = {
      labels: ['Vermelho', 'Azul', 'Amarelo'],
      datasets: [{
        data: [300, 75, 224],
        backgroundColor: ['rgb(200, 6, 0)', 'rgb(36, 0, 255)', 'rgb(242, 255, 0)']
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
}