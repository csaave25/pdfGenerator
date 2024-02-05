import { AfterViewInit, Component } from '@angular/core';
import * as leaf from 'leaflet';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-reporte-cmdic',
  templateUrl: './reporte-cmdic.component.html',
  styleUrls: ['./reporte-cmdic.component.scss']
})
export class ReporteCMDICComponent implements AfterViewInit {


  map: any


  constructor(private api: ApiService) { }


  ngAfterViewInit(): void {

    this.loadMapa()
    this.loadDataTopo()
    this.loadDataPozos()

  }



  loadDataTopo() {

    this.api.getTopo().subscribe((data: any) => {
      leaf.geoJSON(data, { style: { weight: .1, color: 'black' } }
      ).addTo(this.map)
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
                  mt = '11px'
                  ml = '11px'
                } else {
                  if (feature.properties.Caudal <= 1.2) {
                    color = '#B3D7ED'
                    width = '.8rem'
                    height = '.8rem'
                    mt = '10px'
                    ml = '10px'
                  } else {
                    color = 'grey'
                    width = '.8rem'
                    height = '.8rem'
                    mt = '10px'
                    ml = '10px'
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
            <p style="${style}">${feature.properties.Id}</p>`
          })

          return leaf.marker(latlng, { icon })
        },
        onEachFeature: (feature: any, layer) => {
          feature.properties = { ...feature.properties, popupContent: `Nombre: ${feature.properties.Id}` }
          if (feature.properties && feature.properties.popupContent) {
            layer.bindPopup(feature.properties.popupContent);
          }
        },
      }).addTo(this.map);
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


}
