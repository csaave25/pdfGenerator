import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }


  getUltimosSismosChile() {
    return this.http.get('https://api.gael.cloud/general/public/sismos')
  }

  getSismosUSGC(fecha: string, latitud: number, longitud: number) {
    let siguienteDia = new Date(fecha)
    siguienteDia.setDate(siguienteDia.getDate() + 1)
    let manana = new Date(siguienteDia).toISOString().slice(0,10)
    
    return this.http.get(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=4&latitude=${latitud}&longitude=${longitud}&maxradiuskm=450&starttime=${fecha}&endtime=${manana}`)
  }

  getMoreInfo(id : string){
    // https://earthquake.usgs.gov/fdsnws/event/1/query?eventid=us7000labe&format=geojson
    return this.http.get(`https://earthquake.usgs.gov/fdsnws/event/1/query?eventid=${id}&format=geojson`)


  }

}
