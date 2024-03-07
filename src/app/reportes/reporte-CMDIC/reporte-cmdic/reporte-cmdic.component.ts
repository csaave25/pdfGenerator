import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as leaf from 'leaflet';
import { ApiService } from '../api.service';
import { FormControl, FormGroup } from '@angular/forms';
import { GeneradorService } from '../generador.service';
import domtoimage from 'dom-to-image';
import geojsonvt from 'geojson-vt';


@Component({
  selector: 'app-reporte-cmdic',
  templateUrl: './reporte-cmdic.component.html',
  styleUrls: ['./reporte-cmdic.component.scss']
})
export class ReporteCMDICComponent implements AfterViewInit {

  @ViewChild("mapaElement") mapa!: ElementRef
  @ViewChild("table") tabla!: ElementRef


  imagenMapa = new Image()
  map: any
  inputs = new FormGroup({
    fecha: new FormControl(''),
    resumen: new FormControl(''),
    principales: new FormControl(''),
    segundarios: new FormControl(''),
  })

  contadorRow = 0


  constructor(private api: ApiService, private generador: GeneradorService) { }


  ngAfterViewInit(): void {

    this.loadMapa()
    this.loadDataTopo()
    this.loadDataPozos()
    // this.loadDataBasePozo()

  }

  loadScreenshotMapa() {

    var node = this.mapa.nativeElement
    let img = new Image();
    var scale = 2;
    domtoimage.toPng(node, {
      width: node.clientWidth * scale,
      height: node.clientHeight * scale,
      style: {
        transform: 'scale(' + scale + ')',
        transformOrigin: 'top left'
      }
    })
      .then(function (dataUrl: any) {
        img.src = dataUrl;
      })
      .catch(function (error: any) {
        console.error('error', error);
      });

    this.imagenMapa = img
  }


  // loadScreenshotMapa() {


  // }

  loadDataTopo() {

    this.api.getTopo().subscribe((data: any) => {
      leaf.geoJSON(data, { style: { weight: .1, color: 'black' } }
      ).addTo(this.map)
      this.loadScreenshotMapa()
    })
  }

  loadDataPozos() {

    const iconUrl = 'assets/CMDIC/circulo.png'
    this.api.getPozos().subscribe((data: any) => {
      leaf.geoJSON(data, {
        pointToLayer: (feature, latlng) => {
          let color = ''
          let width = '1.3rem'
          let height = '1.3rem'
          let mt = '16px'
          let ml = '16px'
          if (feature.properties.Caudal == null) {
            color = 'grey'
            width = '.8rem'
            height = '.8rem'
            mt = '10px'
            ml = '10px'

          } else {
            if (feature.properties.Caudal > 4.7) {
              color = '#1161EA'
            } else {
              if (feature.properties.Caudal <= 4.7 && feature.properties.Caudal > 3.5) {
                color = '#548CEB'
                width = '1.2rem'
                height = '1.2rem'
                mt = '15px'
                ml = '15px'
              } else {
                if (feature.properties.Caudal <= 3.5 && feature.properties.Caudal > 2.4) {
                  color = '#31A5F0'
                  width = '1.1rem'
                  height = '1.1rem'
                  mt = '13px'
                  ml = '13px'
                } else {
                  if (feature.properties.Caudal <= 2.4 && feature.properties.Caudal > 1.2) {
                    color = '#7EC0E3'
                    width = '.9rem'
                    height = '.9rem'
                    mt = '8px'
                    ml = '12px'
                  } else {
                    if (feature.properties.Caudal <= 1.2) {
                      color = '#B3D7ED'
                      width = '.8rem'
                      height = '.8rem'
                      mt = '4px'
                      ml = '12px'
                    }

                  }
                }
              }
            }
          }

          const markerHtmlStyles = `
          background-color: ${color};
          width: ${width};
          height: ${height};
          display: block;
          position: relative;
          border-radius: 2rem;
          // transform: rotate(45deg);
          border: 2px solid black;`

          const style = `
          margin-top: ${mt};
          margin-left: ${ml};
          font-weight: bold;
          `

          const icon = leaf.divIcon({
            className: "my-custom-pin",
            iconSize: [20, 20],
            html: `<span style="${markerHtmlStyles}" />
            <p class="pTag" style="${style}">${feature.properties.Id}</p>`
          })

          return leaf.marker(latlng, { icon })
        },
        onEachFeature: (feature: any, layer) => {
          if (feature.properties) {


            layer.bindPopup(`
              <div class="container-popup">
                  <h4 style= 'Font-size: 15px; font-weight: 700;'>${feature.properties.Id}</h4>
                  <hr style='margin-top: 0' />
                  <div>  
                    <p> <span style='font-weight: 600'>Fecha:</span> ${new Date(feature.properties.Fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', })}</p>
                    <p> <span style='font-weight: 600'>Caudal:</span> ${feature.properties.Caudal}</p>
                  </div>
              </div>
            `);
          }
        },
      }).addTo(this.map);
    })
  }

  loadDataBasePozo() {
    this.api.getBaseDatosPozos().subscribe((data: any) => {
      console.log(data);

    })
  }



  loadMapa() {
    this.map = leaf.map('map', {
      center: [-20.974745542010133, -68.70741096645204, 4698.25],
      zoom: 16,
      zoomControl: false,
      // scrollWheelZoom: true,
    })

    // const iconUrl = 'assets/Sismos/minaMarker.png'
    // const iconDefault = leaf.icon({
    //   // iconRetinaUrl,
    //   iconUrl,
    //   iconSize: [20, 20],
    //   tooltipAnchor: [16, -28],
    // });
    // leaf.Marker.prototype.options.icon = iconDefault;

  }


  generateRow() {
    let id = this.contadorRow
    this.contadorRow++
    let mockup = `
             
                <td style="padding: 0;"><input style="border-radius: 0;" id="foco-${id}"  mdbInput type="text" id="form1" class="form-control form-control-sm" placeholder="Foco"/></td>
                <td style="padding: 0;"> <input style="border-radius: 0;"  id="comentario-${id}" mdbInput type="text" id="form1" class="form-control form-control-sm" placeholder="Comentario"/></td>
                <td style="width: 100px; padding: 0;">
                <select style="border-radius: 0;"   id="estado-${id}" class="form-control form-control-sm" >
                      <option hidden>Seleccione</option>
                                <option value="alto">Alto</option>
                                <option value="medio">Medio</option>
                                <option value="bajo">Bajo</option>
                </select>
                        </td>
              
    `
    let row = document.createElement('tr')
    row.innerHTML = mockup
    row.setAttribute('id', `row-${id}`)
    this.tabla.nativeElement.appendChild(row)

  }

  deleteRow() {
    this.tabla.nativeElement.removeChild(this.tabla.nativeElement.lastChild)  //borra el ultimo hijo
  }


  generarPDF() {
    // this.loadScreenshotMapa()
    setTimeout(() => {
      this.generador.descargarPDF(this.inputs, this.imagenMapa)

    }, 1000);
  }


}
