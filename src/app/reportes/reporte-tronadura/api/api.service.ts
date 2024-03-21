import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http : HttpClient) { }



  getReporteTronadura(body : string){
    return this.http.post('http://localhost:3000/api/servicio/tronadura', {body});
  }

}
