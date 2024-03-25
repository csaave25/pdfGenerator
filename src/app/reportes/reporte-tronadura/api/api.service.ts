import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http : HttpClient) { }



  getReporteTronadura(body : any){
    let URL = 'http://localhost:3000/api/services/tronadura'
    return this.http.post(URL, body,  { responseType: 'blob' });
  }

}
