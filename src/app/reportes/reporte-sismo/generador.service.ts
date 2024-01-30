import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf'
import { latoBold, latoRegular, montBold, montMedium, montSemi } from 'src/assets/fonts/fonts';
import { formateadoraDeTexto, obtenerFechaEnPredefinido } from './data';
import { FormGroup } from '@angular/forms';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class GeneradorService {

  constructor() { }

  private doc = new jsPDF('p', 'pt', 'letter')
  private margenIzq = 40
  private margenDer = 611 - this.margenIzq
  private puntoMedio = (this.doc.internal.pageSize.width || this.doc.internal.pageSize.getWidth()) / 2
  private margenContenido = 115
  private usoPagina = this.margenContenido


  private generarObservaciones(inputs: FormGroup, dataSismo: any) {
    let estacion = inputs.get('estacion')?.value
    let radar = inputs.get('radar')?.value
    let otrasObs = inputs.get('otrasObs')?.value



    this.doc.setFontSize(10)
    this.doc.setFont("Lato", "normal");
    this.usoPagina = formateadoraDeTexto(this.doc, estacion.length < 3 ? '-*Estación Total:* No se presentan activaciones post sismo.' : '-*Estación Total:*  ' + estacion, this.usoPagina, this.margenIzq + 20, this.margenDer- 10.5 - (this.margenIzq  + this.doc.getTextWidth('•  ')))

    this.doc.setFontSize(10)
    this.doc.setFont("Lato", "normal");
    this.usoPagina = formateadoraDeTexto(this.doc, radar.length < 3 ? '-*Radar:* No se presentan activaciones post sismo.' : '-*Radar:*  ' + radar, this.usoPagina, this.margenIzq + 20, this.margenDer- 10.5 - (this.margenIzq  + this.doc.getTextWidth('•  ')))

    this.doc.setFontSize(10)
    this.doc.setFont("Lato", "normal");
    let frase = "-Profundidad del sismo a " + dataSismo.profundidad + " km, ubicado a " + dataSismo.lugar + " (Observado en la Figura 1) y con intensidad de " + dataSismo.magnitud + " MW"
    this.usoPagina = formateadoraDeTexto(this.doc, frase, this.usoPagina, this.margenIzq + 20, this.margenDer- 10.5 - (this.margenIzq  + this.doc.getTextWidth('•  ')))

    this.doc.setFontSize(10)
    this.doc.setFont("Lato", "normal");
    this.usoPagina = formateadoraDeTexto(this.doc, otrasObs, this.usoPagina, this.margenIzq + 20, this.margenDer - this.margenIzq - 20)


  }

  private generarTitulosObservaciones(fecha: Date) {
    let ano = fecha.getFullYear().toString()
    let diaNombre = fecha.toLocaleDateString('es-ES', { weekday: 'long' });
    diaNombre = diaNombre[0].toUpperCase() + diaNombre.slice(1)
    let diaNumero = fecha.toLocaleDateString().slice(0, 2)
    let mesNombre = fecha.toLocaleDateString('es-ES', { month: 'long' })
    mesNombre = mesNombre[0].toUpperCase() + mesNombre.slice(1)
    let hora = ('0' + fecha.toLocaleTimeString('es-ES')).slice(-8).slice(0, 5)

    this.doc.setFontSize(14)
    this.doc.setFont("Lato", "bold");
    this.doc.text('OBSERVACIONES MONITOREO POST-EVENTO SÍSMICO', this.margenIzq, this.usoPagina, { align: 'left' })
    this.usoPagina += 30


    this.doc.setFontSize(10)
    this.doc.setFont("Lato", "normal");
    let frase = "Informo que a las " + hora + " hrs. del " + diaNombre + " " + diaNumero + " de " + mesNombre + " de " + ano + ", se registra sismo en rajo mina:"
    this.doc.text(frase, this.margenIzq, this.usoPagina, { align: 'left' })
    this.usoPagina += 30
  }

  generarInfoSismo(dataSismo: any, imagenMapa: HTMLImageElement) {


    this.doc.addImage('./assets/Sismos/minaMarker.png', 'PNG', this.puntoMedio - 100, this.usoPagina + 4, 12, 12, 'minaMarker', 'SLOW')
    this.doc.setFontSize(8)
    this.doc.setFont("Lato", "normal");
    let text = 'Minera ' + 'Los Pelambres'
    this.doc.text(text, this.puntoMedio - 84, this.usoPagina + 14, { align: 'left' })

    this.doc.addImage('./assets/Sismos/sismoMarker.png', 'PNG', this.puntoMedio - 75 + this.doc.getTextWidth(text), this.usoPagina + 4, 12, 12, 'sismoMarker', 'SLOW')
    this.doc.setFontSize(8)
    this.doc.setFont("Lato", "normal");
    this.doc.text('Sismo', this.puntoMedio - 60 + this.doc.getTextWidth(text), this.usoPagina + 14, { align: 'left' })


    this.doc.addImage(imagenMapa, 'PNG', this.puntoMedio - 100, this.usoPagina + 18, 200, 282, 'imagenMapa', 'SLOW')
    this.usoPagina += 308


    this.doc.setFontSize(7.5)
    this.doc.setFont("Lato", "normal");
    this.doc.text('Figura 1: Mapa Referencia del Evento Sísmico', this.puntoMedio, this.usoPagina, { align: 'center' })
    this.usoPagina += 25

    let fechaLocal = obtenerFechaEnPredefinido(new Date(dataSismo.tiempo), true)
    let fechaUTC = obtenerFechaEnPredefinido(new Date(dataSismo.tiempo), false)


    this.doc.setFontSize(7.5)
    this.doc.setFont("Lato", "normal");
    this.doc.text('Tabla 1: Resumen de Información Evento Sísmico', this.puntoMedio, this.usoPagina, { align: 'center' })
    this.usoPagina += 5

    autoTable(this.doc, {
      theme: 'striped',
      styles: { halign: 'left', font: 'Lato', fontStyle: 'normal', fontSize: 8, fillColor: undefined, lineColor: [1, 48, 51], textColor: [1, 48, 51], cellPadding: 2, lineWidth: 0 },
      headStyles: { font: 'Lato', fontStyle: 'bold', fillColor: undefined, lineWidth: .1 },
      body: [['Hora Local', fechaLocal], ['Hora UTC', fechaUTC], ['Latitud', dataSismo.latitud], ['Longitud', dataSismo.longitud], ['Profundidad', dataSismo.profundidad + ' Km'], ['Magnitud', dataSismo.magnitud + ' ' + dataSismo.magTipo.toUpperCase()], ['Referencia', dataSismo.lugar]],
      margin: { left: this.puntoMedio - (380) / 2 },
      startY: this.usoPagina,
      columnStyles: { 0: { halign: 'left', cellWidth: 120, fontStyle: 'bold' }, 1: { halign: 'left', cellWidth: 260, } },
      alternateRowStyles: { fillColor: undefined },
      rowPageBreak: 'avoid',

      willDrawCell: (data) => {
        if (data.row.index == 0 && data.column.index == 0) {
          this.doc.line(data.row.cells[0].x, data.row.cells[0].y, 496, data.row.cells[0].y)
        }

        if (data.row.index == 6 && data.column.index == 0) {
          this.doc.line(data.row.cells[0].x, data.row.cells[0].y + data.row.cells[0].height, 496, data.row.cells[0].y + data.row.cells[0].height)
        }
      }
    })

  }

  private generarHeader(fecha: Date, id: number) {
    let ano = fecha.getFullYear().toString()
    let fechaSubTitulo = obtenerFechaEnPredefinido(fecha, true)


    this.doc.setFontSize(16)
    this.doc.setFont("Lato", "normal");
    this.doc.text('REPORTE FLASH POST-EVENTO SÍSMICO', this.puntoMedio, 50, { align: 'center' })
    this.doc.setFontSize(12)
    this.doc.setFont("Lato", "normal");
    this.doc.text(fechaSubTitulo, this.puntoMedio, 65, { align: 'center' })
    this.doc.text(ano + '.' + id, this.margenIzq, 80, { align: 'left' })
    this.doc.text('IYV-RP-VIG-MLP-02', this.margenDer, 80, { align: 'right' })
    this.doc.line(this.margenIzq, 82, this.margenDer, 82)

    this.doc.addImage('assets/EMT/logo.png', 'PNG', 486, 20, 90, 40, 'LOGO_EMT', 'FAST')

  }

  private generarFooter(fecha: Date, nombre: string, id: number) {
    this.doc.setFontSize(10)
    this.doc.setFont("Lato", "normal");
    let ano = fecha.getFullYear()
    let numPag = this.doc.getNumberOfPages()
    this.doc.text(nombre, this.margenIzq, 772, { align: 'left' })
    this.doc.text(ano + '.' + id, this.margenDer, 772, { align: 'right' })
    this.doc.text(numPag.toString(), this.puntoMedio, 772, { align: 'center' })

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

  private implementarContenido(inputs: FormGroup, dataSismo: any, imagenMapa: HTMLImageElement) {
    // this.doc.addImage("assets/EMT/marcaAgua.jpg", 'JPG', 0, 0, 612, 792, 'marca-x', 'SLOW');
    let fecha = new Date()
    this.implementarFuentes()
    this.generarHeader(fecha, 2)
    this.generarFooter(fecha, 'josé vergara Fernández', 2)
    this.generarTitulosObservaciones(fecha)
    this.generarObservaciones(inputs, dataSismo)
    this.generarInfoSismo(dataSismo, imagenMapa)

  }

  public descargarInforme(inputs: FormGroup, dataSismo: any, imagenMapa: HTMLImageElement) {
    this.implementarContenido(inputs, dataSismo, imagenMapa)
    this.doc.output('dataurlnewwindow')
    this.doc = new jsPDF('p', 'pt', 'letter', true)
    this.usoPagina = this.margenContenido
  }

}
