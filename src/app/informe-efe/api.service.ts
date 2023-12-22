import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  // geoCentinelas: any

  private urlGeocentinelas = "https://consultasefe.emt.cl/api/geocentinelas"
  private urlEstadoGeocentinelas = "https://consultasefe.emt.cl/api/geocentinelas/corte/estado"
  private urlProfundidadGeocentinela = "https://consultasefe.emt.cl/api/geocentinelas/corte"
  private urlPDF = "http://10.10.10.18:6450/api/insertos/pdf/testing"

  getGeocentinelas() {
    return this.http.get<any>(this.urlGeocentinelas);
  }

  getEstadoCentinela() {
    return this.http.get<any>(this.urlEstadoGeocentinelas);
  }

  getProfundidadGeocentinela() {
    return this.http.get<any>(this.urlProfundidadGeocentinela);
  }


  sendPDF(doc: any) {
    let data = new FormData()
    let base64: any
    
    function getBase64(file: any) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        base64 = reader.result
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
      };
    }
    console.log(base64);
    getBase64(doc)
    console.log(base64);
    data.append('file',base64)
    data.append('fecha', '2023-12-27 15:30:00')

    this.http.post<any>(this.urlPDF, data).subscribe(
      (res) => console.log(res)
    );
  }

  /* lo que esta ocurriendo es que no puedo mandar el blob ya que me dice que no es una entidad procesable para eso */


}
