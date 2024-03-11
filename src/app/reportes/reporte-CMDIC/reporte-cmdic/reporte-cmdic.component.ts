import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { FormControl, FormGroup } from '@angular/forms';
import { GeneradorService } from '../generador.service';
import { MapaService } from '../mapa.service';
import { TablaDato } from '../reporte.types';



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
    hora: new FormControl(''),
    resumen: new FormControl(''),
    principales: new FormControl(''),
    segundarios: new FormControl(''),
  })
  contadorRow = 0
  infoTabla: TablaDato[] = []
  seleccionaronFecha = false
  seleccionaronHora = false


  constructor(private api: ApiService, private generador: GeneradorService, private mapaService: MapaService) { }


  ngAfterViewInit(): void {

    this.map = this.mapaService.loadMapa()
    this.mapaService.loadDataPozos(this.map)
    this.mapaService.loadDataTopo(this.map, this.mapa, this.imagenMapa)
    // this.loadDataBasePozo()
  }

  loadDataApi( fecha : string, hora: string) {

  }

  selectionDate(event: Event) {
    let target = event.target as HTMLInputElement
    if (target.id === 'fecha') {
      this.seleccionaronFecha = true
    } else if (target.id === 'hora') {
      this.seleccionaronHora = true

    }

    if(this.seleccionaronFecha && this.seleccionaronHora){
      
      let fecha = this.inputs.get('fecha')?.value?.replaceAll('-', '/')
      let hora = this.inputs.get('hora')?.value
      
      //loadDataApi(fecha, hora)
    }
  }

  loadDataBasePozo() {
    this.api.getBaseDatosPozos().subscribe((data: any) => {
      console.log(data);

    })
  }

  deleteLastElementTable() {
    this.infoTabla.pop()
  }

  generateRow() {
    let id = this.contadorRow
    this.contadorRow++
    let mockup = `
                <td style="padding: 0;"><input style="border-radius: 0;" id="foco-${id}"  mdbInput type="text" id="form1" class="form-control form-control-sm" placeholder="Foco"/></td>
                <td style="padding: 0;"> <input style="border-radius: 0;"  id="comentario-${id}" mdbInput type="text" id="form1" class="form-control form-control-sm" placeholder="Comentario"/></td>
                <td  style="padding: 0;">
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

    document.getElementById(`foco-${id}`)?.addEventListener('change', (e: Event) => {
      let target = e.target as HTMLInputElement
      this.infoTabla[id] = this.infoTabla[id] ? { ...this.infoTabla[id], foco: target.value } : { foco: target.value, comentario: '', estado: '' }

    })

    document.getElementById(`comentario-${id}`)?.addEventListener('change', (e: Event) => {
      let target = e.target as HTMLInputElement
      this.infoTabla[id] = this.infoTabla[id] ? { ...this.infoTabla[id], comentario: target.value } : { foco: '', comentario: target.value, estado: '' }

    })

    document.getElementById(`estado-${id}`)?.addEventListener('change', (e: Event) => {
      let target = e.target as HTMLInputElement
      this.infoTabla[id] = this.infoTabla[id] ? { ...this.infoTabla[id], estado: target.value } : { foco: '', comentario: '', estado: target.value }

    })


  }

  deleteRow() {
    if (this.infoTabla.length > 0) {
      this.tabla.nativeElement.removeChild(this.tabla.nativeElement.lastChild)  //borra el ultimo hijo
      this.deleteLastElementTable()
    }

  }


  generarPDF() {
    setTimeout(() => {
      this.generador.descargarPDF(this.inputs, this.imagenMapa, this.infoTabla)
    }, 1000);
  }


}
