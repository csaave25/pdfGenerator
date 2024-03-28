import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs'
import { environments } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  urlAlertas = 'https://apps.emt.cl/api/images/alertas/alta';
  urlMatrix = 'https://a2mggestion.emt.cl/api/matrix'
  urlMatrixUltimosCambios = 'https://a2mggestion.emt.cl/api/matrixLogs/logs/resumeAll'
  urlDisponibilidad = 'http://10.10.10.238:8766/reportabilidad/metricas/'
  utlAuth = 'https://m2d.emt.cl/api3/auth/login'

  token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2M2FjM2FiYjA0MDc4YjI5NWRmMzU1NDMiLCJpYXQiOjE3MTE2MzI1NDUsImV4cCI6MTcxMTY5MjU0NX0.kuodezB5lRgFhznjY0TowKgH0ObjzrUXRyEOSc7UI'

  constructor(private http: HttpClient) { }

  getToken() {

    let body = {
      email: environments.AUTH_USER_A2MG,
      password: environments.AUTH_PASS_A2MG
    }
    return this.http.post<any>(this.utlAuth, body)
  }
  getAlerta(mes: number, ano: number): Observable<any> {
    return this.http.get<any>(this.urlAlertas).pipe(
      map((data: any) => data.objects.alerts.filter((element: any) => {
        let fechaElm = (element.date as string).slice(0, 10).replaceAll("-", "/")
        let date = new Date(fechaElm)
        let datoMes = date.getMonth() + 1
        let datoAno = date.getFullYear()
        if(!element.fake && mes == datoMes && ano == datoAno) return true;
        return false;

      }))

    );
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

  getTablaMatrix(mes: string, ano: number, token : string) {

    const headerDict = {
      'x-token': token,
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
    return this.http.get<any>(url, requestOptions);
  }

  getTablaDispo(mes: string): any {

    return this.getDisponibilidad(mes).subscribe(dato => {
      return dato
    })

  }

  getConfiabilidad(mes: string, ano: number, token: string) {

    const headerDict = {
      'x-token': token,
    }

    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };

    let url = 'https://m2d.emt.cl/api3/reliability/date/value?month=' + mes + '&year=' + ano
    return this.http.get<any>(url, requestOptions);
  }



}
