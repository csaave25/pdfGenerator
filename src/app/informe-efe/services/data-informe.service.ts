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


  loadGCCDeformacion(inputs: FormGroup, geocentinelasDeformacion: any[], chartsGeoDeformacion: any[], loadchart : boolean) {

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

      loadchart =  this.graficos.crearGraficosDeformacion(geocentinelasDeformacion, chartsGeoDeformacion)



    })
  }
}
