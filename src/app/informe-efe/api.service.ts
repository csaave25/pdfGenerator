import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  private urlGeocentinelas = "https://consultasefe.emt.cl/api/geocentinelas"
  private urlEstadoGeocentinelas = "https://consultasefe.emt.cl/api/geocentinelas/corte/estado"
  private urlProfundidadGeocentinela = "https://consultasefe.emt.cl/api/geocentinelas/corte"
  private urlPDF = "http://10.10.10.18:6450/api/insertos/pdf/TESTING"
  private urlGeocenDeformacion = "https://consultasefe.emt.cl/api/geocentinelas/registros/deformacion/semanas/6"

  getGeocentinelas() {
    return this.http.get<any>(this.urlGeocentinelas);
  }

  getEstadoCentinela() {
    return this.http.get<any>(this.urlEstadoGeocentinelas);
  }

  getProfundidadGeocentinela() {
    return this.http.get<any>(this.urlProfundidadGeocentinela);
  }

  getGeocentinalasDeformacion() {
    return this.http.get<any>(this.urlGeocenDeformacion);
  }


  sendPDF(data: FormData) {
    this.http.post<any>(this.urlPDF, data).subscribe(
      (res) => console.log(res)
    );
  }

}
