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

  token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2M2FjM2FiYjA0MDc4YjI5NWRmMzU1NDMiLCJpYXQiOjE3MTEzNzUwODUsImV4cCI6MTcxMTQzNTA4NX0.JybRrtwITBpnnLqfv684dbdocZCMWAHitryYp6loN3E'

  constructor(private http: HttpClient) { }

  getAlerta(): Observable<any> {
    return this.http.get<any>(this.urlAlertas);
  }

  getMatrix(): Observable<any> {
    const headerDict = {
      'x-token': this.token,
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
        let fechaElm = (element.date as string).slice(0, 10).replaceAll("-", "/")
        let date = new Date(fechaElm).getMonth() + 1
        if (!element.fake && fecha == date) {
          tabla.push({ ...element, comentario: null })
        }
      });
    });

    return tabla
  }

  getTablaMatrix(mes: string, ano: number) {

    const headerDict = {
      'x-token': this.token,
    }

    const params = {
      month: mes,
      year: ano
    };

    const requestOptions = {
      headers: new HttpHeaders(headerDict),
      // params: params
      params
    };



    let url = 'https://a2mggestion.emt.cl/api/matrixLogs/logs/matrixChanges'
    return this.http.get<any>(url,requestOptions);
  }

  getTablaDispo(mes: string): any {

    return this.getDisponibilidad(mes).subscribe(dato => {
      return dato
    })

  }

  getConfiabilidad(mes: string, ano: number) {

    const headerDict = {
      'x-token': this.token,
    }

    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };

    let url = 'https://m2d.emt.cl/api3/reliability/date/value?month=' + mes + '&year=' + ano
    return this.http.get<any>(url,requestOptions);
  }



}
