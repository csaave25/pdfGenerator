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

  ngOnInit(): void {

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

  service = this.servicio
  dataInputs = new FormGroup({
    textAreaTest: new FormControl()
  })



}
