import { Injectable } from '@angular/core';
import { Chart } from 'chart.js/auto';
import moment from 'moment';

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


  crearGraficosDeformacion(geocentinelasDeformacion: any[], chartsGeoDeformacion: any[]) {
    let i = 0
    Chart.defaults.font.size = 8;
    chartsGeoDeformacion.forEach((elm: any) => { elm.destroy() })



    geocentinelasDeformacion.reverse().forEach((element: any) => {
      let data: any[] = []
      element.forEach((elm: any) => {
        let dataGCD = {
          numbers: [] as any,
          dates: [] as any,
          canal: '',
          profundidad: 0,
          gid: 0
        }

        elm.reverse().forEach((el: any) => {

          dataGCD.dates.push(el.fecha.slice(0, 10))
          dataGCD.numbers.push(el.medicion)
          dataGCD.profundidad = el.profundidad
          dataGCD.canal = el.canal
          dataGCD.gid = el.gid
        })

        data.push(dataGCD)


      })



      if (i < 3) {


        chartsGeoDeformacion.push(
          new Chart("chart" + i, {
            type: "line",

            plugins: [{
              id: 'loadData', afterRender: (chart) => {
                if (chart.id == "2") {

                }
              }
            }],
            data: {
              labels: data[0].dates,
              datasets: [
                {
                  label: data[0].canal + '/ ' + Math.abs(data[0].profundidad) + ' [m]',
                  data: data[0].numbers,
                  borderWidth: 1,
                  backgroundColor: '#118DFF',
                  borderColor: '#118DFF',
                },
                {
                  label: data[1].canal + '/ ' + Math.abs(data[1].profundidad) + ' [m]',
                  data: data[1].numbers,
                  borderWidth: 1,
                  backgroundColor: '#12239E',
                  borderColor: '#12239E',
                },
                {
                  label: data[2].canal + '/ ' + Math.abs(data[2].profundidad) + ' [m]',
                  data: data[2].numbers,
                  borderWidth: 1,
                  backgroundColor: '#E66C37',
                  borderColor: '#E66C37',
                },
                {
                  label: data[3].canal + '/ ' + Math.abs(data[3].profundidad) + ' [m]',
                  data: data[3].numbers,
                  borderWidth: 1,
                  backgroundColor: '#6B007B',
                  borderColor: '#6B007B',
                },
                // {
                //   data: [15,15,30,31] 
                // }
              ]
            },

            options: {
              // maintainAspectRatio: false,
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
                title: {
                  display: true,
                  text: 'Canal / Prof.'
                },

              },
              scales: {

                x: {
                  // title: {
                  //   display: true,
                  //   text: 'Fecha',

                  // },
                  ticks: {

                    // For a category axis, the val is the index so the lookup via getLabelForValue is needed
                    maxTicksLimit: 7,
                    autoSkip: true,
                    includeBounds: true
                  }
                },
                y: {
                  title: {
                    display: true,
                    text: 'Deformación [%]'
                  },
                  min: 0,
                  max: 100,
                  ticks: {
                    // forces step size to be 50 units
                    stepSize: 20,

                  }
                }
              }
            }
          }));

        i++
      }

    });

    return true
  }



  crearGradicoPiezometro(dataPiezometro: any[],chartsPiezometro: any[], ) {

    moment.locale('es')

    function loadData(data: any[], nombre: string) {
      let datas: any[] = []
      let arr: any[] = []
      data.forEach(dato => {
        let fecha = new Date(dato.fecha)


        arr.push({
          x: fecha,
          y: dato.milimetros
        })
      })
      datas.push({
        label: nombre,
        data: arr,
        backgroundColor: '#12239E',
        borderColor: '#12239E',
      })

      return datas
    }
    chartsPiezometro.forEach((elm: any) => { elm.destroy() })
    dataPiezometro.forEach(piezometro => {

      let datos = loadData(piezometro.data, piezometro.nombre)

      chartsPiezometro.push(
        new Chart("piezometro" + piezometro.gid, {
          type: "line",
          data: {
            datasets: datos,
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
                  stepSize: 6

                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Columna de agua [cm]'
                },
                min: -25,
                max: 75,
                ticks: {

                  stepSize: 25,

                }
              }
            }
          }
        }));
    })
  }
}
