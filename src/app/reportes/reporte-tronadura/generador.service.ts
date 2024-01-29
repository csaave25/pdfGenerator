import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf'
import { latoBold, latoRegular, montBold, montMedium, montSemi } from 'src/assets/fonts/fonts';

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


  private generarHeader(fecha : Date, id: number) {
    let ano = fecha.getFullYear().toString()
    let fechaSubTitulo = '299d,99fsa'
    this.doc.setFontSize(16)
    this.doc.setFont("Lato", "normal");
    this.doc.text('REPORTE FLASH POST-EVENTO SÍSMICO', this.puntoMedio, 50, { align: 'center' })
    this.doc.setFontSize(12)
    this.doc.setFont("Lato", "normal");
    this.doc.text(fechaSubTitulo, this.puntoMedio, 65, { align: 'center' })
    this.doc.text(ano + '.' + id, this.margenIzq, 80, { align: 'left' })
    this.doc.text('IYV-IF-VIG-MLP-02', this.margenDer, 80, { align: 'right' })
    this.doc.line(this.margenIzq, 82, this.margenDer, 82)

    this.doc.addImage('assets/EMT/logo.png', 'PNG', 486, 20, 90, 40, 'LOGO_EMT', 'FAST')

  }

  private generarFooter(fecha: Date, nombre: string, id: number) {
    this.doc.setFontSize(10)
    this.doc.setFont("Lato", "normal");
    let ano = fecha.getFullYear()
    let numPag = this.doc.getNumberOfPages()
    this.doc.text(nombre, this.margenIzq, 780, { align: 'left' })
    this.doc.text(ano + '.' + id, this.margenDer, 780, { align: 'right' })
    this.doc.text(numPag.toString(), this.puntoMedio, 780, { align: 'center' })
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

  private implementarContenidoPDF() {
    this.implementarFuentes()
    this.generarHeader(new Date(), 1)
    this.generarFooter(new Date(), ' ', 1)

  }

  public previzualizarPDF() {
    this.implementarContenidoPDF()
    this.doc.output('dataurlnewwindow')
  }


}
