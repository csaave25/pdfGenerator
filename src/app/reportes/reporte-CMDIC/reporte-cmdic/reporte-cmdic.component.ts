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
    this.api.getPozos().subscribe((data: any) => {
      leaf.geoJSON(data, {
        onEachFeature: (feature: any, layer) => {
          feature.properties = { ...feature.properties, popupContent: `Nombre: ${feature.properties.Id}`}
          if (feature.properties && feature.properties.popupContent) {
            layer.bindPopup(feature.properties.popupContent);
          }
        },
      }).addTo(this.map);
    })
  }



  loadMapa() {
    this.map = leaf.map('map', {
      center: [-20.974745542010133,-68.70741096645204, 4698.25],
      zoom: 15,
      zoomControl: false,
      // scrollWheelZoom: true,
    })

    const iconUrl = 'assets/Sismos/minaMarker.png'
    const iconDefault = leaf.icon({
      // iconRetinaUrl,
      iconUrl,
      iconSize: [20, 20],
      tooltipAnchor: [16, -28],
    });
    leaf.Marker.prototype.options.icon = iconDefault;

  }


}
