import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

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
  private urlDataPrismas = "https://consultasefe.emt.cl/api/prismas/registros/semanas/150"
  private urlNombrePrismas = "https://consultasefe.emt.cl/api/prismas"
  private urlNombrePiezometro = "https://consultasefe.emt.cl/api/piezometros"
  private urlMilimetrosPiezometro = "https://consultasefe.emt.cl/api/piezometros/registros/semanas/5"
  private URL_PRECIPITACIONES = "https://climatologia.meteochile.gob.cl/application/servicios/getDatosRecientesEma/330007/"

  getPrecipitaciones(fecha : string) {
    let params = new HttpParams()
    .set('usuario', 'csaavedra@emt.cl')
    .set('token', 'TcxMTU3MjIzMTM0Mw==IXmvxB');
    return this.http.get<any>(this.URL_PRECIPITACIONES + fecha, {params , withCredentials: true});
    // return this.http.get<any>('https://climatologia.meteochile.gob.cl/application/servicios/getDatosRecientesEma/330007/2024/02?usuario=csaavedra@emt.cl&token=TcxMTU3MjIzMTM0Mw==IXmvxB');
  }

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

  getNombrePrismas() {
    return this.http.get<any>(this.urlNombrePrismas);
  }
  getDataPrismas() {
    return this.http.get<any>(this.urlDataPrismas);
  }
  getNombrePiezometros() {
    return this.http.get<any>(this.urlNombrePiezometro);
  }

  getMilimetrosPiezometros() {
    return this.http.get<any>(this.urlMilimetrosPiezometro);
  }


  sendPDF(data: FormData) {
    this.http.post<any>(this.urlPDF, data).subscribe(
      (res) => console.log(res)
    );
  }

}
