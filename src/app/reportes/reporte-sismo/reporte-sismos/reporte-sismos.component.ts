import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-reporte-sismos',
  templateUrl: './reporte-sismos.component.html',
  styleUrls: ['./reporte-sismos.component.scss']
})
export class ReporteSismosComponent implements OnInit {

  constructor(private api: ApiService) { }

  dataUltimosSismos: any[] = []


  ngOnInit(): void {
    this.loadUltimosSismosChile()
  }

  loadUltimosSismosChile() {
    this.api.getUltimosSismosChile().subscribe(data => {
      this.dataUltimosSismos = (data as any[])
    })
  }


}
