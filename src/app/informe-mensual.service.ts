import { Injectable, ViewChild } from '@angular/core';
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { font, latoRegular, montBold, montMedium, montSemi } from 'src/assets/fonts/fonts';
import { dataInforme } from './informe-mensual/informeData';


@Injectable({
  providedIn: 'root'
})
export class InformeMensualService {


  constructor() { }


  marginLeft = 20
  marginRight = 485
  endPage = 700
  startPage = 20
  doc = new jsPDF('p', 'pt', 'letter')

  implementarPortada() {
    let altura = 246
    let margenIzq = this.marginLeft + 72
    this.doc.addImage("assets/images/image2.jpg", 'JPG', 0, 0, 612, 792, 'marca', 'SLOW');
    this.doc.setTextColor('#D5E1E2')
    this.doc.setFont("Montserrat", "bold");
    this.doc.setFontSize(25)
    this.doc.text("INFORME MENSUAL", margenIzq, altura, { align: 'left' });
    this.doc.setTextColor('#DE6719')
    this.doc.setFontSize(18)
    this.doc.setFont("Lato", "normal");
    this.doc.text(dataInforme.subTitulo, margenIzq, altura + 30, { align: 'left' });
    this.doc.setFontSize(14)
    this.doc.text(dataInforme.subTitulo2, margenIzq, altura + 50, { align: 'left' });
    this.doc.text(dataInforme.faena, margenIzq, altura + 70, { align: 'left' });
    this.doc.setTextColor('#D5E1E2')
    this.doc.setFontSize(12)
    this.doc.text(dataInforme.fecha, margenIzq + 244, altura + 174, { align: 'left' });
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
    this.doc.addFont("Montserrat-SemiBold.ttf", "Montserrat", "semibold");
  }

  implementarFooter() {
    this.doc.setFontSize(8)
    this.doc.setTextColor("#013033")
    let calc = (this.marginRight + this.marginLeft) / 6
    this.doc.setFont("Montserrat", 'bold')
    this.doc.text('E-Mining Technology S.A.', this.marginLeft, this.endPage, { align: 'left' });
    this.doc.text('•', this.marginLeft + 314, this.endPage, { align: 'left' });
    this.doc.text('•', this.marginLeft + 115, this.endPage, { align: 'left' });
    this.doc.text('•', this.marginLeft + 455, this.endPage, { align: 'right' });
    this.doc.text('eminingtech.com', this.marginRight, this.endPage, { align: 'right' });
    this.doc.setFont("Lato", 'normal')
    this.doc.text('Calle Limache 3405, Oficina 21, Viña del Mar', this.marginLeft + 135, this.endPage, { align: 'left' });
    this.doc.text('Teléfono: +56 32 2187440', this.marginLeft + 336, this.endPage, { align: 'left' });
    // this.contadorPagina++
  }

  generarTablaResumen() {
    autoTable(this.doc, {
      styles: { halign: 'center', fontSize: 10, cellWidth: 150, fillColor: [222, 103, 25], },
      headStyles: { font: 'Lato', fontStyle: 'bold' },
      head: [['ELABORADO', 'REVISADO', 'APROVADO']],
      bodyStyles: { cellPadding: 20, font: 'Lato', fontStyle: 'normal', fontSize: 9},
      body: [
        ['CONSTANZA SARRÍA \n\n INGENIERO GEOTÉCNICO MCM', 'VALERIA MIRANDA \n\n LÍDER MCM-AMSA', 'LEONARDO ZAHR \n\n JEFE MCM'],

      ],
      margin: { top: 100, left : 85},

    })
  }





  nuevaPagina() {
    this.doc.addPage()
    this.implementarFooter()
    this.doc.addImage("assets/images/marca.jpg", 'JPG', 0, 0, 612, 792, 'marca2', 'SLOW');
    // this.doc.addImage("assets/images/logo.png", 'PNG', this.marginLeft , 20, 222, 69, 'logo', 'SLOW'); LOGO CON PORTE IGUAL AL DE PORTADA
    this.doc.addImage("assets/images/logo.png", 'PNG', this.marginLeft, this.startPage, 142, 50, 'logo', 'SLOW');
  }

  onPrevizualizar() {
    this.implementarFuentes()
    this.implementarPortada()
    this.nuevaPagina()
    this.generarTablaResumen()

  }


}
