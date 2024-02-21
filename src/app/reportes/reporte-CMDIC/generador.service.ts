import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { jsPDF } from 'jspdf'
import { latoBold, latoRegular, montBold, montMedium, montSemi } from 'src/assets/fonts/fonts';
import autoTable from 'jspdf-autotable';
import { formateadoraDeTexto } from './data';

@Injectable({
  providedIn: 'root'
})
export class GeneradorService {


  private doc = new jsPDF('p', 'pt', 'letter')
  private margenIzq = 40
  private margenDer = 611 - this.margenIzq
  private puntoMedio = (this.doc.internal.pageSize.width || this.doc.internal.pageSize.getWidth()) / 2
  private margenContenido = 115
  private usoPagina = this.margenContenido
  private contadorFig = 1
  private contadorTabla = 1
  private identificador = 'CMDIC-001'

  private fecha = new Date().toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' , hour: '2-digit', minute: '2-digit'})


  constructor() { }







  private implementarHeader() {
    
    this.doc.setFontSize(16)
    this.doc.setFont("Lato", "bold");
    this.doc.text('REPORTE DIARIO DESAGUADO MINA', this.puntoMedio, 50, { align: 'center' })
    this.doc.setFontSize(12)
    this.doc.setFont("Lato", "normal");
    this.doc.text(this.fecha, this.puntoMedio, 65, { align: 'center' })
    this.doc.text(this.identificador, this.margenIzq, 80, { align: 'left' })
    // this.doc.text(this.fecha, this.puntoMedio, 80, { align: 'center' })
    this.doc.text('CODIGO', this.margenDer, 80, { align: 'right' })
    this.doc.line(this.margenIzq, 82, this.margenDer, 82)

    this.doc.addImage('assets/CMDIC/logo.png', 'PNG', this.margenIzq, 20, 90, 40, 'LOGO_EMT', 'FAST')
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

  implementaSecciones(){
    this.implementarFuentes()
    this.implementarHeader()

  }


  descargarPDF(inputs : FormGroup) {
    this.implementaSecciones()
    this.doc.save('reporte.pdf')
  }


}
