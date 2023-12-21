import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  // geoCentinelas: any

  private urlGeocentinelas = "https://consultasefe.emt.cl/api/geocentinelas"
  private urlEstadoGeocentinelas = "https://consultasefe.emt.cl/api/geocentinelas/corte/estado"
  private urlProfundidadGeocentinela = "https://consultasefe.emt.cl/api/geocentinelas/corte"

  getGeocentinelas() {
    return this.http.get<any>(this.urlGeocentinelas);
  }

  getEstadoCentinela() {
    return this.http.get<any>(this.urlEstadoGeocentinelas);
  }

  getProfundidadGeocentinela() {
    return this.http.get<any>(this.urlProfundidadGeocentinela);
  }


}
