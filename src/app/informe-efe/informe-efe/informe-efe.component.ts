import { Component, ElementRef, OnInit, QueryList, ViewChildren, AfterContentInit } from '@angular/core';
import { InformeService } from '../informe.service';
import { FormControl, FormGroup } from '@angular/forms';
import Chart from 'chart.js/auto';
import { ApiService } from '../api.service';
import html2canvas from 'html2canvas';
import 'chartjs-adapter-moment';
import moment from 'moment';
import { prevenirSaltosDeLinea } from 'src/app/helpers';

// ng build --output-path docs --base-href /pdfGenerator/

@Component({
  selector: 'app-informe-efe',
  templateUrl: './informe-efe.component.html',
  styleUrls: ['./informe-efe.component.scss']
})
export class InformeEfeComponent implements OnInit, AfterContentInit {

  constructor(private servicio: InformeService, private api: ApiService) { }

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

  inputs: FormGroup = new FormGroup({
    datos: new FormGroup({
      fechaInicio: new FormControl({ value: null, disabled: true }),
      fechaFinal: new FormControl({ value: null, disabled: true }),
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
    this.setFechas()
    this.loadGCC()
    this.loadPrismas()
    this.loadGCCDeformacion()
    this.LoadPiezometro()
  }

  ngAfterContentInit(): void {
    this.cargarLocalStorage()

  }


  prevenir(numSaltosPermitidos: number, evt: Event) {
    prevenirSaltosDeLinea(numSaltosPermitidos, evt)
  }

  cargarLocalStorage() {

    let data = localStorage.getItem('dataEFE')
    if (data) {
      let datos = JSON.parse(data)

      // this.inputs.get('fechaInicio')?.setValue(datos.fechaFinal)
      // this.inputs.get('fechaFinal')?.setValue(datos.fechaFinal)
      this.inputs.get('numeroInforme')?.setValue(datos.numeroInforme)
      this.inputs.get('gestores.elaborado')?.setValue(datos.gestores.elaborado)
      this.inputs.get('gestores.revisado')?.setValue(datos.gestores.revisado)
      this.inputs.get('gestores.aprobado')?.setValue(datos.gestores.aprobado)
      this.inputs.get('gestores.cargo1')?.setValue(datos.gestores.cargo1)
      this.inputs.get('gestores.cargo2')?.setValue(datos.gestores.cargo2)
      this.inputs.get('gestores.cargo3')?.setValue(datos.gestores.cargo3)
      this.inputs.get('estaciones.estados.piezometro')?.setValue(datos.estaciones.estados.piezometro)
      this.inputs.get('estaciones.estados.gcd')?.setValue(datos.estaciones.estados.gcd)
      this.inputs.get('estaciones.estados.gcc')?.setValue(datos.estaciones.estados.gcc)
      this.inputs.get('estaciones.estados.prismas')?.setValue(datos.estaciones.estados.prismas)
      this.inputs.get('estaciones.estadoGeneral')?.setValue(datos.estaciones.estadoGeneral)
      this.inputs.get('estaciones.observaciones.piezometro')?.setValue(datos.estaciones.observaciones.piezometro)
      this.inputs.get('estaciones.observaciones.gcd')?.setValue(datos.estaciones.observaciones.gcd)
      this.inputs.get('estaciones.observaciones.gcc')?.setValue(datos.estaciones.observaciones.gcc)
      this.inputs.get('estaciones.observaciones.prismas')?.setValue(datos.estaciones.observaciones.prismas)
      this.inputs.get('estaciones.monitoreo.alarmas')?.setValue(datos.estaciones.monitoreo.alarmas)
      this.inputs.get('estaciones.monitoreo.alertas')?.setValue(datos.estaciones.monitoreo.alertas)
      this.inputs.get('estaciones.monitoreo.vigilancia')?.setValue(datos.estaciones.monitoreo.vigilancia)
      this.inputs.get('estaciones.monitoreo.sismo')?.setValue(datos.estaciones.monitoreo.sismo)
      this.inputs.get('estaciones.estacion6.obsGenerales')?.setValue(datos.estaciones.estacion6.obsGenerales)
      this.inputs.get('estaciones.estacion6.obsGCC')?.setValue(datos.estaciones.estacion6.obsGCC)
      this.inputs.get('estaciones.estacion6.obsGCD')?.setValue(datos.estaciones.estacion6.obsGCD)
      this.inputs.get('estaciones.estacion6.obsEspecificas')?.setValue(datos.estaciones.estacion6.obsEspecificas)
      this.inputs.get('estaciones.estacion6.piezometro.observaciones')?.setValue(datos.estaciones.estacion6.piezometro.observaciones)
      this.inputs.get('estaciones.estacion7.obsGenerales')?.setValue(datos.estaciones.estacion7.obsGenerales)
      this.inputs.get('estaciones.estacion7.obsGCC')?.setValue(datos.estaciones.estacion7.obsGCC)
      this.inputs.get('estaciones.estacion7.obsGCD')?.setValue(datos.estaciones.estacion7.obsGCD)
      this.inputs.get('estaciones.estacion7.obsEspecificas')?.setValue(datos.estaciones.estacion7.obsEspecificas)
      this.inputs.get('estaciones.estacion7.piezometro.observaciones')?.setValue(datos.estaciones.estacion7.piezometro.observaciones)
      this.inputs.get('estaciones.estacion8.obsGenerales')?.setValue(datos.estaciones.estacion8.obsGenerales)
      this.inputs.get('estaciones.estacion8.obsGCC')?.setValue(datos.estaciones.estacion8.obsGCC)
      this.inputs.get('estaciones.estacion8.obsGCD')?.setValue(datos.estaciones.estacion8.obsGCD)
      this.inputs.get('estaciones.estacion8.obsEspecificas')?.setValue(datos.estaciones.estacion8.obsEspecificas)
      this.inputs.get('estaciones.estacion8.piezometro.observaciones')?.setValue(datos.estaciones.estacion8.piezometro.observaciones)
      this.inputs.get('prismas.obsGeneral')?.setValue(datos.prismas.obsGeneral)
      this.inputs.get('prismas.prismas1.obsGeneral')?.setValue(datos.prismas.prismas1.obsGeneral)
      this.inputs.get('prismas.prismas2.obsGeneral')?.setValue(datos.prismas.prismas2.obsGeneral)
      this.inputs.get('conclusion')?.setValue(datos.conclusion)
    }
  }

  guardarEnLocalStorage() {
    let datos = {
      // fechaInicio: this.inputs.get('fechaInicio')?.value,
      // fechaFinal: this.inputs.get('fechaFinal')?.value,
      numeroInforme: this.inputs.get('numeroInforme')?.value,
      gestores: {
        elaborado: this.inputs.get('gestores.elaborado')?.value,
        revisado: this.inputs.get('gestores.revisado')?.value,
        aprobado: this.inputs.get('gestores.aprobado')?.value,
        cargo1: this.inputs.get('gestores.cargo1')?.value,
        cargo2: this.inputs.get('gestores.cargo2')?.value,
        cargo3: this.inputs.get('gestores.cargo3')?.value
      },
      estaciones: {
        estados: {
          piezometro: this.inputs.get('estaciones.estados.piezometro')?.value,
          gcd: this.inputs.get('estaciones.estados.gcd')?.value,
          gcc: this.inputs.get('estaciones.estados.gcc')?.value,
          prismas: this.inputs.get('estaciones.estados.prismas')?.value
        },
        estadoGeneral: this.inputs.get('estaciones.estadoGeneral')?.value,
        observaciones: {
          piezometro: this.inputs.get('estaciones.observaciones.piezometro')?.value,
          gcd: this.inputs.get('estaciones.observaciones.gcd')?.value,
          gcc: this.inputs.get('estaciones.observaciones.gcc')?.value,
          prismas: this.inputs.get('estaciones.observaciones.prismas')?.value
        },
        monitoreo: {
          alarmas: this.inputs.get('estaciones.monitoreo.alarmas')?.value,
          alertas: this.inputs.get('estaciones.monitoreo.alertas')?.value,
          vigilancia: this.inputs.get('estaciones.monitoreo.vigilancia')?.value,
          sismo: this.inputs.get('estaciones.monitoreo.sismo')?.value

        },
        estacion6: {
          obsGenerales: this.inputs.get('estaciones.estacion6.obsGenerales')?.value,
          obsGCC: this.inputs.get('estaciones.estacion6.obsGCC')?.value,
          obsGCD: this.inputs.get('estaciones.estacion6.obsGCD')?.value,
          obsEspecificas: this.inputs.get('estaciones.estacion6.obsEspecificas')?.value,
          piezometro: {
            imgAguaAcumulada: null,
            observaciones: this.inputs.get('estaciones.estacion6.piezometro.observaciones')?.value
          }
        },
        estacion7: {
          obsGenerales: this.inputs.get('estaciones.estacion7.obsGenerales')?.value,
          obsGCC: this.inputs.get('estaciones.estacion7.obsGCC')?.value,
          obsGCD: this.inputs.get('estaciones.estacion7.obsGCD')?.value,
          obsEspecificas: this.inputs.get('estaciones.estacion7.obsEspecificas')?.value,
          piezometro: {
            imgAguaAcumulada: null,
            observaciones: this.inputs.get('estaciones.estacion7.piezometro.observaciones')?.value
          }
        },
        estacion8: {
          obsGenerales: this.inputs.get('estaciones.estacion8.obsGenerales')?.value,
          obsGCC: this.inputs.get('estaciones.estacion8.obsGCC')?.value,
          obsGCD: this.inputs.get('estaciones.estacion8.obsGCD')?.value,
          obsEspecificas: this.inputs.get('estaciones.estacion8.obsEspecificas')?.value,
          piezometro: {
            imgAguaAcumulada: null,
            observaciones: this.inputs.get('estaciones.estacion8.piezometro.observaciones')?.value
          }
        },

      },
      prismas: {
        imagenGeneral: null,
        obsGeneral: this.inputs.get('prismas.obsGeneral')?.value,
        prismas1: {
          imagen: null,
          obsGeneral: this.inputs.get('prismas.prismas1.obsGeneral')?.value
        },
        prismas2: {
          imagen: null,
          obsGeneral: this.inputs.get('prismas.prismas2.obsGeneral')?.value
        },
      },
      conclusion: this.inputs.get('conclusion')?.value
    }


    let data = JSON.stringify(datos)
    localStorage.setItem('dataEFE', data)

  }



  setFechas() {
    let fechaHoy = new Date()
    fechaHoy = new Date(fechaHoy.getFullYear() + '/' + (fechaHoy.getMonth() + 1) + '/21')
    let fechaMesPasado = new Date()
    fechaMesPasado.setDate(fechaMesPasado.getMonth() - 1)
    fechaMesPasado = new Date(fechaMesPasado.getFullYear() + '/' + (fechaMesPasado.getMonth() + 1) + '/21')
    this.inputs.get('datos.fechaInicio')?.setValue(fechaMesPasado)
    this.inputs.get('datos.fechaFinal')?.setValue(fechaHoy)
  }


  reloadData() {
    if (this.inputs.get('datos.fechaInicio')?.value != '' && this.inputs.get('datos.fechaFinal')?.value != '') {
      this.loadGCCDeformacion()
      this.loadPrismas()
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
      html2canvas(element, { scale: 2 }).then((canvas) => {
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
      html2canvas(element, { scale: 4 }).then((canvas) => {
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
        html2canvas(element, { scale: 3 }).then((canvas) => {
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

                    if (elm.nombre == "GCC08" || elm.nombre == "GCC10") {
                      geo.push({
                        profundidad: Math.abs(element.profundidad),
                        canal: element.canal,
                        estado: false
                      })
                    } else {
                      geo.push({
                        profundidad: Math.abs(element.profundidad),
                        canal: element.canal,
                        estado: elm.estado
                      })
                    }

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
    // let dateMin = new Date(this.inputs.get('datos.fechaInicio')?.value).getTime()
    // let dateMax = new Date(this.inputs.get('datos.fechaFinal')?.value).getTime()
    // if (this.inputs.get('datos.fechaInicio')?.value != '' && this.inputs.get('datos.fechaFinal')?.value != '') {
    //   dateMin = new Date(this.inputs.get('datos.fechaInicio')?.value)
    //   dateMax = new Date(this.inputs.get('datos.fechaFinal')?.value)
    // } else {
    //   dateMin = new Date('2021/01/01')
    //   dateMax = new Date()
    // }

    let dateMin = new Date()
    let dateMax = new Date()
    dateMin.setMonth(dateMin.getMonth() -1)

    this.api.getGeocentinalasDeformacion().subscribe(data => {
      let gcc10: any[] = [[], [], [], []]
      let gcc8: any[] = [[], [], [], []]
      let gcc7: any[] = [[], [], [], []]

      data.objects.forEach((elemento: any) => {
        let dateElemento = new Date(elemento.fecha).getTime()

        if (dateElemento > dateMin.getTime() && dateElemento < dateMax.getTime()) {
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
    // let dateMin = new Date(this.inputs.get('datos.fechaInicio')?.value)
    // let dateMax = new Date(this.inputs.get('datos.fechaFinal')?.value)
    // if (this.inputs.get('datos.fechaInicio')?.value != '' && this.inputs.get('datos.fechaFinal')?.value != '') {
    //   dateMin = new Date(this.inputs.get('datos.fechaInicio')?.value)
    //   dateMax = new Date(this.inputs.get('datos.fechaFinal')?.value)
    // } else {
    //   dateMin = new Date('2021/01/01')
    //   dateMax = new Date()
    // }



    this.api.getNombrePrismas().subscribe(res => {

      let dataPrismas: any[] = []
      this.api.getDataPrismas().subscribe(data => {
        res.objects.forEach((prisma: any) => {
          if (prisma.gid != 27) {
            data.objects.forEach((obj: any) => {
              let date = new Date(obj.fecha)
              if (obj.prisma_id == prisma.gid) {
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


        let dataGraph1: any[] = []
        let dataGraph2: any[] = []

        dataPrismas.forEach((elm: any) => {
          if (['P01', 'P02', 'P03', 'P04', 'P05', 'P06', 'P07', 'P08', 'P09', 'P10', 'P11', 'P12'].includes(elm.nombre)) {
            dataGraph1.push(elm)

          } else {
            dataGraph2.push(elm)
          }
        })







        this.cargarDataTablaPrismas(dataPrismas)
        this.crearGraficosPrismas(dataGraph1, dataGraph2)
      })
    })

  }

  LoadPiezometro() {
    // let dateMin = new Date(this.inputs.get('datos.fechaInicio')?.value).getTime()
    // let dateMax = new Date(this.inputs.get('datos.fechaFinal')?.value).getTime()


    let dateMin = new Date()
    let dateMax = new Date()
    dateMin.setMonth(dateMin.getMonth() -1)



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
    })
  }

  cargarDataTablaPrismas(datos: any[]) {
    const data = datos.slice(0, datos.length)
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
    this.geocentinelasDeformacion.reverse().forEach((element: any) => {
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
        });

        i++
      }

      this.loadGeoDeformacion = true
    });

    // let labels = [...new Set(dataGCD10.dates)];

  }

  crearGraficosPrismas(dataGraph1: any[], dataGraph2: any[]) {
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
        data: arr,
        backgroundColor: '#12239E',
        borderColor: '#12239E',
      })

      return datas
    }

    dataPiezometro.forEach(piezometro => {

      let datos = loadData(piezometro.data, piezometro.nombre)

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
      });



    })
  }

  crearInforme() {
    this.loadScreenshotGCC()
    this.loadScreenshotGCD()
    this.loadScreenshotPrismas()
    this.loadScreenshotPiezometro()

    setTimeout(() => {
      this.service.generarInforme(this.inputs, this.arrGCC, this.arrGCD, this.gcdElements, this.arrPrismas, this.arrPiezometro)
      this.guardarEnLocalStorage()

    }, 2000);
  }

  subirInforme() {
    this.service.subirInforme(this.inputs, this.arrGCC, this.arrGCD, this.gcdElements, this.arrPrismas, this.arrPiezometro)
  }


}
