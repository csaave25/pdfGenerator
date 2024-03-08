import { ElementRef, Injectable } from '@angular/core';
import * as leaf from 'leaflet';
import { ApiService } from './api.service';
import { loadScreenshotMapa } from './helpers';
import { image } from 'html2canvas/dist/types/css/types/image';

@Injectable({
  providedIn: 'root'
})
export class MapaService {

  constructor(private api: ApiService) { }


  loadDataTopo(mapa: any, mapaElement: ElementRef, imagenMapa: any) {
    return this.api.getTopo().subscribe((data: any) => {
      leaf.geoJSON(data, { style: { weight: .1, color: 'black' } }
      ).addTo(mapa)
      loadScreenshotMapa(mapaElement, imagenMapa)
    })


  }

  loadDataPozos(mapa: any) {

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
      }).addTo(mapa);
    })
  }


  loadMapa() {
    return leaf.map('map', {
      center: [-20.974745542010133, -68.70741096645204, 4698.25],
      zoom: 16,
      zoomControl: false,
      // scrollWheelZoom: true,
    })
  }

}
