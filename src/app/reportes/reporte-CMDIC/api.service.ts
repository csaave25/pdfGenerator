import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


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

}
