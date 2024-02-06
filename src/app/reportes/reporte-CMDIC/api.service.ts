import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }


  getTopo() {
    return this.http.get('https://geospatialp1.emt.cl/recepcion/p1/topografias/daily')
  }

  getPozos() {
    return this.http.get('https://geospatialp1.emt.cl/recepcion/p1/pozos/pi/lastpi')
  }

  getBaseDatosPozos() {
    // return this.http.get('https://api.sheety.co/a70d9550db28a0d8f07825d33db0f130/pruebaApi/hoja1')
  }



}
