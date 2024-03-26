import { Injectable } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Injectable({
  providedIn: 'root'
})
export class GraficosService {

  constructor() { }



  crearGraficosPrismas(dataGraph1: any[], dataGraph2: any[]) {

    let loadChartPrismas = false
    let colores = ['#118DFF', '#12239E', '#E66C37', '#6B007B', '#E044A7', '#744EC2', '#D9B300', '#D64550', '#197278', '#1AAB40', '#15C6F4', '#4092FF', '#FFA25C', '#BF61CA', '#F475D1', '#B7A3FF', '#C5A406', '#FF8383']

    function loadData(dataGraph: any[]) {
      let dataset: any[] = []
      dataGraph.forEach((elm, index) => {
        let elemento: any[] = []
        for (let i = 0; i < elm.date.length; i++) {

          let arr = {
            x: elm.date[i],
            y: elm.desplazamiento[i]
          }
          elemento.push(arr)
        }

        dataset.push({
          label: elm.nombre,
          data: elemento,
          backgroundColor: colores[index],
          borderColor: colores[index],
        })

      })

      return dataset

    }

    const data = loadData(dataGraph1)
    const data2 = loadData(dataGraph2)

    new Chart("prismas1", {
      type: "line",
      data: {
        datasets: data
      },
      options: {
        animation: false,
        responsive: true,
        elements: {
          point: {
            radius: 0
          }
        },
        plugins: {
          legend: {
            title: {
              font: {
                weight: 'normal'
              }
            },
            labels: {
              font: {
                size: 8
              }
            }
          },
        },
        scales: {

          x: {
            type: 'time',
            display: true,
            ticks: {
              autoSkip: true,
              stepSize: 4

            },
          },
          y: {
            title: {
              display: true,
              text: 'Desplazamiento acumulado [mm]'
            },
            min: -30,
            max: 100,
            ticks: {

              stepSize: 0,

            }
          }
        }
      }
    });

    new Chart("prismas2", {
      type: "line",
      plugins: [{
        id: 'loadData', afterRender: (chart) => {
          loadChartPrismas = true
        }
      }],
      data: {
        datasets: data2
      },
      options: {
        animation: false,
        responsive: true,
        elements: {
          point: {
            radius: 0
          }
        },
        plugins: {
          legend: {
            title: {
              font: {
                weight: 'normal'
              }
            },
            labels: {
              font: {
                size: 8
              }
            }
          },
        },
        scales: {

          x: {
            type: 'time',
            display: true,
            ticks: {
              autoSkip: true,
              stepSize: 4

            },
          },
          y: {
            title: {
              display: true,
              text: 'Desplazamiento acumulado [mm]'
            },
            min: -30,
            max: 100,
            ticks: {
              // forces step size to be 50 units
              stepSize: 0,

            }
          }
        }
      }
    });

    return loadChartPrismas
  }
}
