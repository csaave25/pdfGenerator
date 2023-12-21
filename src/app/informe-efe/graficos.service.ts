import { Injectable } from '@angular/core';
import { Chart } from 'chart.js';
import { count } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GraficosService {

  constructor() { }



  graficoUno(geoCentinelas: any[]) {

    let filtro = geoCentinelas.filter(data => data.estacion == 'Estacion_7');

    let grafo = new Chart("canvas", {
      type: 'bar',
      data: {
        labels: ['GCC07'],
        datasets: [
          {
            data: [[1,2.5]],
          },

          {
            data: [[1,3.4]],
          },
          {
            data: [[1,4.4]],
          },

          {
            data: [[1,5.1]],
          },


        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Chart.js Floating Bar Chart'
          }
        },
        scales: {
          x: {
            stacked: true

          },
          y: {
            stacked: true

          }
        },
        color: undefined
      }
    });

    return grafo
  }

}

