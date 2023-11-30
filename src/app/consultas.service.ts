import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ConsultasService {

  url = 'https://apps.emt.cl/api/images/alertas/alta';
  urlMatrix = 'https://a2mggestion.emt.cl/api/matrix'
  urlMatrixUltimosCambios = 'https://a2mggestion.emt.cl/api/matrixLogs/logs/resumeAll'


  constructor(private http: HttpClient) { }

  getHttp(): Observable<any> {
    return this.http.get<any>(this.url);
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
}
