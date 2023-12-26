import { Component, OnInit } from '@angular/core';
import { InformeService } from '../informe.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Chart } from 'chart.js';
import { GraficosService } from '../graficos.service';
import { ApiService } from '../api.service';



@Component({
  selector: 'app-informe-efe',
  templateUrl: './informe-efe.component.html',
  styleUrls: ['./informe-efe.component.scss']
})
export class InformeEfeComponent implements OnInit {

  constructor(private servicio: InformeService, private graficos: GraficosService, private api: ApiService) { }

  geocentinelas: any[] = []
  geocentinelasDeformacion: any[] = []
  chart: any


  ngOnInit(): void {
    this.loadGCC()
    this.loadGCCDeformacion()
    this.crearGraficosDeformacion()


  }

  service = this.servicio
  dataInputs = new FormGroup({
    textAreaTest: new FormControl()
  })



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
    this.api.getGeocentinalasDeformacion().subscribe(data => {
      let gcc10: any[] = [[], [], [], []]
      let gcc8: any[] = [[], [], [], []]
      let gcc7: any[] = [[], [], [], []]

      data.objects.forEach((elemento: any) => {
        let dateElemento = new Date(elemento.fecha)
        let dateFilter = new Date("2023-12-16")

        if (dateElemento > dateFilter) {
          if (elemento.nombre == "GCC10") {
            if (elemento.canal == 1)
              gcc10[0].push({
                medicion: elemento.medicion,
                fecha: elemento.fecha
              })
            if (elemento.canal == 2)
              gcc10[1].push({
                medicion: elemento.medicion,
                fecha: elemento.fecha
              })
            if (elemento.canal == 3)
              gcc10[2].push({
                medicion: elemento.medicion,
                fecha: elemento.fecha
              })
            if (elemento.canal == 4)
              gcc10[3].push({
                medicion: elemento.medicion,
                fecha: elemento.fecha
              })
          }

          if (elemento.nombre == "GCC8") {
            if (elemento.canal == 1)
              gcc8[0].push(elemento)
            if (elemento.canal == 2)
              gcc8[1].push(elemento)
            if (elemento.canal == 3)
              gcc8[2].push(elemento)
            if (elemento.canal == 4)
              gcc8[3].push(elemento)
          }

          if (elemento.nombre == "GCC7") {
            if (elemento.canal == 1)
              gcc7[0].push(elemento)
            if (elemento.canal == 2)
              gcc7[1].push(elemento)
            if (elemento.canal == 3)
              gcc7[2].push(elemento)
            if (elemento.canal == 4)
              gcc7[3].push(elemento)
          }
        }

      });

      this.geocentinelasDeformacion.push(gcc10)
      this.geocentinelasDeformacion.push(gcc8)
      this.geocentinelasDeformacion.push(gcc7)


    })
  }


  crearGraficosDeformacion() {
    const xValues = [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150];
    const yValues = [7, 8, 8, 9, 9, 9, 10, 11, 14, 14, 15];

    new Chart("chart", {
      type: "line",
      data: {
        labels: xValues,
        datasets: [{
          backgroundColor: "rgba(0,0,255,1.0)",
          borderColor: "rgba(0,0,255,0.1)",
          data: yValues
        }]
      },
      options: {}
    });
  }


}
