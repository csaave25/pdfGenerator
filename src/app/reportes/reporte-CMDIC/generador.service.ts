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
  private margenTexto = this.margenIzq + 20
  private identificador = 'CMDIC-001'


  private fecha = new Date().toLocaleDateString('es-CL', { day: '2-digit', weekday: 'long', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })


  constructor() { }




  private implementarResumen(inputs: FormGroup) {
    this.doc.setFontSize(14)
    this.doc.setFont("Lato", "bold");
    this.doc.text('Resumen Caudal', this.margenIzq, this.usoPagina, { align: 'left' })

    this.usoPagina += 25

    let incidentes = inputs.get('resumen')?.value
    this.doc.setFontSize(10)
    this.doc.setFont("Lato", "normal");
    if (incidentes.length < 2) {
      this.doc.text('Sin incidentes que reportar.', this.margenTexto, this.usoPagina, { align: 'left' })
    } else {
      this.usoPagina = formateadoraDeTexto(this.doc, incidentes, this.usoPagina, this.margenTexto, this.margenDer)
    }


    this.usoPagina += 100

  }




  private implmentarFocosPrincipales(inputs: FormGroup) {
    this.doc.setFontSize(14)
    this.doc.setFont("Lato", "bold");
    this.doc.text('Focos Principales', this.margenIzq, this.usoPagina, { align: 'left' })

    this.usoPagina += 25

    let focos = inputs.get('principales')?.value
    this.doc.setFontSize(10)
    this.doc.setFont("Lato", "normal");
    if (focos.length < 2) {
      this.doc.text('Sin focos que reportar.', this.margenTexto, this.usoPagina, { align: 'left' })
    } else {
      this.usoPagina = formateadoraDeTexto(this.doc, focos, this.usoPagina, this.margenTexto, this.margenDer)
    }

    this.usoPagina += 40
  }


  private implementarFocosSegundarios(inputs: FormGroup, imagenMapa: HTMLImageElement) {
    this.doc.setFontSize(14)
    this.doc.setFont("Lato", "bold");
    this.doc.text('Focos Segundarios', this.margenIzq, this.usoPagina, { align: 'left' })

    this.usoPagina += 25

    let focos = inputs.get('segundarios')?.value
    this.doc.setFontSize(10)
    this.doc.setFont("Lato", "normal");
    if (focos.length < 2) {
      this.doc.text('Sin focos que reportar.', this.margenTexto, this.usoPagina, { align: 'left' })
    } else {
      this.usoPagina = formateadoraDeTexto(this.doc, focos, this.usoPagina, this.margenTexto, this.margenDer)
    }

    this.usoPagina += 40
    this.doc.addImage(imagenMapa.src, 'PNG', this.margenIzq + 125, this.usoPagina, 300, 200, 'MAPA', 'FAST')
  }
  
  private implementarFooter() {
    this.doc.setFontSize(12)
    this.doc.setFont("Lato", "normal");
    let numPag = this.doc.getNumberOfPages()
    this.doc.text('CODIGO', this.margenIzq, 772, { align: 'left' })
    this.doc.text('CMDIC-001', this.margenDer, 772, { align: 'right' })
    this.doc.text(numPag.toString(), this.puntoMedio, 772, { align: 'center' })

  }

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

  implementaSecciones(inputs: FormGroup, imagenMapa: HTMLImageElement) {
    this.implementarFuentes()
    this.implementarHeader()
    this.implementarFooter()
    this.implementarResumen(inputs)
    this.implmentarFocosPrincipales(inputs)
    this.implementarFocosSegundarios(inputs, imagenMapa)

  }


  descargarPDF(inputs: FormGroup, imagenMapa: HTMLImageElement) {
    this.implementaSecciones(inputs, imagenMapa)
    // this.doc.save('reporte.pdf')
    this.doc.output('dataurlnewwindow')
    this.reiniciarPDF()
  }

  reiniciarPDF() {
    this.doc = new jsPDF('p', 'pt', 'letter')
    this.usoPagina = this.margenContenido
  }


}
