import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas';
import { PdfGenerateService } from '../pdf-generate.service';
import { from } from 'rxjs';


@Component({
  selector: 'app-new-pdf',
  templateUrl: './new-pdf.component.html',
  styleUrls: ['./new-pdf.component.scss']
})
export class NewPDFComponent {

  constructor(private generaService: PdfGenerateService) { }


  export = false

  reporte = new FormGroup({
    fecha: new FormControl(''),
    observaciones: new FormControl('Sin observaciones'),
    zona: new FormControl(''),
    pared: new FormControl(null),
    este: new FormControl(NaN), 
    norte: new FormControl(NaN),
    cota: new FormControl(NaN),
    produccion: new FormControl(false),
    precorte: new FormControl(false),
    destape: new FormControl(false),
    bolones: new FormControl(false),
    desquinche: new FormControl(false),
    contorno: new FormControl(false),
    pozosProduccion: new FormControl(NaN),
    nMallas: new FormControl(NaN),
    pozosPrecorte: new FormControl(NaN),
    factorCarga: new FormControl(NaN),
    Volumne: new FormControl(NaN),
    mapaSintetico: new FormControl(null),
    graficoDesplazaminetotiempo: new FormControl(null),
    radar: new FormControl(''),
    descripcionPunto: new FormControl(NaN),
    radarEste: new FormControl(NaN),
    radarNorte: new FormControl(NaN),
    radarCota: new FormControl(NaN),
    deplazamiento4horas: new FormControl(NaN),
    velocidadPromedio: new FormControl(NaN),
    posicionTronadura: new FormControl(null),
    antesPanoramica: new FormControl(null),
    despuesPanoramica: new FormControl(null),
    antesZoom: new FormControl(null),
    despuesZoom: new FormControl(null),
    antesSuperior: new FormControl(null),
    DespuesSuperior: new FormControl(null),
    antesInferior: new FormControl(null),
    despuesinferior: new FormControl(null),
  });

  changeState() {
    this.export = !this.export

  }





  generatePDF() {

    let zona = 'Zona 23'
    let este = 22
    let norte = 22
    let cota = 22
    let fecha = new Date()

    let form = this.reporte.controls
    this.generaService.tampleEMT()
    this.generaService.doc.addPage()
    this.generaService.generateHeader(zona, este, norte, cota, this.generaService.getFecha(fecha))
    this.generaService.generateFooter()
    this.generaService.planoDeUbicacion()
    this.generaService.informacionTronadura(form.produccion.value!, form.precorte.value!, form.destape.value!, form.bolones.value!,
      form.desquinche.value!, form.contorno.value!, form.pozosProduccion.value!, form.pozosPrecorte.value!, form.nMallas.value!,
      form.Volumne.value!, form.factorCarga.value!)
    this.generaService.controlSector(form.radar.value!, form.descripcionPunto.value!, form.radarEste.value!, form.radarNorte.value!, form.radarCota.value!, form.deplazamiento4horas.value!, form.velocidadPromedio.value!)
    this.generaService.generarImagenes()
    this.generaService.previsualizar()
  }


}
