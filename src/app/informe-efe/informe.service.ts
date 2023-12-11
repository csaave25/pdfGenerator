import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { font, latoRegular, montBold, montMedium, montSemi } from 'src/assets/fonts/fonts';
import { colores, data } from './data';

@Injectable({
  providedIn: 'root'
})
export class InformeService {

  constructor() { }


  doc = new jsPDF('p', 'pt', 'letter')
  margenIzq = 20
  margenDer = 562
  finalPagina = 760
  comienzoPagina = 20
  cominezoContenidoY = this.comienzoPagina + 90
  margenContenidoIzq = this.margenIzq + 50
  contadorPagina = 1
  usoPagina = this.cominezoContenidoY
  totalUso = this.finalPagina - this.cominezoContenidoY
  contadorItem = 1
  maxMargen = this.margenDer - this.comienzoPagina

  implementarPortada() {
    let mes = new Date(data.ano, data.mes, 1).toLocaleString('default', { month: 'long' });
    mes = mes.charAt(0).toUpperCase() + mes.slice(1);
    let altura = 246
    let margenIzq = this.margenIzq + 72
    this.doc.addImage("assets/images/image2.jpg", 'JPG', 0, 0, 612, 792, 'marca-1', 'SLOW');
    this.doc.setTextColor(colores.blanco)
    this.doc.setFont("Montserrat", "bold");
    this.doc.setFontSize(25)
    this.doc.text(data.titulo, margenIzq, altura, { align: 'left' });

    this.doc.setTextColor(colores.naranjo)
    this.doc.setFontSize(18)
    this.doc.setFont("Lato", "normal");
    this.doc.text(data.subTiutlo, margenIzq, altura + 30, { align: 'left', maxWidth: this.maxMargen });
    let dimensiones = this.doc.getTextDimensions(data.subTiutlo)

    const obtenerAncho = (largo: number, tamanoFuente: number, margen: number) => {
      let lines = dimensiones.w / this.maxMargen
      let valor = Math.trunc(lines) + 1
      return tamanoFuente * valor + 5
    }
    altura += obtenerAncho(dimensiones.w, dimensiones.h, this.maxMargen);
    this.doc.setFontSize(14)
    this.doc.text(data.subTitulo2, margenIzq, altura + 10, { align: 'left' });
    this.doc.setTextColor(colores.blanco)
    this.doc.setFontSize(12)
    this.doc.text(mes + ' ' + data.ano, margenIzq + 320, altura + 174, { align: 'left' });
  }



  implementarFuentes() {
    this.doc.addFileToVFS("Lato-Font-bold.ttf", font);
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


  crearInforme() {
    this.implementarFuentes()
    this.implementarPortada()
  }

  generarInforme() {
    this.crearInforme()
    this.doc.setProperties({ title: 'Informe Mensual EFE' })
    this.doc.output('pdfobjectnewwindow')
  }

}
