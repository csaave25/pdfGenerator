import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ConsultasService {

  url: string = 'https://apps.emt.cl/api/images/alertas/alta';


  constructor(private http: HttpClient) { }

  getHttp(): Observable<any> {
    return this.http.get<any>(this.url);
  }
}
