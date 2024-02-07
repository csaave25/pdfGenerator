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
    return this.http.get('https://sheet.best/api/sheets/83afce1f-9319-40a2-910f-a376800b56bc')
  }



}
