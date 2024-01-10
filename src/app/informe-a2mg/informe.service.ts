import { Injectable, Input } from '@angular/core';
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { font, latoRegular, montBold, montMedium, montSemi } from 'src/assets/fonts/fonts';
import { AbstractControl, FormGroup } from '@angular/forms';
import { dataInforme } from './data';
import { espaciarTextosLargos } from '../helpers/helpers';


interface Data {
  titulo: string,
  pagina: number,
  sub: Data[] | null
}

@Injectable({
  providedIn: 'root'
})
export class InformeService {


  constructor() { }


  colores = {
    negro: '#013033',
    blanco: '#D5E1E2',
    naranjo: '#DE6719',
    azul: '#038080',
    gris: '#7A7A7A',
    gris_claro: '#CCCCCC'
  }

  marginLeft = 20
  marginRight = 562
  endPage = 760
  startPage = 20
  startcContent = this.startPage + 90
  marginContent = this.marginLeft + 50
  contadorPagina = 2
  usoPagina = this.startcContent
  totalUso = this.endPage - this.startcContent
  contadorItem = 1
  listaContenido: Data[] = []
  tablaCriticidades = []
  mesNum = 10
  anoNum = 2023
  contadorTabla = 1
  contadorFigura = 1
  fecha: string = ''


  doc = new jsPDF('p', 'pt', 'letter')


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

  implementarPortada() {


    let altura = 246
    let margenIzq = this.marginLeft + 72
    this.doc.addImage("assets/images/image2.jpg", 'JPG', 0, 0, 612, 792, 'marca-1', 'SLOW');
    this.doc.setTextColor(this.colores.blanco)
    this.doc.setFont("Montserrat", "bold");
    this.doc.setFontSize(25)
    this.doc.text("INFORME MENSUAL", margenIzq, altura, { align: 'left' });
    this.doc.setTextColor(this.colores.naranjo)
    this.doc.setFontSize(18)
    this.doc.setFont("Lato", "normal");
    this.doc.text(dataInforme.subTitulo, margenIzq, altura + 30, { align: 'left' });
    this.doc.setFontSize(14)
    this.doc.text(dataInforme.subTitulo2, margenIzq, altura + 50, { align: 'left' });
    this.doc.text(dataInforme.faena, margenIzq, altura + 70, { align: 'left' });
    this.doc.setTextColor(this.colores.blanco)
    this.doc.setFontSize(12)
    this.doc.text(this.fecha, margenIzq + 320, altura + 174, { align: 'left' });
  }

  implementarFooter() {
    this.doc.setFontSize(8.5)
    this.doc.setTextColor(this.colores.negro)
    let calc = (this.marginRight + this.marginContent) / 2 - 14
    this.doc.setFont("Lato", 'normal')
    this.doc.text('E-Mining Technology S.A. • Calle Limache 3405, Oficina 21, Viña del Mar • Teléfono: +56 32 2187440 • eminingtech.com', calc, this.endPage, { align: 'center' });

    this.doc.setFont("Lato", 'bold')
    this.doc.setFontSize(10)
    this.doc.text(this.contadorPagina.toString(), this.marginRight - 20, this.endPage - 20, { align: 'right' });
    this.contadorPagina++
  }

  implementarHeader() {

    // this.doc.addImage("assets/images/logo.png", 'PNG', this.marginLeft , 20, 222, 69, 'logo', 'SLOW'); LOGO CON PORTE IGUAL AL DE PORTADA
    this.doc.addImage("assets/images/logo.png", 'PNG', this.marginLeft, this.startPage, 160, 50, 'logo' + this.contadorPagina, 'SLOW');
    this.doc.setFontSize(8)
    this.doc.setTextColor(this.colores.negro)
    this.doc.setFont('Lato', 'normal')
    this.doc.text('Informe Mensual', this.marginRight, this.startPage + 12, { align: 'right' })
    this.doc.setTextColor(this.colores.negro)
    this.doc.text('Monitoreo de Ripios Aplicación A2MG', this.marginRight, this.startPage + 24, { align: 'right' })
    this.doc.text(this.fecha, this.marginRight, this.startPage + 36, { align: 'right' })
  }



  generarTablaResumen(inputs: FormGroup) {

    this.doc.addPage()
    this.doc.addImage("assets/images/marca.jpg", 'JPG', 0, 0, 612, 792, 'marca-x', 'SLOW');

    this.doc.addImage("assets/images/logo.png", 'PNG', this.marginLeft, this.startPage, 160, 50, 'logo-x', 'SLOW');
    let altura = 246
    let margenIzq = this.marginLeft + 72
    this.doc.setFont("Montserrat", "bold");
    this.doc.setFontSize(25)
    this.doc.setTextColor(this.colores.azul)
    this.doc.text("INFORME MENSUAL", margenIzq, altura, { align: 'left' });
    this.doc.setTextColor(this.colores.negro)
    this.doc.setFontSize(18)
    this.doc.setFont("Lato", "normal");
    this.doc.text(dataInforme.subTitulo, margenIzq, altura + 30, { align: 'left' });
    this.doc.setFontSize(14)
    this.doc.text(dataInforme.subTitulo2, margenIzq, altura + 50, { align: 'left' });
    this.doc.text(dataInforme.faena, margenIzq, altura + 70, { align: 'left' });
    this.doc.setTextColor(this.colores.azul)
    this.doc.setFontSize(12)
    this.doc.text(this.fecha, margenIzq + 300, altura + 174, { align: 'left' });



    let nombre1 = inputs.controls['usrs'].value.elavorado
    let cargo1 = inputs.controls['usrs'].value.cargo1
    let nombre2 = inputs.controls['usrs'].value.revisado
    let cargo2 = inputs.controls['usrs'].value.cargo2
    let nombre3 = inputs.controls['usrs'].value.aprobado
    let cargo3 = inputs.controls['usrs'].value.cargo3



    autoTable(this.doc, {
      theme: 'grid',
      styles: { halign: 'center', fontSize: 10, cellWidth: 150, fillColor: undefined, lineColor: [1, 48, 51] },
      headStyles: { font: 'Lato', fontStyle: 'bold', textColor: [1, 48, 51], fillColor: [217, 217, 217], lineWidth: .1 },
      head: [['ELABORADO', 'REVISADO', 'APROBADO']],
      bodyStyles: { cellPadding: [10, 0, 10, 0], font: 'Lato', textColor: [1, 48, 51], fontStyle: 'normal', fontSize: 9, fillColor: undefined },
      body: [
        [nombre1?.toUpperCase() + '\n\n' + cargo1?.toUpperCase(), nombre2?.toUpperCase() + '\n\n' + cargo2?.toUpperCase(), nombre3?.toUpperCase() + '\n\n' + cargo3?.toUpperCase()],

      ],
      margin: { left: (((this.marginRight - (150 * 3) + this.marginContent) / 2)) },
      startY: this.startcContent + 400
    })

    autoTable(this.doc, {
      theme: 'grid',
      styles: { halign: 'center', fontSize: 10, cellWidth: 120, fillColor: undefined, lineColor: [1, 48, 51], textColor: [1, 48, 51] },
      headStyles: { font: 'Lato', fontStyle: 'bold', fillColor: [217, 217, 217], lineWidth: .1 },
      head: [['FAENA', 'TIPO DE DOCUMENTO', 'ESTADO', 'CÓDIGO']],
      bodyStyles: { cellPadding: 15, font: 'Lato', fontStyle: 'normal', fontSize: 9 },
      body: [
        ['ANT', 'INFORME', 'VIGENTE', 'MCM-ANT-IF-01'],

      ],
      margin: { left: (((this.marginRight - (120 * 4) + this.marginContent) / 2)) },

    })

    this.doc.setFontSize(8.5)
    this.doc.setTextColor(this.colores.negro)
    let calc = (this.marginRight + this.marginContent) / 2 - 14
    this.doc.setFont("Lato", 'normal')
    this.doc.text('E-Mining Technology S.A. • Calle Limache 3405, Oficina 21, Viña del Mar • Teléfono: +56 32 2187440 • eminingtech.com', calc, this.endPage, { align: 'center' });

    this.nuevaPagina()

  }

  implementarTablaContenido() {

    this.doc.insertPage(3)
    this.doc.addImage("assets/images/marca.jpg", 'JPG', 0, 0, 612, 792, 'marca-x', 'SLOW');

    this.contadorPagina = 1
    this.implementarFooter()
    this.implementarHeader()

    this.doc.setFontSize(16)
    this.doc.setTextColor(this.colores.naranjo)
    this.doc.setFont('Lato', 'normal')
    this.doc.text('Tabla de contenido', this.marginContent, this.startcContent, { align: 'left' })

    this.doc.setFontSize(11)
    this.doc.setTextColor(this.colores.negro)

    let espacios = this.startcContent
    this.listaContenido.forEach(data => {
      this.doc.text(data.titulo, this.marginContent, espacios + 30, { align: 'left' })
      this.doc.text((data.pagina - 1).toString(), this.marginRight, espacios + 30, { align: 'right' })
      this.doc.setLineDashPattern([4], 1000);
      this.doc.line(this.marginContent + this.doc.getTextWidth(data.titulo) + 10, espacios + 30, this.marginRight - 15, espacios + 30, 'FD')
      data.sub?.forEach(sub => {
        this.doc.text(sub.titulo, this.marginContent + 30, espacios + 60, { align: 'left' })
        this.doc.text((sub.pagina - 1).toString(), this.marginRight, espacios + 60, { align: 'right' })
        this.doc.line(this.marginContent + this.doc.getTextWidth(sub.titulo) + 40, espacios + 60, this.marginRight - 15, espacios + 60, 'FD')
        espacios += 30
      })
      espacios += 30
    })
  }

  implementarIndicadoresDeServicio(tablaDispo: any, inputs: FormGroup) {
    let contenido: Data = {
      titulo: this.contadorItem + '. Indicadores de Servicio',
      pagina: this.contadorPagina,
      sub: [{
        titulo: this.contadorItem + '.1 Disponibilidad del Sistema',
        pagina: this.contadorPagina,
        sub: null
      }]
    }

    let comnt1 = inputs.controls['disponibilidadComentario'].value.web
    let comnt2 = inputs.controls['disponibilidadComentario'].value.img
    let comnt3 = inputs.controls['disponibilidadComentario'].value.bd
    let comnt4 = inputs.controls['disponibilidadComentario'].value.api
    let comnt5 = inputs.controls['disponibilidadComentario'].value.computo
    let comnt6 = inputs.controls['disponibilidadComentario'].value.sistema
    let comnt7 = inputs.controls['disponibilidadComentario'].value.enlace

    this.listaContenido.push(contenido)


    this.doc.setFontSize(14)
    this.doc.setTextColor(this.colores.naranjo)
    this.doc.setFont('Lato', 'bold')
    this.doc.text(this.contadorItem + '. Indicadores de Servicio', this.marginContent, this.startcContent, { align: 'left' })

    this.doc.setTextColor(this.colores.negro)
    this.doc.setFontSize(12)
    this.doc.text(this.contadorItem + '.1 Disponibilidad del Sistema', this.marginContent, this.startcContent + 30, { align: 'left' })
    this.contadorItem++
    this.doc.setFont('Lato', 'normal')
    this.doc.setFontSize(11)

    espaciarTextosLargos(this.doc, dataInforme.disponibilidad.texto1, this.startcContent + 60, this.marginContent, this.marginRight - this.marginContent, this.fecha, '', this.endPage)

    this.doc.setFont('Time', 'italic')
    this.doc.setFontSize(12)
    this.doc.text('Disponibilidad del sistema [%] =', this.marginContent + 20, this.startcContent + 130, { align: 'left' })
    this.doc.text('Tiempo', this.marginContent + 190, this.startcContent + 120, { align: 'left' })
    this.doc.text('Tiempo', this.marginContent + 190, this.startcContent + 144, { align: 'left' })
    this.doc.setFontSize(9)
    this.doc.text('disponible', this.marginContent + 228, this.startcContent + 124, { align: 'left' })
    this.doc.text('nominal', this.marginContent + 228, this.startcContent + 148, { align: 'left' })
    this.doc.line(this.marginContent + 190, this.startcContent + 128, this.marginContent + 270, this.startcContent + 128)
    this.doc.setFontSize(12)
    this.doc.text('=', this.marginContent + 280, this.startcContent + 130, { align: 'left' })
    this.doc.text('Efectivo+Demoras+Reserva', this.marginContent + 306, this.startcContent + 120, { align: 'left', })
    this.doc.text('Tiempo', this.marginContent + 345, this.startcContent + 144, { align: 'left' })
    this.doc.setFontSize(9)
    this.doc.text('nominal', this.marginContent + 383, this.startcContent + 148, { align: 'left', maxWidth: this.marginRight - this.marginContent })
    this.doc.line(this.marginContent + 300, this.startcContent + 128, this.marginContent + 450, this.startcContent + 128)

    this.doc.setFont('Lato', 'normal')
    this.doc.setFontSize(11)
    espaciarTextosLargos(this.doc, dataInforme.disponibilidad.texto2, this.startcContent + 200, this.marginContent, this.marginRight - this.marginContent, this.fecha, '', this.endPage)


    this.doc.text('La disponibilidad comprometida corresponde al 95% para el caso de Infraestructura EMT.', this.marginContent, this.startcContent + 250, { align: 'left', maxWidth: this.marginRight - this.marginContent })


    this.doc.setFontSize(8)
    this.doc.setFont('Lato', 'normal')
    this.doc.text('TABLA ' + this.contadorTabla + ': DISPONIBILIDAD DEL SISTEMA', ((this.marginRight - this.marginContent) / 2 + this.marginContent), this.startcContent + 280, { align: 'center', maxWidth: this.marginRight - this.marginContent })
    this.contadorTabla++

    autoTable(this.doc, {
      tableWidth: this.marginRight - this.marginContent,
      styles: { fontSize: 10, lineWidth: .1, fillColor: undefined, lineColor: [1, 48, 51], textColor: [1, 48, 51] },
      headStyles: { font: 'Lato', fontStyle: 'bold', fillColor: [217, 217, 217], halign: 'center' },
      head: [[{ content: 'Indicador', styles: { minCellWidth: 250 } }, 'Disponibilidad [%]', 'Observaciones']],
      bodyStyles: { font: 'Lato', fontStyle: 'normal', fontSize: 9, fillColor: undefined, halign: 'left' },
      body: [
        [{ content: 'Infraestructura EMT', styles: { minCellWidth: 200, font: 'Lato', fontStyle: 'bold', fillColor: [218, 218, 217], cellPadding: { left: 50, top: 5 } } }, { content: tablaDispo.infraestructura, styles: { font: 'Lato', fontStyle: 'bold', fillColor: [218, 218, 217], halign: 'center' } }, { content: '', styles: { fillColor: [218, 218, 217] } }],
        [{ content: 'Servicio web', styles: { halign: 'left', cellPadding: { left: 75, top: 5 } } }, { content: tablaDispo.servicio_web, styles: { halign: 'center' } }, comnt1],
        [{ content: 'Servicio imágenes', styles: { halign: 'left', cellPadding: { left: 75, top: 5 } } }, { content: tablaDispo.servicio_imagenes, styles: { halign: 'center' } }, comnt2],
        [{ content: 'Servicio base de datos', styles: { halign: 'left', cellPadding: { left: 75, top: 5 } } }, { content: tablaDispo.servicio_db, styles: { halign: 'center' } }, comnt3],
        [{ content: 'Servicio API', styles: { halign: 'left', cellPadding: { left: 75, top: 5 } } }, { content: tablaDispo.servicio_api, styles: { halign: 'center' } }, comnt4],
        [{ content: 'Servicio de computo', styles: { halign: 'left', cellPadding: { left: 75, top: 5 } } }, { content: tablaDispo.servicio_computo, styles: { halign: 'center' } }, comnt5],
        [{ content: 'Infraestructura ANT', styles: { font: 'Lato', fontStyle: 'bold', fillColor: [218, 218, 217], cellPadding: { left: 50, top: 5 } } }, { content: tablaDispo.sistema_adquisicion_imagenes, styles: { font: 'Lato', fontStyle: 'bold', fillColor: [218, 218, 217], halign: 'center' } }, { content: '', styles: { fillColor: [218, 218, 217] } }],
        [{ content: 'Sistema de adquisición de imágenes', styles: { halign: 'left', cellPadding: { left: 75, top: 5 } } }, { content: tablaDispo.sistema_adquisicion_imagenes, styles: { halign: 'center' } }, comnt6],
        [{ content: ' Enlaces', styles: { font: 'Lato', fontStyle: 'bold', fillColor: [218, 218, 217], cellPadding: { left: 50, top: 5 } } }, { content: tablaDispo.enlace_dedicado, styles: { font: 'Lato', fontStyle: 'bold', fillColor: [218, 218, 217], halign: 'center' } }, { content: '', styles: { fillColor: [218, 218, 217] } }],
        [{ content: 'Enlace dedicado AMSA', styles: { halign: 'left', cellPadding: { left: 75, top: 5 } } }, { content: tablaDispo.enlace_dedicado, styles: { halign: 'center' } }, comnt7],

      ],
      margin: { top: this.startcContent + 285, left: this.marginContent,  bottom: 80 },
      alternateRowStyles: { fillColor: undefined },
      rowPageBreak: 'avoid',
      
      
    })
    // this.nuevaPagina()
    this.usoPagina = 1000
  }

  implmentarConfiabilidad(inputs: FormGroup, comentariosImagenes: any[]) {

    let valor1 = inputs.controls['confiabilidad'].value.identificacion
    let valor2 = inputs.controls['confiabilidad'].value.clasificacion
    let valor3 = inputs.controls['confiabilidad'].value.comunicacion
    let promedio = ((valor1 + valor2 + valor3) / 3)?.toFixed(2)

    if (this.usoPagina + 445 > this.totalUso)
      this.nuevaPagina()

    let contenido: Data = {
      titulo: this.contadorItem + '. Confiabilidad',
      pagina: this.contadorPagina,
      sub: null
    }

    this.listaContenido.push(contenido)

    this.doc.setFontSize(14)
    this.doc.setTextColor(this.colores.naranjo)
    this.doc.setFont('Lato', 'bold')
    this.doc.text(this.contadorItem + '. Confiabilidad', this.marginContent, this.usoPagina, { align: 'left', maxWidth: this.marginRight - this.marginContent })
    this.contadorItem++

    this.doc.setFontSize(11)
    this.doc.setTextColor(this.colores.negro)
    this.doc.setFont('Lato', 'normal')
    espaciarTextosLargos(this.doc, dataInforme.confiabilidad.texto1, this.usoPagina + 30, this.marginContent, this.marginRight - this.marginContent, this.fecha, '', this.endPage)
    this.doc.text('Dentro de los parámetros a considerar están:', this.marginContent, this.usoPagina + 90, { align: 'left', maxWidth: this.marginRight - this.marginContent })

    this.doc.setFont('Lato', 'bold')
    this.doc.text('• Identificación :', this.marginContent + 30, this.usoPagina + 120, { align: 'left', maxWidth: this.marginRight - this.marginContent })
    this.doc.setFont('Lato', 'normal')
    let text = 'mide el porcentaje de agrietamientos detectados (como conjunto, no individualmente).'
    // espaciarTextosLargos(this.doc, text, this.usoPagina + 30,  this.doc.getTextWidth('• Identificación :') + 40 + this.marginContent,this.marginRight - this.marginContent, this.fecha, '')

    this.doc.text(text, this.doc.getTextWidth('• Identificación :') + 40 + this.marginContent, this.usoPagina + 120, { align: 'left', maxWidth: this.marginRight - this.marginContent - 150 })

    this.doc.setFont('Lato', 'bold')
    this.doc.text('• Clasificación :', this.marginContent + 30, this.startcContent + 160, { align: 'left', maxWidth: this.marginRight - this.marginContent })
    this.doc.setFont('Lato', 'normal')
    text = 'se refiere a la capacidad de asignar correctamente la criticidad a las grietas.'
    this.doc.text(text, this.doc.getTextWidth('• Identificación :') + 40 + this.marginContent, this.usoPagina + 160, { align: 'left', maxWidth: this.marginRight - this.marginContent - 150 })
    // espaciarTextosLargos(this.doc, text, this.usoPagina + 30,  this.doc.getTextWidth('• Identificación :') + 40 + this.marginContent,this.marginRight - this.marginContent, this.fecha, '')


    this.doc.setFont('Lato', 'bold')
    this.doc.text('• Comunicación :', this.marginContent + 30, this.usoPagina + 200, { align: 'left', maxWidth: this.marginRight - this.marginContent })
    this.doc.setFont('Lato', 'normal')
    this.doc.text('correcto aviso de EMT a ANT ante una grieta de criticidad alta.', this.doc.getTextWidth('• Identificación :') + 40 + this.marginContent, this.usoPagina + 200, { align: 'left', maxWidth: this.marginRight - this.marginContent - 150 })


    text = 'La confiabilidad del servicio durante el periodo fue del ' + promedio + '%, el cual se desglosa en la TABLA ' + this.contadorTabla + ' a continuación.'
    this.doc.text(text, this.marginContent, this.usoPagina + 230, { align: 'left', maxWidth: this.marginRight - this.marginContent })

    this.doc.setFontSize(8)
    this.doc.setFont('Lato', 'normal')
    this.doc.text('TABLA ' + this.contadorTabla + ': CONFIABILIDAD', ((this.marginRight - this.marginContent) / 2 + this.marginContent), this.usoPagina + 275, { align: 'center', maxWidth: this.marginRight - this.marginContent })
    this.contadorTabla++

    autoTable(this.doc, {
      styles: { lineWidth: .1, halign: 'center', fontSize: 10, cellWidth: 100, fillColor: undefined, lineColor: [1, 48, 51], textColor: [1, 48, 51] },
      headStyles: { font: 'Lato', fontStyle: 'bold', fillColor: [217, 217, 217] },
      head: [['Parámetro', 'Valor [%]']],
      bodyStyles: { font: 'Lato', fontStyle: 'normal', fontSize: 9, fillColor: undefined },
      body: [
        ['Identificación', valor1?.toFixed(2)],
        ['Clasificación', valor2?.toFixed(2)],
        ['Comunicación', valor3?.toFixed(2)],
      ],
      margin: { top: this.usoPagina + 280, left: (((this.marginRight - (100 * 2) + this.marginContent) / 2)) },
      alternateRowStyles: { fillColor: undefined },
      footStyles: { fillColor: [217, 217, 217] },
      foot: [['Confiabilidad', promedio]]
    })

    this.usoPagina += 430


    this.doc.setFontSize(11)
    this.doc.setTextColor(this.colores.negro)
    this.doc.setFont('Lato', 'normal')

    if (comentariosImagenes.length > 0) {

      comentariosImagenes.forEach(datos => {

        this.usoPagina = espaciarTextosLargos(this.doc, datos.comentario, this.usoPagina, this.marginContent, this.marginRight - this.marginContent, this.fecha, '', this.endPage)

        if (datos.imagenes.length > 0) {
          datos.imagenes.forEach((elm: any, index: number) => {

            if (this.usoPagina + 230 > this.totalUso)
              this.nuevaPagina()

            this.doc.setFontSize(8)
            this.doc.setFont('Lato', 'normal')
            this.doc.addImage(elm.img, 'png', 70, this.usoPagina, this.marginRight - this.marginContent, 200, 'imgx-mm' + this.contadorFigura, 'FAST');
            this.doc.text('FIGURA ' + this.contadorFigura + ': ' + elm.nomFigura?.toUpperCase(), ((this.marginRight - this.marginContent) / 2 + this.marginContent), this.usoPagina + 210, { align: 'center', maxWidth: this.marginRight - this.marginContent })

            this.contadorFigura++;
            this.usoPagina += 230
          });

          this.doc.setFontSize(11)
          this.doc.setTextColor(this.colores.negro)

        }

        if (comentariosImagenes.length > 0 && datos.imagenes.length > 0) {
          this.usoPagina += 25
        } else {
          this.usoPagina += 45
        }

      })


    }

    if (comentariosImagenes.length > 0)
      this.usoPagina -= 10
  }

  implementarAnalisis(DataCriticidad: any, imgCriticidad: any, comentariosCriticidad: any, inputs: FormGroup) {


    function addZero(i: any) {
      if (i < 10) { i = "0" + i }
      return i;
    }

    const manejoData = () => {
      let tabla: any = []
      DataCriticidad.forEach((dato: any) => {

        let coment = comentariosCriticidad.filter((data: any) => data.id == dato.id)
        let d = new Date(dato.date)
        let date = d.toLocaleDateString()
        let h = addZero(d.getHours());
        let m = addZero(d.getMinutes());
        let s = addZero(d.getSeconds());
        let hora = h + ":" + m + ":" + s;
        tabla.push([
          'Fecha: ' + date + '\nHora: ' + hora + '\nCámara: ' + dato.camera + '\n' + dato.id,
          '',
          'Zona: ' + dato.zonas +
          '\nApertura [m]: ' + ((dato.openning * 0.83) / 100).toFixed(2) +
          '\nLongitud [m]: ' + ((dato.length * 0.83) / 100).toFixed(2),
          coment[0] ? coment[0].comentario : ''
          //IMPORTANTE CAMBIAR EL VALOR DE TRANSFORMACION DE PX A METRO SEGUN EL LA ZONA (AREA)
        ])

      })

      return tabla
    }

    this.tablaCriticidades = manejoData();

    if (this.usoPagina + 65 > this.totalUso)
      this.nuevaPagina()

    let contenido: Data = {
      titulo: this.contadorItem + '. Análisis de Criticidades',
      pagina: this.contadorPagina,
      sub: null
    }
    this.listaContenido.push(contenido)

    this.doc.setFontSize(14)
    this.doc.setTextColor(this.colores.naranjo)
    this.doc.setFont('Lato', 'bold')
    this.doc.text(this.contadorItem + '. Análisis de Criticidades', this.marginContent, this.usoPagina, { align: 'left', maxWidth: this.marginRight - this.marginContent })
    this.contadorItem++



    if (this.tablaCriticidades.length == 0) {
      this.doc.setFontSize(11)
      this.doc.setTextColor(this.colores.negro)
      this.doc.setFont('Lato', 'normal')
      this.doc.text('Durante el período no se registran grietas de criticidad alta asociadas a alguna condición de fallamiento.', this.marginContent, this.usoPagina + 30, { align: 'left', maxWidth: this.marginRight - this.marginContent })
      this.usoPagina += 65

    } else {
      //GENERA TABLA
      this.doc.setFontSize(11)
      this.doc.setTextColor(this.colores.negro)
      this.doc.setFont('Lato', 'normal')
      let text = 'Durante el periodo se registran grietas de criticidad alta, pero estas no están asociadas a alguna condición de fallamiento. '
      // justify(this.doc, text, this.marginContent, this.usoPagina + 30, this.marginRight - this.marginContent)
      espaciarTextosLargos(this.doc, text, this.usoPagina + 30, this.marginContent, this.marginRight - this.marginContent, this.fecha, '', this.endPage)

      this.usoPagina += 40
      let index = 0
      let lastTableHeight = 0
      let page = 1
      let imgContador = 0


      if (this.usoPagina + 65 > this.totalUso)
        this.nuevaPagina()

      this.doc.setTextColor(this.colores.negro)
      this.doc.setFontSize(8)
      this.doc.setFont('Lato', 'normal')
      this.doc.text('TABLA ' + this.contadorTabla + ': CRITICIDADES', ((this.marginRight - this.marginContent) / 2 + this.marginContent), this.usoPagina + 25, { align: 'center', maxWidth: this.marginRight - this.marginContent })
      this.doc.setFontSize(11)
      this.doc.setFont('Lato', 'normal')
      this.contadorTabla++



      let flag = false
      autoTable(this.doc, {
        styles: { lineWidth: .1, halign: 'center', fontSize: 10, fillColor: undefined, lineColor: [1, 48, 51], textColor: [1, 48, 51] },
        headStyles: { font: 'Lato', fontStyle: 'bold', fillColor: [217, 217, 217] },
        head: [['Identificador Grieta', 'Imagen Grieta', 'Métricas', 'Observación']],
        bodyStyles: { font: 'Lato', fontStyle: 'normal', fontSize: 9, fillColor: undefined, minCellHeight: 75 },
        body: this.tablaCriticidades.reverse(),
        margin: { top: this.startcContent, left: this.marginContent, bottom: 80 },
        alternateRowStyles: { fillColor: undefined },
        columnStyles: { 3: { halign: 'left' }, 2: { halign: 'left', minCellWidth: 90 }, 1: { cellWidth: 150 }, 0: { minCellWidth: 90 } },
        rowPageBreak: 'avoid',
        startY: this.usoPagina + 30,
        didDrawCell: (data) => {
          if (data.column.index == 1 && data.cell.section == 'body') {
            let width = data.cell.width - 20;
            let height = data.cell.height - 10
            let x = data.cell.x + 10
            let y = data.cell.y + 5

            if (imgCriticidad[imgContador]) {
              this.doc.addImage(imgCriticidad[imgContador], 'png', x, y, width, 65, 'imgx' + imgContador, 'SLOW');
            }
            imgContador++

          }


          if (page == data.pageCount) {
            if (data.row.index != index) {
              index = data.row.index
              this.usoPagina += data.row.height
            }
          }
        },
        willDrawPage: (data) => {
          if (!flag && data.pageNumber != 1) {
            this.doc.addImage("assets/images/marca.jpg", 'JPG', 0, 0, 612, 792, 'marca-x', 'SLOW');
            flag = true
          }
        },

        didDrawPage: (data) => {
          if (data.pageNumber != 1) {
            this.implementarFooter()
            this.implementarHeader()


          }
          page++

          lastTableHeight = this.usoPagina
          this.usoPagina = 0
        }
      })
      this.usoPagina += 40 + lastTableHeight + this.startcContent
    }

  }

  implementarParametroA2MG(dataMatrix: any) {

    let matrix: any = {
      matrixNombre: [],
      matrixLongitud: [],
      matrixApertura: [],
      matrixAreas: []
    }

    const colores = (nivel: string): [number, number, number] => {
      if (nivel.includes('BAJA'))
        return [146, 208, 80]

      if (nivel.includes('MEDIA'))
        return [255, 255, 0]

      if (nivel.includes('ALTA'))
        return [255, 0, 0]

      return [146, 208, 80]
    }
    let ab = 'aa'


    // dataMatrix.objects.forEach((data: any) => {
    //   matrix.matrixNombre.push([{ content: data.name.toUpperCase(), styles: {} }]);
    //   matrix.matrixLongitud.push([data.length_min, data.length_max])
    //   matrix.matrixApertura.push([data.openning_min, data.openning_max])
    //   matrix.matrixAreas.push([
    //     { content: data.m1, styles: { fillColor: colores(data.m1) } },
    //     { content: data.m2, styles: { fillColor: colores(data.m2) } },
    //     { content: data.m3, styles: { fillColor: colores(data.m3) } },
    //     { content: data.m4, styles: { fillColor: colores(data.m4) } }
    //   ])

    // })

    // let ultimosCambios: any = []
    // dataUltimosCambiosMatrix.logs.forEach((data: any) => {

    //   let fecha = new Date(data.date).getMonth()

    //   if (fecha == this.mesNum) {
    //     let fecha = new Date(data.date).toLocaleString()
    //     ultimosCambios.push([fecha, data.user, data.before, data.current, data.column])
    //   }
    // });

    if (this.usoPagina + 170 > this.totalUso)
      this.nuevaPagina()

    let contenido: Data = {
      titulo: this.contadorItem + '. Registro de Cambios de Parámetros del A2MG',
      pagina: this.contadorPagina,
      sub: null
    }
    this.listaContenido.push(contenido)

    this.doc.setFontSize(14)
    this.doc.setTextColor(this.colores.naranjo)
    this.doc.setFont('Lato', 'bold')
    this.doc.text(this.contadorItem + '. Registro de Cambios de Parámetros del A2MG', this.marginContent, this.usoPagina, { align: 'left', maxWidth: this.marginRight - this.marginContent })
    this.contadorItem++

    let ultimoDiaMes = new Date(this.anoNum, this.mesNum + 1, 0);
    this.doc.setFontSize(11)
    this.doc.setTextColor(this.colores.negro)
    this.doc.setFont('Lato', 'normal')


    let index = 0
    let lastTableHeight = 0
    let page = 1
    function addZero(i: any) {
      if (i < 10) { i = "0" + i }
      return i;
    }

    this.doc.text('Registro de matrices utilizadas en el periodo: ', this.marginContent, this.usoPagina + 30, { align: 'left', maxWidth: this.marginRight - this.marginContent })

    // if (ultimosCambios.length < 1) {
    //   this.doc.text('Matriz utilizada entre 01-' + addZero(this.mesNum + 1) + '-' + this.anoNum + ' 00:00 y ' + ultimoDiaMes + '-' + this.mesNum + '-' + this.anoNum + ' 23:59, no se registraron cambios.', this.marginContent, this.usoPagina + 30, { align: 'left', maxWidth: this.marginRight - this.marginContent })

    // } else {
    //   this.doc.text('Matriz utilizada entre 01-' + (this.mesNum + 1) + '-' + this.anoNum + ' 00:00 y ' + ultimoDiaMes + '-' + this.mesNum + '-' + this.anoNum + ' 23:59.', this.marginContent, this.usoPagina + 30, { align: 'left', maxWidth: this.marginRight - this.marginContent })

    //   autoTable(this.doc, {
    //     styles: { lineWidth: .1, halign: 'center', fontSize: 10, fillColor: undefined, lineColor: [1, 48, 51], textColor: [1, 48, 51] },
    //     headStyles: { font: 'Lato', fontStyle: 'bold', fillColor: [217, 217, 217] },
    //     head: [['Fecha', 'Usuario', 'Anterior', 'Actual', 'Columna']],
    //     bodyStyles: { font: 'Lato', fontStyle: 'normal', fontSize: 9, fillColor: undefined },
    //     body: ultimosCambios,
    //     margin: { top: this.startcContent, left: this.marginContent, bottom: 80 },
    //     alternateRowStyles: { fillColor: undefined },
    //     startY: this.usoPagina + 60,
    //     didDrawCell: (data) => {
    //       if (page == data.pageCount) {
    //         if (data.row.index != index) {
    //           index = data.row.index
    //           this.usoPagina += data.row.height
    //         }
    //       }
    //     },

    //     didDrawPage: (data) => {
    //       if (data.pageNumber != 1) {
    //         this.implementarFooter()
    //         this.implementarHeader()
    //       }
    //       page++
    //       lastTableHeight = this.usoPagina
    //       this.usoPagina = 0
    //     }
    //   })

    // }



    let doc = this.doc
    this.doc.setFontSize(8)
    this.doc.setFont('Lato', 'normal')
    this.doc.text('TABLA ' + this.contadorTabla + ': DESDE 01/11/2023 00:00 HASTA 30/11/2023 23:59', ((this.marginRight - this.marginContent) / 2 + this.marginContent), this.usoPagina + 55, { align: 'center', maxWidth: this.marginRight - this.marginContent })
    // this.doc.setFontSize(11)
    // this.doc.setTextColor(this.colores.negro)
    // this.doc.setFont('Lato', 'normal')

    autoTable(doc, {
      margin: { left: this.marginContent },
      styles: { halign: 'center', lineWidth: .1, fillColor: undefined, lineColor: [1, 48, 51], textColor: [1, 48, 51] },
      bodyStyles: { fontStyle: 'bold' },
      headStyles: { fillColor: [217, 217, 217] },
      alternateRowStyles: { fillColor: undefined },
      head: [[{ content: 'Probabilidad de daño al esparcidor', styles: { cellWidth: 125, cellPadding: { top: 15, bottom: 15 } } }, { content: 'Longitud' }, { content: 'Apertura' }, { content: 'Áreas de criticidad' }]],
      columnStyles: { 0: { fillColor: [217, 217, 217] } },
      body: matrix.matrixNombre,
      startY: this.usoPagina + 60,
      didDrawCell: function (data) {

        if (data.cell.text[0].includes('Longitud')) {
          autoTable(doc, {
            styles: { fillColor: undefined, halign: 'center', textColor: [1, 48, 51], lineWidth: .1, lineColor: [1, 48, 51] },
            alternateRowStyles: { fillColor: undefined },
            startY: data.cell.y + 20,
            margin: { left: data.cell.x },
            tableWidth: data.cell.width,
            head: [['Min\n[px]', 'Max\n[px]']],
            body: matrix.matrixLongitud

          })
        }

        if (data.cell.text[0].includes('Apertura')) {
          autoTable(doc, {
            styles: { fillColor: undefined, halign: 'center', textColor: [1, 48, 51], lineWidth: .1, lineColor: [1, 48, 51] },
            alternateRowStyles: { fillColor: undefined },
            startY: data.cell.y + 20,
            margin: { left: data.cell.x },
            tableWidth: data.cell.width,
            head: [['Min\n[px]', 'Max\n[px]']],
            body: matrix.matrixApertura

          })
        }

        if (data.cell.text[0].includes('Áreas de criticidad')) {
          autoTable(doc, {
            styles: { fillColor: undefined, halign: 'center', textColor: [1, 48, 51], lineWidth: .1, lineColor: [1, 48, 51] },
            alternateRowStyles: { fillColor: undefined },
            headStyles: { cellPadding: { top: 11.5, bottom: 10 }, },
            startY: data.cell.y + 20,
            margin: { left: data.cell.x },
            tableWidth: data.cell.width,
            head: [['A4', 'A3', 'A2', 'A1']],
            body: matrix.matrixAreas

          })
        }
      }
    })

    this.usoPagina += 240 + lastTableHeight
  }

  implementarConclusion(inputs: FormGroup) {

    let conc = inputs.controls['conclusion'].value
    if (this.usoPagina + 120 > this.totalUso)
      this.nuevaPagina()

    let contenido: Data = {
      titulo: this.contadorItem + '. Conclusiones y recomendaciones',
      pagina: this.contadorPagina,
      sub: null
    }
    this.listaContenido.push(contenido)


    this.doc.setFontSize(14)
    this.doc.setTextColor(this.colores.naranjo)
    this.doc.setFont('Lato', 'bold')
    this.doc.text(this.contadorItem + '. Conclusiones y recomendaciones', this.marginContent, this.usoPagina, { align: 'left', maxWidth: this.marginRight - this.marginContent })
    this.contadorItem++

    this.doc.setFontSize(11)
    this.doc.setTextColor(this.colores.negro)
    this.doc.setFont('Lato', 'normal')

    let text = 'Con respecto a la disponibilidad de la Infraestructura EMT este mes corresponde a 92.41%, como plan de acción para mejorar la respuesta ante la baja disponibilidad se implementó un sistema de alerta de caída de procesos.'
    // justify(this.doc, text, this.marginContent, this.usoPagina + 30, this.marginRight - this.marginContent)
    text = 'Se realiza el monitoreo de acuerdo a lo establecido, y con base en los registros de la aplicación A2MG, se puede indicar que se registran grietas longitudinales de criticidad alta los días 25/11/23 y 26/11/23, las que no comprometen la estabilidad del esparcidor.'
    // justify(this.doc, text, this.marginContent, this.usoPagina + 80, this.marginRight - this.marginContent)
    text = 'Las grietas registradas con alta criticidad, que corresponden a falsos positivos se registraron e identificaron para mejorar la capacidad de detección del sistema y así el algoritmo las pueda discriminar en las próximas versiones.'
    // justify(this.doc, text, this.marginContent, this.usoPagina + 130, this.marginRight - this.marginContent)
    text = 'Las grietas detectadas el día 26/11/23 en la madrugada evidencian que el A2MG tiene la capacidad detectar grietas durante la noche. En base a lo anterior se recomienda incorporar iluminación en el sector de operación al esparcidor, para mejorar la detección de las grietas durante los periodos sin luz natural.'
    // justify(this.doc,text, this.marginContent, this.usoPagina + 180, this.marginRight - this.marginContent)

    // justify(this.doc, conc ? conc : '', this.marginContent, this.usoPagina + 30, this.marginRight - this.marginContent)
    // this.doc.text(conc ? conc : '', this.marginContent, this.usoPagina + 30, { align: 'justify', maxWidth: this.marginRight - this.marginContent })

    this.usoPagina += 150
  }

  nuevaPagina() {
    this.usoPagina = this.startcContent
    this.doc.addPage()
    this.doc.addImage("assets/images/marca.jpg", 'JPG', 0, 0, 612, 792, 'marca-x', 'SLOW');
    this.implementarHeader()
    this.implementarFooter()
  }

  previsualizar() {
    // this.doc.setProperties({ title: 'Titulo de l PDF' })
    // var blob = this.doc.output("dataurlnewwindow", { filename: 'data.pdf' });
    // var blob = this.doc.output("blob");
    // window.open(URL.createObjectURL(blob));
    this.doc.save('INFORME_MENSUAL_A2MG_' + (this.mesNum + 1) + '_' + this.anoNum)

    // this.doc.output("pdfobjectnewwindow");
  }

  cargarDatos(inputs: FormGroup) {

    let fecha = inputs.get('fecha')?.value + '-07'
    let mes = new Date(fecha).toLocaleString('default', { month: 'long' })
    let ano = new Date(fecha).getFullYear()
    mes = mes.charAt(0).toUpperCase() + mes.slice(1);
    this.fecha = mes + ' ' + ano
  }

  onPrevizualizar(dataCriticisdad: any, dataMatrix: any, tablaDispo: any, imgCriticidad: any, comentariosCriticidad: any, inputs: FormGroup, comentariosImagenes: any[]) {

    this.cargarDatos(inputs)
    this.implementarFuentes()
    this.implementarPortada()
    this.generarTablaResumen(inputs)
    this.implementarIndicadoresDeServicio(tablaDispo, inputs)
    this.implmentarConfiabilidad(inputs, comentariosImagenes)
    this.implementarAnalisis(dataCriticisdad, imgCriticidad, comentariosCriticidad, inputs)
    this.implementarParametroA2MG(dataMatrix)
    this.implementarConclusion(inputs)
    this.implementarTablaContenido()
    this.previsualizar()

  }


}
