import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import * as leaf from 'leaflet';
import { FormControl, FormGroup } from '@angular/forms';
import { traduccionPuntosCardinales } from 'src/app/helpers';
import { GeneradorService } from '../generador.service';

@Component({
  selector: 'app-reporte-sismos',
  templateUrl: './reporte-sismos.component.html',
  styleUrls: ['./reporte-sismos.component.scss']
})
export class ReporteSismosComponent implements OnInit, AfterViewInit {

  constructor(private api: ApiService, private generador : GeneradorService) { }

  dataUltimosSismos: any[] = []
  map: any
  idSismoSeleccionado: string = 'seleccione un sismo'
  marker: any
  inputs = new FormGroup({
    fecha: new FormControl('')
  })
  fechaMaxima = new Date().toISOString().slice(0, 10)

  ngOnInit(): void {
    // this.loadUltimosSismosChile()
  }
  ngAfterViewInit(): void {
    this.loadMapa()
  }

  onSeleccionarFecha() {
    this.dataUltimosSismos = []
    let fecha = this.inputs.get('fecha')?.value
    if (this.marker) {
      this.map.removeLayer(this.marker)
    }
    if (fecha)
      this.loadSismoPorFecha(fecha, -31.7172237, -70.4905051)
  }

  seleccionarSismo(id: string, event: Event) {
    event.preventDefault()
    this.idSismoSeleccionado = id
    var estrella = leaf.icon({
      iconUrl: './assets/Sismos/sismoMarker.png',
      iconSize: [30, 30], // size of the icon
      // iconAnchor: [20, 20], // point of the icon which will correspond to marker's location
      popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    let dato = this.dataUltimosSismos.filter((data: any) => data.id == id)[0]
    if (dato) {
      if (this.marker) {
        this.map.removeLayer(this.marker)
      }
      this.marker = leaf.marker([dato.latitud, dato.longitud], { icon: estrella }).addTo(this.map);
    }
  }

  loadMapa() {
    this.map = leaf.map('map', {
      center: [-31.7172237, -70.4905051],
      zoom: 6,
      zoomControl: false,
      scrollWheelZoom: false
    });


    var estrella = leaf.icon({
      iconUrl: './assets/Sismos/minaMarker.png',
      iconSize: [20, 20], // size of the icon
      popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });



    leaf.marker([-31.7172237, -70.4905051], { icon: estrella }).addTo(this.map);

    const tiles = leaf.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  loadUltimosSismosChile() {
    this.api.getUltimosSismosChile().subscribe(data => {
      this.dataUltimosSismos = (data as any[])
    })
  }

  loadSismoPorFecha(fecha: string, latitud: number, longitud: number) {
    this.api.getSismosUSGC(fecha, latitud, longitud).subscribe((data: any) => {
      try {
        data.features.forEach((element: any) => {


          this.api.getMoreInfo(element.id).subscribe((moreData: any) => {
            let moreProps = moreData.properties.products.origin[0].properties
            console.log(moreData);
            let props = element.properties
            this.dataUltimosSismos.push({
              id: element.id,
              lugar: traduccionPuntosCardinales(props.place),
              magnitud: props.mag,
              magTipo: props.magType,
              tiempo: new Date(props.time).toLocaleString(),
              tiempoUTC: new Date(props.time).toUTCString(),
              latitud: moreProps.latitude,
              longitud: moreProps.longitude,
              profundidad: moreProps.depth
            })
          })
        });

      } catch (err) {
        console.log('ERROR CON LA CONSULTA');
      }
    })
  }


  generarPDF(){
    this.generador.descargarInforme()
  }

}
