import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  urlAlertas = 'https://apps.emt.cl/api/images/alertas/alta';
  urlMatrix = 'https://a2mggestion.emt.cl/api/matrix'
  urlMatrixUltimosCambios = 'https://a2mggestion.emt.cl/api/matrixLogs/logs/resumeAll'
  urlDisponibilidad = 'http://10.10.10.238:8766/reportabilidad/metricas/'


  constructor(private http: HttpClient) { }

  getAlerta(): Observable<any> {
    return this.http.get<any>(this.urlAlertas);
  }

  getMatrix(): Observable<any> {
    const headerDict = {
      'x-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2M2MwMzE3OGU3OTg0NWEzN2QwZjEyNWEiLCJpYXQiOjE2OTc0NzAxODQsImV4cCI6NDIwMDAwMTY5NzQ3MDE4NH0.wM_IyCuLdbNZF_doUKecx1tHX8PQ9-SKxEMtb1OkFDo',
    }

    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };

    return this.http.get<any>(this.urlMatrix, requestOptions);
  }

  getUltimosCambiosMatrix() {
    return this.http.get<any>(this.urlMatrixUltimosCambios);
  }

  getDisponibilidad(mes: string) {
    return this.http.get<any>(this.urlDisponibilidad + mes);
  }


  ///subscribes
  getTablaAlertas(fecha: number) {
    let tabla: any = []
    this.getAlerta().subscribe(dato => {
      dato.objects.alerts.forEach((element: any) => {
        let date = new Date(element.date).getMonth()
        if (!element.fake && fecha == date) {
          tabla.push({...element, comentario: null})
        }
      });
    });

    return tabla
  }

  getTablaMatrix(mes : string, ano : number) {
    let url= 'https://m2d.emt.cl/api3/matrixLogs/logs/matrixChanges?month='+ mes +'&year='+ ano 
    return this.http.get<any>(url);
  }

  getTablaDispo(mes: string): any {

    return this.getDisponibilidad(mes).subscribe(dato => {
      return dato
    })

  }



}
