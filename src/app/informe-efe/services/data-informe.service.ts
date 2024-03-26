import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class DataInformeService {

  constructor(private api : ApiService) { }


  loadGCC(geocentinelas : any[]) {
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
}
