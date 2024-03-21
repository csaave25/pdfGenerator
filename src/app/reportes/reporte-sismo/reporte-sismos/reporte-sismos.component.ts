import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import * as leaf from 'leaflet';
import { FormControl, FormGroup } from '@angular/forms';
import { traduccionPuntosCardinales } from 'src/app/helpers';
import { prevenirSaltosDeLinea } from 'src/app/helpers';
import html2canvas from 'html2canvas';
import domtoimage from 'dom-to-image';


@Component({
  selector: 'app-reporte-sismos',
  templateUrl: './reporte-sismos.component.html',
  styleUrls: ['./reporte-sismos.component.scss']
})
export class ReporteSismosComponent implements OnInit, AfterViewInit {

  @ViewChild("mapaElement") mapa!: ElementRef

  constructor(private api: ApiService) { }

  dataUltimosSismos: any[] = []
  texto1 = ''
  map: any
  idSismoSeleccionado: string = 'seleccione un sismo'
  datoSeleccionado: any
  marker: any
  inputs = new FormGroup({
    fecha: new FormControl(''),
    id: new FormControl(0),
    estacion: new FormControl(''),
    radar: new FormControl(''),
    observaciones: new FormControl('')
  })
  fechaMaxima = new Date().toISOString().slice(0, 10)
  imagenMapa = new Image()

  ngOnInit(): void {
    // this.loadUltimosSismosChile()
  }
  ngAfterViewInit(): void {
    this.loadMapa()
  }

  prevenir(numSaltosPermitidos: number, evt: Event) {
    prevenirSaltosDeLinea(numSaltosPermitidos, evt)
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
    this.datoSeleccionado = dato

    if (dato) {
      if (this.marker) {
        this.map.removeLayer(this.marker)
      }
      this.marker = leaf.marker([dato.latitud, dato.longitud], { icon: estrella }).addTo(this.map);
    }
    this.loadScreenshotMapa()
  }

  loadMapa() {
    this.map = leaf.map('map', {
      center: [-31.7172237, -70.4905051],
      zoom: 6,
      zoomControl: false,
      scrollWheelZoom: false,

    });


    var estrella = leaf.icon({
      iconUrl: './assets/Sismos/minaMarker.png',
      iconSize: [20, 20], // size of the icon
      popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    leaf.marker([-31.7172237, -70.4905051], { icon: estrella }).addTo(this.map);

    const tiles = leaf.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',

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
            let props = element.properties
            this.dataUltimosSismos.push({
              id: element.id,
              lugar: traduccionPuntosCardinales(props.place),
              magnitud: props.mag,
              magTipo: props.magType,
              tiempo: new Date(props.time).toISOString(),
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


  loadScreenshotMapa() {

    var node = this.mapa.nativeElement
    let img = new Image();
    var scale = 1;
    domtoimage.toPng(node, {
      width: node.clientWidth * scale,
      height: node.clientHeight * scale,
      style: {
        transform: 'scale(' + scale + ')',
        transformOrigin: 'top left'
      }
    })
      .then((dataUrl: any) => {
        img.src = dataUrl;
        this.imagenMapa = img


      })
      .catch(function (error: any) {
        console.error('error', error);
      });

  }


  formateador(e: Event) {
    let str = (e.target as HTMLInputElement).value
    // let str = e
    let arrStr = str.split('\n')
    let newString = ''

    arrStr.forEach((str, index) => {

      if (str[0] + str[1] == '- ') {
        str = str.replace('- ', '  • ')
      }

      if (index != 0) {
        newString += '\n' + str
      } else {
        newString += str
      }
    })

    str = newString
    this.inputs.get('observaciones')?.setValue(str)
  }

  transformImageURLtoBlob(url: string) {
    const byteString = atob(url.split(',')[1]);
    const mimeString = url.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });

    return blob
  }


  enviarDatos() {

    let body = JSON.stringify( {...this.inputs.value, imagen: this.imagenMapa.src, dataSismo: this.datoSeleccionado})
    console.log( body);
    
    this.api.guardarDatos(body).subscribe((res) => {
      let blob = new Blob([res as any], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // window.open(url, '_blank'); // <- uncomment this line to open the PDF in a new tab 
      link.download = 'report.pdf';
      link.click();
      window.URL.revokeObjectURL(url);
    });

  }

}
