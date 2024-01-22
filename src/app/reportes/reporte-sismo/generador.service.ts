import { ElementRef, Injectable, QueryList } from '@angular/core';
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { latoBold, latoRegular, montBold, montMedium, montSemi } from 'src/assets/fonts/fonts';
// import { colores, data, formateadoraDeTexto, justify, obtenerAncho } from './data';
import { AbstractControl, FormGroup } from '@angular/forms';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class GeneradorService {

  constructor() { }

  private doc = new jsPDF('p', 'pt', 'letter', true)
  private margenIzq = 40
  private margenDer= 611-this.margenIzq
  private puntoMedio = (this.doc.internal.pageSize.width || this.doc.internal.pageSize.getWidth()) / 2
  private margenTexto = this.margenDer - this.margenIzq
  private usoPagina = 40



  private generarHeader(fecha: Date, id: number) {
    let ano = fecha.getFullYear().toString()
    this.doc.setFontSize(16)
    this.doc.setFont("Lato", "normal");
    this.doc.text('REPORTE FLASH POST-EVENTO SÍSMICO', this.puntoMedio, 50, {align: 'center'})
    this.doc.setFontSize(12)
    this.doc.setFont("Lato", "normal");
    this.doc.text(fecha.toLocaleString(),this.puntoMedio, 65, {align: 'center'})
    this.doc.text(ano +'.' + id,this.margenIzq, 80, {align: 'left'})
    this.doc.text('IYV-RP-VIG-MLP-02',this.margenDer, 80, {align: 'right'})
    this.doc.line(this.margenIzq,82,this.margenDer,82)

  }

  private implementarFuentes() {
    this.doc.addFileToVFS("Lato-Font-bold.ttf", latoBold);
    this.doc.addFont("Lato-Font-bold.ttf", "Lato", "bold");
    this.doc.addFileToVFS("Lato-Font-normal.ttf", latoRegular);
    this.doc.addFont("Lato-Font-normal.ttf", "Lato", "normal");
    this.doc.addFileToVFS("Montserrat-Bold.ttf", montBold);
    this.doc.addFont("Montserrat-Bold.ttf", "Montserrat", "bold");
    this.doc.addFileToVFS("Montserrat-Medium.ttf", montMedium);
    this.doc.addFont("Montserrat-Medium.ttf", "Montserrat", "normal");
    this.doc.addFileToVFS("Montserrat-SemiBold.ttf", montSemi);
    this.doc.addFont("Montserrat-SemiBold.ttf", "Montserrat", "semibold")
  }

  private implementarContenido(){
    this.implementarFuentes()
    this.generarHeader(new Date(),2)
  }

  public descargarInforme() {
    this.implementarContenido()
    this.doc.output('dataurlnewwindow')
  }

}
