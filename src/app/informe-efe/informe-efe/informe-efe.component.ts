import { Component, ElementRef, OnInit, QueryList, ViewChildren, AfterViewInit, AfterContentChecked, afterRender } from '@angular/core';
import { InformeService } from '../informe.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Chart } from 'chart.js';
import { GraficosService } from '../graficos.service';
import { ApiService } from '../api.service';
import html2canvas from 'html2canvas';
import 'chartjs-adapter-moment';
import moment from 'moment';

@Component({
  selector: 'app-informe-efe',
  templateUrl: './informe-efe.component.html',
  styleUrls: ['./informe-efe.component.scss']
})
export class InformeEfeComponent implements OnInit, AfterViewInit, AfterContentChecked {

  constructor(private servicio: InformeService, private graficos: GraficosService, private api: ApiService) { }

  @ViewChildren("geocentinela") geoElements!: QueryList<ElementRef>;
  @ViewChildren("GCD") gcdElements!: QueryList<ElementRef>;
  @ViewChildren("screenPrisma") prismasElements!: QueryList<ElementRef>;
  @ViewChildren("piezometro") piezometroElement!: QueryList<ElementRef>;



  geocentinelas: any[] = []
  geocentinelasDeformacion: any[] = []
  dataTablaPrismas: any[] = []
  chart: any
  arrGCC: any[] = []
  arrGCD: any[] = []
  arrPrismas: any[] = []
  arrPiezometro: any = []
  loadGeoC = false;
  loadGeoDeformacion = false;
  loadChartPrismas = false;
  service = this.servicio
  dataInputs = new FormGroup({
    textAreaTest: new FormControl()
  })


  ngOnInit() {
    this.loadGCC()
    this.loadPrismas()
    this.loadGCCDeformacion()
    this.LoadPiezometro()
  }
  ngAfterViewInit(): void {
  }
  ngAfterContentChecked(): void {

  }

  loadScreenshotGCC() {
    if (this.geoElements.length) {
      this.geoElements.forEach(e => {
        let element = e.nativeElement
        html2canvas(element).then((canvas) => {
          const base64image = canvas.toDataURL("image/png");
          const img = new Image()
          img.src = base64image
          this.arrGCC.push(img)
        });
      })

    }
  }

  loadScreenshotGCD() {
    this.gcdElements.forEach(e => {
      let element = e.nativeElement
      html2canvas(element).then((canvas) => {
        const base64image = canvas.toDataURL("image/png");
        const img = new Image()
        img.src = base64image
        this.arrGCD.push(img)
      });
    })


  }
  loadScreenshotPrismas() {
    this.piezometroElement.forEach(e => {
      let element = e.nativeElement
      html2canvas(element).then((canvas) => {
        const base64image = canvas.toDataURL("image/png");
        const img = new Image()
        img.src = base64image
        this.arrPiezometro.push(img)
      });
    })

  }

  loadScreenshotPiezometro() {
    if (this.piezometroElement && this.dataTablaPrismas.length > 1) {
      this.prismasElements.forEach(e => {
        let element = e.nativeElement
        html2canvas(element).then((canvas) => {
          const base64image = canvas.toDataURL("image/png");
          const img = new Image()
          img.src = base64image
          this.arrPrismas.push(img)
        });
      })
    }
  }


  loadGCC() {
    this.api.getGeocentinelas().subscribe(data => {
      this.api.getProfundidadGeocentinela().subscribe(res => {
        this.api.getEstadoCentinela().subscribe(dta => {
          data.objects.forEach((cen: any) => {
            let geo: any = []
            res.forEach((element: any) => {
              if (cen.gid == element.geocentinela_id) {
                dta.objects.forEach((elm: any) => {
                  if (elm.gid == cen.gid && elm.canal == element.canal) {
                    geo.push({
                      profundidad: Math.abs(element.profundidad),
                      canal: element.canal,
                      estado: elm.estado
                    })
                  }
                })
              }
            });

            this.geocentinelas.push({
              nombre: cen.nombre,
              estacion: cen.estacion,
              profundidades: geo
            })
          })
        })
      })
    })

  }

  loadGCCDeformacion() {
    let dateMin = new Date("2023/10/21")
    let dateMax = new Date("2023/11/21")

    this.api.getGeocentinalasDeformacion().subscribe(data => {
      let gcc10: any[] = [[], [], [], []]
      let gcc8: any[] = [[], [], [], []]
      let gcc7: any[] = [[], [], [], []]

      data.objects.forEach((elemento: any) => {
        let dateElemento = new Date(elemento.fecha)

        if (dateElemento > dateMin && dateElemento < dateMax) {
          if (elemento.nombre == "GCC10") {
            if (elemento.canal == 1)
              gcc10[0].push({
                profundidad: elemento.profundidad,
                canal: elemento.canal,
                medicion: elemento.medicion,
                fecha: elemento.fecha,
                gid: elemento.gid
              })
            if (elemento.canal == 2)
              gcc10[1].push({
                profundidad: elemento.profundidad,
                canal: elemento.canal,
                medicion: elemento.medicion,
                fecha: elemento.fecha,
                gid: elemento.gid
              })
            if (elemento.canal == 3)
              gcc10[2].push({
                profundidad: elemento.profundidad,
                canal: elemento.canal,
                medicion: elemento.medicion,
                fecha: elemento.fecha,
                gid: elemento.gid
              })
            if (elemento.canal == 4)
              gcc10[3].push({
                profundidad: elemento.profundidad,
                canal: elemento.canal,
                medicion: elemento.medicion,
                fecha: elemento.fecha,
                gid: elemento.gid
              })
          }

          if (elemento.nombre == "GCC08") {
            if (elemento.canal == 1)
              gcc8[0].push({
                profundidad: elemento.profundidad,
                canal: elemento.canal,
                medicion: elemento.medicion,
                fecha: elemento.fecha,
                gid: elemento.gid
              })
            if (elemento.canal == 2)
              gcc8[1].push({
                profundidad: elemento.profundidad,
                canal: elemento.canal,
                medicion: elemento.medicion,
                fecha: elemento.fecha,
                gid: elemento.gid
              })
            if (elemento.canal == 3)
              gcc8[2].push({
                profundidad: elemento.profundidad,
                canal: elemento.canal,
                medicion: elemento.medicion,
                fecha: elemento.fecha,
                gid: elemento.gid
              })
            if (elemento.canal == 4)
              gcc8[3].push({
                profundidad: elemento.profundidad,
                canal: elemento.canal,
                medicion: elemento.medicion,
                fecha: elemento.fecha,
                gid: elemento.gid
              })
          }

          if (elemento.nombre == "GCC07") {
            if (elemento.canal == 1)
              gcc7[0].push({
                profundidad: elemento.profundidad,
                canal: elemento.canal,
                medicion: elemento.medicion,
                fecha: elemento.fecha,
                gid: elemento.gid
              })
            if (elemento.canal == 2)
              gcc7[1].push({
                profundidad: elemento.profundidad,
                canal: elemento.canal,
                medicion: elemento.medicion,
                fecha: elemento.fecha,
                gid: elemento.gid
              })
            if (elemento.canal == 3)
              gcc7[2].push({
                profundidad: elemento.profundidad,
                canal: elemento.canal,
                medicion: elemento.medicion,
                fecha: elemento.fecha,
                gid: elemento.gid
              })
            if (elemento.canal == 4)
              gcc7[3].push({
                profundidad: elemento.profundidad,
                canal: elemento.canal,
                medicion: elemento.medicion,
                fecha: elemento.fecha,
                gid: elemento.gid
              })
          }
        }

      });

      this.geocentinelasDeformacion.push(gcc10)
      this.geocentinelasDeformacion.push(gcc8)
      this.geocentinelasDeformacion.push(gcc7)

      this.crearGraficosDeformacion()



    })
  }

  loadPrismas() {
    let dateMin = new Date("2021/01/01")
    let dateMax = new Date("2023/12/24")


    this.api.getNombrePrismas().subscribe(res => {
      let dataPrismas: any[] = []
      this.api.getDataPrismas().subscribe(data => {
        res.objects.forEach((prisma: any) => {
          if (prisma.gid != 27) {
            data.objects.forEach((obj: any) => {
              let date = new Date(obj.fecha)
              if (obj.prisma_id == prisma.gid && date > dateMin) {
                let indexPrisma = dataPrismas.findIndex(data => data.gid == prisma.gid)
                if (indexPrisma == -1) {
                  let newData = {
                    gid: prisma.gid,
                    nombre: prisma.prisma_codigo,
                    date: [date] as any[],
                    desplazamiento: [obj.d_acumulado * 1000] as any
                  }
                  dataPrismas.push(newData)

                } else {
                  dataPrismas[indexPrisma].date.push(date)
                  dataPrismas[indexPrisma].desplazamiento.push(obj.d_acumulado * 1000)

                }
              }

            })
          }
        })

        this.dataTablaPrismas.sort((data: any, data2: any) => (data.nombre > data2.nombre) ? 1 : (data2.nombre > data.nombre) ? -1 : 0)
        dataPrismas.sort((data: any, data2: any) => (data.nombre > data2.nombre) ? 1 : (data2.nombre > data.nombre) ? -1 : 0)
        let dataGraph1 = dataPrismas.slice(3, 12)
        let dataGraph2 = dataPrismas.slice(12, dataPrismas.length)


        this.cargarDataTablaPrismas(dataPrismas)
        this.crearGraficosPrismas(dataGraph1, dataGraph2)
      })
    })

  }

  LoadPiezometro() {

    let dataPiezometros: any[] = []
    this.api.getNombrePiezometros().subscribe(data => {
      let piezometros: any[] = []
      data.objects.forEach((piez: any) => {
        if (piez.gid == 3 || piez.gid == 4 || piez.gid == 6) {
          piezometros.push(piez)
        }
      })


      this.api.getMilimetrosPiezometros().subscribe(data => {
        piezometros.forEach(piezometro => {
          data.objects.forEach((elm: any) => {
            if (piezometro.gid == elm.piezometro_id) {
              let index = dataPiezometros.findIndex(data => data.gid == elm.piezometro_id)
              if (index == -1) {
                dataPiezometros.push({
                  gid: elm.piezometro_id,
                  nombre: piezometro.nombre,
                  data: [elm] as any
                })
              } else {
                dataPiezometros[index].data.push(elm)
              }
            }

          })
        })

        this.crearGradicoPiezometro(dataPiezometros);

      })



    })
  }

  cargarDataTablaPrismas(datos: any[]) {
    const data = datos.slice(3, datos.length)
    data.forEach(elm => {
      let primeraDate = elm.date[0]
      let primerDesp = elm.desplazamiento[0]
      let date = elm.date[0]
      let desp = elm.desplazamiento[0]
      for (let i = 1; i < elm.date.length; i++) {

        if (date.getTime() < elm.date[i].getTime()) {
          date = elm.date[i]
          desp = elm.desplazamiento[i]
        }
        if (primeraDate.getTime() > elm.date[i].getTime()) {
          primeraDate = elm.date[i]
          primerDesp = elm.desplazamiento[i]
        }
      }
      this.dataTablaPrismas.push({
        gid: elm.gid,
        nombre: elm.nombre,
        fecha: date.toLocaleDateString('en-GB'),
        desplazamiento: desp.toFixed(2),
        acumulado: (desp - primerDesp).toFixed(2)
      })
    })

  }

  crearGraficosDeformacion() {
    let i = 0
    Chart.defaults.font.size = 8;
    this.geocentinelasDeformacion.forEach((element: any) => {
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
                label: data[0].canal + '/ ' + Math.abs(data[0].profundidad) + '[m]',
                data: data[0].numbers,
                borderWidth: 1
              },
              {
                label: data[1].canal + '/ ' + Math.abs(data[1].profundidad) + '[m]',
                data: data[1].numbers,
                borderWidth: 1
              },
              {
                label: data[2].canal + '/ ' + Math.abs(data[2].profundidad) + '[m]',
                data: data[2].numbers,
                borderWidth: 1
              },
              {
                label: data[3].canal + '/ ' + Math.abs(data[3].profundidad) + '[m]',
                data: data[3].numbers,
                borderWidth: 1
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
        });

        i++
      }

      this.loadGeoDeformacion = true
    });

    // let labels = [...new Set(dataGCD10.dates)];

  }

  crearGraficosPrismas(dataGraph1: any[], dataGraph2: any[]) {

    function loadData(dataGraph: any[]) {
      let dataset: any[] = []
      dataGraph.forEach(elm => {
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
          data: elemento
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
            min: -20,
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
          this.loadChartPrismas = true
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
            min: -20,
            max: 100,
            ticks: {
              // forces step size to be 50 units
              stepSize: 0,

            }
          }
        }
      }
    });


  }

  crearGradicoPiezometro(dataPiezometro: any[]) {

    moment.locale('es')

    function loadData(data: any[], nombre: string) {
      let datas: any[] = []
      let arr: any[] = []
      data.forEach(dato => {
        let fecha = new Date(dato.fecha)
        // console.log(fecha);

        arr.push({
          x: fecha,
          y: dato.milimetros
        })
      })
      datas.push({
        label: nombre,
        data: arr
      })

      return datas
    }

    dataPiezometro.forEach(piezometro => {

      let datos = loadData(piezometro.data, piezometro.nombre)
      new Chart("piezometro" + piezometro.gid, {
        type: "line",
        data: {
          datasets: datos
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
              max: 60,
              ticks: {

                stepSize: 0,

              }
            }
          }
        }
      });



    })
  }

  crearInforme() {
    this.loadScreenshotGCC()
    this.loadScreenshotGCD()
    this.loadScreenshotPrismas()
    this.loadScreenshotPiezometro()

    setTimeout(() => {
      this.service.generarInforme(this.dataInputs, this.arrGCC, this.arrGCD, this.gcdElements, this.arrPrismas, this.arrPiezometro)
    }, 2000);
  }

  subirInforme() {
    this.service.subirInforme(this.dataInputs, this.arrGCC, this.arrGCD, this.gcdElements, this.arrPrismas, this.arrPiezometro)
  }


}
