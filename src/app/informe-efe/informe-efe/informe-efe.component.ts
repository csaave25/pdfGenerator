import { Component, ElementRef, OnInit, QueryList, ViewChildren, AfterContentInit } from '@angular/core';
import { InformeService } from '../genInforme/informe.service';
import { FormControl, FormGroup } from '@angular/forms';
import Chart from 'chart.js/auto';
import { ApiService } from '../api/api.service';
import html2canvas from 'html2canvas';
import 'chartjs-adapter-moment';
import moment from 'moment';
import { prevenirSaltosDeLinea } from 'src/app/helpers';
import { getFechasFormatos } from '../helpers/data';
import { cargarLocalStorage, guardarEnLocalStorage } from '../helpers/localstorage';
import { DataInformeService } from '../services/data-informe.service';

// ng build --output-path docs --base-href /pdfGenerator/

@Component({
  selector: 'app-informe-efe',
  templateUrl: './informe-efe.component.html',
  styleUrls: ['./informe-efe.component.scss']
})
export class InformeEfeComponent implements OnInit, AfterContentInit {

  constructor(private servicio: InformeService, private api: ApiService, private dataService : DataInformeService) { }

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
  imagenAgua1: any
  imagenAgua2: any
  imagenAgua3: any
  chartsPiezometro: any[] = []
  chartsGeoDeformacion: any[] = []
  loadingGCC = true
  loadingPrismas = true
  loaddingGCD = true
  loadingPiezometro = true



  inputs: FormGroup = new FormGroup({
    datos: new FormGroup({
      fechaInicio: new FormControl({ value: null, disabled: false }),
      fechaFinal: new FormControl({ value: null, disabled: false }),
      numeroInforme: new FormControl(0)
    }),
    gestores: new FormGroup({
      elaborado: new FormControl(''),
      revisado: new FormControl(''),
      aprobado: new FormControl(''),
      cargo1: new FormControl(''),
      cargo2: new FormControl(''),
      cargo3: new FormControl('')
    }),
    estaciones: new FormGroup({
      estados: new FormGroup({
        piezometro: new FormControl(false),
        gcd: new FormControl(false),
        gcc: new FormControl(false),
        prismas: new FormControl(false),
      }),
      estadoGeneral: new FormControl(''),
      observaciones: new FormGroup({
        piezometro: new FormControl(''),
        gcd: new FormControl(''),
        gcc: new FormControl(''),
        prismas: new FormControl(''),
      }),
      monitoreo: new FormGroup({
        alarmas: new FormControl(0),
        alertas: new FormControl(0),
        vigilancia: new FormControl(0),
        sismo: new FormControl(0),

      }),
      estacion6: new FormGroup({
        obsGenerales: new FormControl(''),
        obsGCC: new FormControl(''),
        obsGCD: new FormControl(''),
        obsEspecificas: new FormControl(''),
        piezometro: new FormGroup({
          imgAguaAcumulada: new FormControl(''),
          observaciones: new FormControl('')
        })
      }),
      estacion7: new FormGroup({
        obsGenerales: new FormControl(''),
        obsGCC: new FormControl(''),
        obsGCD: new FormControl(''),
        obsEspecificas: new FormControl(''),
        piezometro: new FormGroup({
          imgAguaAcumulada: new FormControl(''),
          observaciones: new FormControl('')
        })
      }),
      estacion8: new FormGroup({
        obsGenerales: new FormControl(''),
        obsGCC: new FormControl(''),
        obsGCD: new FormControl(''),
        obsEspecificas: new FormControl(''),
        piezometro: new FormGroup({
          imgAguaAcumulada: new FormControl(''),
          observaciones: new FormControl('')
        })
      })
    }),
    prismas: new FormGroup({
      imagenGeneral: new FormControl(''),
      obsGeneral: new FormControl(''),
      prismas1: new FormGroup({
        imagen: new FormControl(''),
        obsGeneral: new FormControl('')
      }),
      prismas2: new FormGroup({
        imagen: new FormControl(''),
        obsGeneral: new FormControl('')
      })
    }),
    conclusion: new FormControl('')
  })


  ngOnInit() {
    this.reloadData()
  }

  ngAfterContentInit(): void {
    cargarLocalStorage(this.inputs)
  }


  prevenir(numSaltosPermitidos: number, evt: Event) {
    prevenirSaltosDeLinea(numSaltosPermitidos, evt)
  }


  reloadData() {
    if (this.inputs.get('datos.fechaInicio')?.value && this.inputs.get('datos.fechaFinal')?.value) {
      this.dataService.loadGCC(this.geocentinelas)
      this.dataService.loadPrismas(this.dataTablaPrismas, this.loadChartPrismas)
      this.dataService.loadGCCDeformacion(this.inputs, this.geocentinelasDeformacion, this.chartsGeoDeformacion, this.loadGeoDeformacion)
      this.LoadPiezometro()

    }

  }


  LoadUploadImage(id: number, event: any) {

    let img1 = this.inputs.get('estaciones.estacion6.piezometro.imgAguaAcumulada')
    let img2 = this.inputs.get('estaciones.estacion7.piezometro.imgAguaAcumulada')
    let img3 = this.inputs.get('estaciones.estacion8.piezometro.imgAguaAcumulada')
    let img4 = this.inputs.get('prismas.imagenGeneral')
    let img5 = this.inputs.get('prismas.prismas1.imagen')
    let img6 = this.inputs.get('prismas.prismas2.imagen')

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();


      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (event) => {
        if (id == 1)
          img1!.setValue(event.target!.result);
        if (id == 2)
          img2!.setValue(event.target!.result);
        if (id == 3)
          img3!.setValue(event.target!.result);
        if (id == 4)
          img4!.setValue(event.target!.result);
        if (id == 5)
          img5!.setValue(event.target!.result);
        if (id == 6)
          img6!.setValue(event.target!.result);
      }
    }
  }

  loadScreenshotGCC() {
    if (this.geoElements.length) {
      this.geoElements.forEach(e => {
        let element = e.nativeElement
        html2canvas(element, { scale: 3 }).then((canvas) => {
          const base64image = canvas.toDataURL("image/png");
          this.arrGCC.push(base64image)
        });
      })

    }
  }

  loadScreenshotGCD() {
    this.gcdElements.forEach(e => {
      let element = e.nativeElement
      html2canvas(element, { scale: 2 }).then((canvas) => {
        const base64image = canvas.toDataURL("image/png");
        this.arrGCD.push(base64image)
      });
    })


  }

  loadScreenshotPrismas() {
    this.piezometroElement.forEach(e => {
      let element = e.nativeElement
      html2canvas(element, { scale: 4 }).then((canvas) => {
        const base64image = canvas.toDataURL("image/png");
        this.arrPiezometro.push(base64image)
      });
    })

  }

  loadScreenshotPiezometro() {
    if (this.piezometroElement && this.dataTablaPrismas.length > 1) {
      this.prismasElements.forEach(e => {
        let element = e.nativeElement
        html2canvas(element, { scale: 3 }).then((canvas) => {
          const base64image = canvas.toDataURL("image/png");
          this.arrPrismas.push(base64image)
        });
      })
    }
  }

  
  

  LoadPiezometro() {
    let { fechaInit, fechaFin } = getFechasFormatos(this.inputs.get('datos.fechaInicio')?.value, this.inputs.get('datos.fechaFinal')?.value)
    let dateMin = new Date(fechaInit)
    let dateMax = new Date(fechaFin)
    dateMin.setHours(0, 0, 0, 0)
    dateMax.setHours(23, 59, 59)

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
            let fechaElm = new Date(elm.fecha).getTime()
            if (fechaElm > dateMin.getTime() && fechaElm < dateMax.getTime()) {
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
            }

          })
        })


        //algoritomo para agregar un piezometro en caso de que no le llegue info.
        if (dataPiezometros.length < 3) {
          let data: any[] = []
          for (let i = 0; i < 3; i++) {

            if (dataPiezometros[i]) {
              if (dataPiezometros[i].gid == 4) {
                data[0] = dataPiezometros[i]
              }

              if (dataPiezometros[i].gid == 3) {
                data[1] = dataPiezometros[i]
              }

              if (dataPiezometros[i].gid == 6) {
                data[2] = dataPiezometros[i]
              }

            }

          }

          let gid = 0
          let nombre = 'null'
          let datos: any[] = []
          for (let i = 0; i < 3; i++) {

            if (!data[i]) {

              if (i == 0) {
                gid = 4
                nombre = 'PZ02'
              } else if (i == 1) {
                gid = 3
                nombre = 'PZ03'
              } else if (i == 2) {
                gid = 6
                nombre = 'PZ04'
              }

              data[i] = {
                gid,
                nombre,
                data: []
              }
            }
          }


          for (let i = 0; i < 3; i++) {
            if (data[i].data.length > 0) {
              datos = [...data[i].data]
              break
            }
          }

          datos = datos.map((elm: any) => {
            return { ...elm, milimetros: null }
          })

          data.forEach((elm: any) => {
            if (elm.data.length == 0) {
              elm.data = datos

            }
          })

          dataPiezometros = data
        }

        this.crearGradicoPiezometro(dataPiezometros);

      })
    }).add(() => {
      this.loadingPiezometro = false
    })
  }

  

  

  

  crearGradicoPiezometro(dataPiezometro: any[]) {

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
    this.chartsPiezometro.forEach((elm: any) => { elm.destroy() })
    dataPiezometro.forEach(piezometro => {

      let datos = loadData(piezometro.data, piezometro.nombre)

      this.chartsPiezometro.push(
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

  crearInforme() {
    this.loadScreenshotGCC()
    this.loadScreenshotGCD()
    this.loadScreenshotPrismas()
    this.loadScreenshotPiezometro()

    setTimeout(() => {
      // this.service.generarInforme(this.inputs, this.arrGCC, this.arrGCD, this.gcdElements, this.arrPrismas, this.arrPiezometro)

      let body = { ...this.inputs.value, gcc: this.arrGCC, gcd: this.arrGCD, prismas: this.arrPrismas, piezometro: this.arrPiezometro }
      console.log(body);
      

      guardarEnLocalStorage(this.inputs)

    }, 2000);
  }

  subirInforme() {
    this.service.subirInforme(this.inputs, this.arrGCC, this.arrGCD, this.gcdElements, this.arrPrismas, this.arrPiezometro)
  }





}
