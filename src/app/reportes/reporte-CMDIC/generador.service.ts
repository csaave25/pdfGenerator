import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { jsPDF } from 'jspdf'
import { latoBold, latoRegular, montBold, montMedium, montSemi } from 'src/assets/fonts/fonts';
import autoTable from 'jspdf-autotable';
import { formateadoraDeTexto } from './data';
import { TablaDato } from './reporte.types';

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
  private formatoFecha = ''
  private codigo = ''


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
      this.usoPagina += 15
    } else {
      this.usoPagina = formateadoraDeTexto(this.doc, incidentes, this.usoPagina, this.margenTexto, this.margenDer)
    }



    autoTable(this.doc, {
      theme: 'grid',
      styles: { halign: 'left', font: 'Lato', fontStyle: 'normal', fontSize: 8, fillColor: undefined, lineColor: [1, 48, 51], textColor: [1, 48, 51], lineWidth: .1, cellPadding: 2.5 },
      headStyles: { font: 'Lato', fontStyle: 'bold', fillColor: undefined },
      columnStyles: { 1: { cellWidth: 150 } },
      body: [['Caudal Diario R+U', '138,1 l/s'], ['Caudal Promedio Mes', '148,1 l/s'], ['Caudal Promedio Plan Enero', '134,1 l/s']],
      tableWidth: 300,
      margin: { left: this.puntoMedio - 150 },
      startY: this.usoPagina,
      alternateRowStyles: { fillColor: undefined },
      rowPageBreak: 'avoid',
    })



    this.usoPagina += 80

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
      this.usoPagina += 35

    } else {
      this.usoPagina = formateadoraDeTexto(this.doc, focos, this.usoPagina, this.margenTexto, this.margenDer)
      this.usoPagina += 15
    }

  }


  private implementarFocosSegundarios(inputs: FormGroup, imagenMapa: HTMLImageElement, TablaDatos: TablaDato[]) {
    this.doc.setFontSize(14)
    this.doc.setFont("Lato", "bold");
    this.doc.text('Focos Segundarios', this.margenIzq, this.usoPagina, { align: 'left' })

    this.usoPagina += 25

    let focos = inputs.get('segundarios')?.value
    this.doc.setFontSize(10)
    this.doc.setFont("Lato", "normal");
    if (focos.length < 2) {
      this.doc.text('Sin focos que reportar.', this.margenTexto, this.usoPagina, { align: 'left' })
      this.usoPagina += 30
    } else {
      this.usoPagina = formateadoraDeTexto(this.doc, focos, this.usoPagina, this.margenTexto, this.margenDer)
      this.usoPagina += 10

    }

    this.implementarNuevaPagina(200)

    this.doc.setFontSize(8)
    this.doc.setFont("Lato", "normal");
    // this.doc.addImage(imagenMapa.src, 'PNG', this.margenIzq + 125, this.usoPagina, 300, 200, 'MAPA', 'FAST')
    this.doc.addImage('assets/EFE/estacion6.png', 'PNG', this.puntoMedio - 150, this.usoPagina, 300, 200, 'MAPA', 'FAST')
    this.doc.text('Figura 1: Mapa Topográfico', this.puntoMedio, this.usoPagina + 210, { align: 'center' })

    this.usoPagina += 230


    this.implementarNuevaPagina(10)

    let i = 0
    if (TablaDatos.length > 0) {
      let datos: any = []
      TablaDatos.forEach((dato, index) => {
        datos.push([dato.foco, dato.comentario, ''])
      })

      this.doc.setFontSize(8)
      this.doc.setFont("Lato", "normal");
      this.doc.text('Tabla 1: Focos', this.puntoMedio, this.usoPagina - 4, { align: 'center' })

      let page = this.doc.getCurrentPageInfo().pageNumber
      autoTable(this.doc, {
        theme: 'grid',
        styles: { halign: 'left', font: 'Lato', fontStyle: 'normal', fontSize: 8, fillColor: undefined, lineColor: [1, 48, 51], textColor: [1, 48, 51], lineWidth: .1, cellPadding: 2 },
        headStyles: { font: 'Lato', fontStyle: 'bold', fillColor: '#D9D9D9', halign: 'center' },
        columnStyles: { 2: { cellWidth: 50 } },
        head: [['Foco', 'Comentario', 'Estado']],
        body: datos,
        tableWidth: 340,
        margin: { left: this.puntoMedio - 170, top: 115 },
        startY: this.usoPagina,
        alternateRowStyles: { fillColor: undefined },
        rowPageBreak: 'avoid',
        didDrawCell: (data) => {
          if (data.row.section === 'body' && data.column.index === 2) {
            let text = TablaDatos[i].estado
            i++
            if (text === 'alto') {
              this.doc.setFillColor(255, 0, 0)
              this.doc.circle(data.cell.x + 25, data.cell.y + 7, 5, 'F')
            } else if (text === 'medio') {
              this.doc.setFillColor(255, 255, 0)
              this.doc.circle(data.cell.x + 25, data.cell.y + 7, 5, 'F')
            } else if (text === 'bajo') {
              this.doc.setFillColor(0, 255, 0)
              this.doc.circle(data.cell.x + 25, data.cell.y + 7, 5, 'F')
            }
          }


        },
        didDrawPage: (data) => {
          let pageActual = this.doc.getCurrentPageInfo().pageNumber
          console.log(pageActual, page);

          if (pageActual > page) {
            this.implementarHeader()
            this.implementarFooter()
            console.log(this.usoPagina);
            this.usoPagina = this.margenContenido
            console.log(this.usoPagina);

            page = pageActual
          }
        }

      })
    }
  }

  private implementarNuevaPagina(numero: number,) {
    if (this.usoPagina + numero > 700) {
      this.doc.addPage()
      this.implementarHeader()
      this.implementarFooter()
      this.usoPagina = this.margenContenido
    }
  }

  private implementarFooter() {
    this.doc.setFontSize(12)
    this.doc.setFont("Lato", "normal");
    let numPag = this.doc.getNumberOfPages()
    this.doc.text(this.codigo, this.margenIzq, 772, { align: 'left' })
    // this.doc.text('CMDIC-001', this.margenDer, 772, { align: 'right' })
    this.doc.text(numPag.toString(), this.puntoMedio, 772, { align: 'center' })

  }

  private implementarHeader() {

    this.doc.setFontSize(16)
    this.doc.setFont("Lato", "bold");
    this.doc.text('REPORTE DIARIO DESAGUADO MINA', this.puntoMedio, 50, { align: 'center' })
    this.doc.setFontSize(12)
    this.doc.setFont("Lato", "normal");
    this.doc.text(this.formatoFecha, this.puntoMedio, 65, { align: 'center' })
    // this.doc.text(this.identificador, this.margenIzq, 80, { align: 'left' })
    // this.doc.text(this.fecha, this.puntoMedio, 80, { align: 'center' })
    this.doc.text(this.codigo, this.margenDer, 80, { align: 'right' })
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

  private generarFormatos(inputs: FormGroup) {
    let fFecha = inputs.get('fecha')?.value
    let fHora = inputs.get('hora')?.value

    let fecha = new Date(fFecha + 'T' + fHora)
    let formatoFecha = fecha.toLocaleDateString('es-CL', { day: '2-digit', weekday: 'long', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    let codigo = 'RD-' + fecha.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: '2-digit' }).replaceAll('-', '')

    this.formatoFecha = formatoFecha
    this.codigo = codigo

  }

  private implementaSecciones(inputs: FormGroup, imagenMapa: HTMLImageElement, tablaDatos: TablaDato[]) {
    this.generarFormatos(inputs)
    this.implementarFuentes()
    this.implementarHeader()
    this.implementarFooter()
    this.implementarResumen(inputs)
    this.implmentarFocosPrincipales(inputs)
    this.implementarFocosSegundarios(inputs, imagenMapa, tablaDatos)

  }


  public descargarPDF(inputs: FormGroup, imagenMapa: HTMLImageElement, tablaDatos: TablaDato[]) {
    this.implementaSecciones(inputs, imagenMapa, tablaDatos)
    // this.doc.save('reporte.pdf')
    this.doc.output('dataurlnewwindow')
    this.reiniciarPDF()
  }

  public reiniciarPDF() {
    this.doc = new jsPDF('p', 'pt', 'letter')
    this.usoPagina = this.margenContenido
  }


}
