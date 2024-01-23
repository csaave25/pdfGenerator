import { ElementRef, Injectable, QueryList } from '@angular/core';
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { latoBold, latoRegular, montBold, montMedium, montSemi } from 'src/assets/fonts/fonts';
// import { colores, data, formateadoraDeTexto, justify, obtenerAncho } from './data';
import { AbstractControl, FormGroup } from '@angular/forms';
import { ApiService } from './api.service';
import { locale } from 'moment';
import { formateadoraDeTexto } from './data';

@Injectable({
  providedIn: 'root'
})
export class GeneradorService {

  constructor() { }

  private doc = new jsPDF('p', 'pt', 'letter', true)
  private margenIzq = 40
  private margenDer = 611 - this.margenIzq
  private puntoMedio = (this.doc.internal.pageSize.width || this.doc.internal.pageSize.getWidth()) / 2
  private margenTexto = this.margenDer - this.margenIzq
  private margenContenido = 115
  private usoPagina = this.margenContenido


  private generarObservaciones() {
    let estacion = 'Esta es una prueba de lo que se puede hacer. esta es una prueba de lo que se puede hacer. esta es una prueba de lo que se puede hacer. esta es una prueba de lo que se puede hacer. esta es una prueba de lo que se puede hacer.'
    // let estacion = ''
    let radar = ''


    this.doc.setFontSize(10)
    this.doc.setFont("Lato", "normal");
    this.usoPagina = formateadoraDeTexto(this.doc, estacion.length < 3 ? '-*Estación Total:* No se presentan activaciones post sismo.' : '-*Estación Total:*  ' + estacion, this.usoPagina, this.margenIzq + 20 , this.margenDer - 20 - this.margenIzq) + 10

    this.doc.setFontSize(10)
    this.doc.setFont("Lato", "normal");
    this.usoPagina = formateadoraDeTexto(this.doc, radar.length < 3 ? '-*Radar:* No se presentan activaciones post sismo.' : '-*Radar:*  ' + radar, this.usoPagina, this.margenIzq + 20 , this.margenDer - 20 - this.margenIzq) + 10

    this.doc.setFontSize(10)
    this.doc.setFont("Lato", "bold");
    this.doc.text('•  ', this.margenIzq + 20, this.usoPagina, { align: 'left' })
    this.doc.setFontSize(10)
    this.doc.setFont("Lato", "normal");
    let frase = "Profundidad del sismo a 128 km, ubicado a a 64 KM al SE de Mina Los Pelambres (Observado en la Figura 1) y con intensidad de 5,1 MW GUC 1"
    this.usoPagina = formateadoraDeTexto(this.doc, frase, this.usoPagina, this.margenIzq + 20 + this.doc.getTextWidth('•  '), this.margenDer - (this.margenIzq + 20 + this.doc.getTextWidth('•  '))) +  10

    this.doc.setFontSize(10)
    this.doc.setFont("Lato", "normal");
    frase = '-Se observó polución en zonas colmatadas, rampa 3500W, rampa Este y 3080, Sin mayores novedades. Se observó polución en zonas colmatadas, rampa 3500W, rampa Este y 3080, Sin mayores novedades.'
    this.usoPagina = formateadoraDeTexto(this.doc, frase, this.usoPagina, this.margenIzq + 20, this.margenDer - this.margenIzq -20) + 10


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

  private generarHeader(fecha: Date, id: number) {
    let ano = fecha.getFullYear().toString()
    let diaNombre = fecha.toLocaleDateString('es-ES', { weekday: 'long' });
    diaNombre = diaNombre[0].toUpperCase() + diaNombre.slice(1)
    let diaNumero = fecha.toLocaleDateString().slice(0, 2)
    let mesNombre = fecha.toLocaleDateString('es-ES', { month: 'long' })
    mesNombre = mesNombre[0].toUpperCase() + mesNombre.slice(1)
    let hora = ('0' + fecha.toLocaleTimeString('es-ES')).slice(-8).slice(0, 5)
    let fechaSubTitulo = diaNombre + ' ' + diaNumero + ' de ' + mesNombre + ' de ' + ano + ', ' + hora + ' hrs.'


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
    this.doc.setFontSize(12)
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

  private implementarContenido() {

    let fecha = new Date()
    this.implementarFuentes()
    this.generarHeader(fecha, 2)
    this.generarFooter(fecha, 'josé vergara Fernández', 2)
    this.generarTitulosObservaciones(fecha)
    this.generarObservaciones()
  }

  public descargarInforme() {
    this.implementarContenido()
    this.doc.output('dataurlnewwindow')
    this.doc = new jsPDF('p', 'pt', 'letter', true)
    this.usoPagina = this.margenContenido
  }

}
