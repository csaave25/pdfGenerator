import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { GraficosService } from './graficos.service';
import { FormGroup } from '@angular/forms';
import { getFechasFormatos } from '../helpers/data';

@Injectable({
  providedIn: 'root'
})
export class DataInformeService {

  constructor(private api: ApiService, private graficos: GraficosService) { }


  loadGCC(geocentinelas: any[]) {
    this.api.getGeocentinelas().subscribe(data => {
      this.api.getProfundidadGeocentinela().subscribe(res => {
        this.api.getEstadoCentinela().subscribe(dta => {
          data.objects.forEach((cen: any) => {
            let geo: any = []
            res.forEach((element: any) => {
              if (cen.gid == element.geocentinela_id) {
                dta.objects.forEach((elm: any) => {
                  if (elm.gid == cen.gid && elm.canal == element.canal) {
                    // if()

                    if (elm.canal_id === 108 || elm.canal_id === 119) {
                      // console.log(elm.canal_id);
                      geo.push({
                        profundidad: Math.abs(element.profundidad),
                        canal: elm.canal,
                        estado: false
                      })
                    } else {

                      geo.push({
                        profundidad: Math.abs(element.profundidad),
                        canal: elm.canal,
                        estado: elm.estado
                      })
                    }



                  }
                })
              }
            });

            geocentinelas.push({
              nombre: cen.nombre,
              estacion: cen.estacion,
              profundidades: geo
            })
          })
        })
      })
    })
  }


  loadPrismas(dataTablaPrismas: any[], loadChartPrismas: boolean) {

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

        dataTablaPrismas.sort((data: any, data2: any) => (data.nombre > data2.nombre) ? 1 : (data2.nombre > data.nombre) ? -1 : 0)
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

        this.cargarDataTablaPrismas(dataPrismas, dataTablaPrismas)
        loadChartPrismas = this.graficos.crearGraficosPrismas(dataGraph1, dataGraph2)
      })
    })

  }

  cargarDataTablaPrismas(datos: any[], dataTablaPrismas: any[]) {
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
      dataTablaPrismas.push({
        gid: elm.gid,
        nombre: elm.nombre,
        fecha: date.toLocaleDateString('en-GB'),
        desplazamiento: desp.toFixed(2),
        acumulado: (desp - primerDesp).toFixed(2)
      })
    })

  }


  loadGCCDeformacion(inputs: FormGroup, geocentinelasDeformacion: any[], chartsGeoDeformacion: any[], loadchart: boolean) {

    let { fechaInit, fechaFin } = getFechasFormatos(inputs.get('datos.fechaInicio')?.value, inputs.get('datos.fechaFinal')?.value)
    let dateMin = new Date(fechaInit)
    let dateMax = new Date(fechaFin)
    dateMin.setHours(0, 0, 0, 0)
    dateMax.setHours(23, 59, 59)

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


      geocentinelasDeformacion.push(gcc10)

      geocentinelasDeformacion.push(gcc8)

      geocentinelasDeformacion.push(gcc7)

      loadchart = this.graficos.crearGraficosDeformacion(geocentinelasDeformacion, chartsGeoDeformacion)

    })
  }



  LoadPiezometro(inputs: FormGroup, chartsPiezometro: any[]) {
    let { fechaInit, fechaFin } = getFechasFormatos(inputs.get('datos.fechaInicio')?.value, inputs.get('datos.fechaFinal')?.value)
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

        this.graficos.crearGradicoPiezometro(dataPiezometros, chartsPiezometro);

      })
    })
  }

  LoadUploadImage(inputs: FormGroup, id: number, event: any) {

    let img1 = inputs.get('estaciones.estacion6.piezometro.imgAguaAcumulada')
    let img2 = inputs.get('estaciones.estacion7.piezometro.imgAguaAcumulada')
    let img3 = inputs.get('estaciones.estacion8.piezometro.imgAguaAcumulada')
    let img4 = inputs.get('prismas.imagenGeneral')
    let img5 = inputs.get('prismas.prismas1.imagen')
    let img6 = inputs.get('prismas.prismas2.imagen')

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
}
