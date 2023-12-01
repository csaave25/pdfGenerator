import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { font, latoRegular, montBold, montMedium, montSemi } from 'src/assets/fonts/fonts';
import { dataInforme } from './informe-mensual/informeData';
import { ConsultasService } from './consultas.service';
import { Observable, retry } from 'rxjs'
import { HttpClient } from '@angular/common/http';




interface Data {
  titulo: string,
  pagina: number,
  sub: Data[] | null
}

@Injectable({
  providedIn: 'root'
})
export class InformeMensualService {


  constructor(private consulta: ConsultasService, private http: HttpClient) { }


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
  mesNum = 6
  anoNum = 2023

  doc = new jsPDF('p', 'pt', 'letter')

  url: string = 'https://apps.emt.cl/api/images/alertas/alta';

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
    this.doc.addImage("assets/images/image2.jpg", 'JPG', 0, 0, 612, 792, 'marca', 'SLOW');
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
    this.doc.text(dataInforme.fecha, margenIzq + 320, altura + 174, { align: 'left' });
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
    this.doc.addImage("assets/images/logo.png", 'PNG', this.marginLeft, this.startPage, 160, 50, 'logo', 'SLOW');
    this.doc.setFontSize(8)
    this.doc.setTextColor(this.colores.negro)
    this.doc.setFont('Lato', 'normal')
    this.doc.text('Informe Mensual', this.marginRight, this.startPage + 12, { align: 'right' })
    this.doc.setTextColor(this.colores.negro)
    this.doc.text('Monitoreo de Ripios Aplicación A2MG', this.marginRight, this.startPage + 24, { align: 'right' })
    this.doc.text('Octubre 2023', this.marginRight, this.startPage + 36, { align: 'right' })
  }



  generarTablaResumen() {

    this.doc.addPage()
    this.doc.addImage("assets/images/marca.jpg", 'JPG', 0, 0, 612, 792, 'marca2', 'SLOW');

    this.doc.addImage("assets/images/logo.png", 'PNG', this.marginLeft, this.startPage, 160, 50, 'logo', 'SLOW');
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
    this.doc.text(dataInforme.fecha, margenIzq + 300, altura + 174, { align: 'left' });


    autoTable(this.doc, {
      theme: 'grid',
      styles: { halign: 'center', fontSize: 10, cellWidth: 150, fillColor: undefined, lineColor: [1, 48, 51] },
      headStyles: { font: 'Lato', fontStyle: 'bold', textColor: [1, 48, 51], fillColor: [217, 217, 217], lineWidth: .1 },
      head: [['ELABORADO', 'REVISADO', 'APROBADO']],
      bodyStyles: { cellPadding: [10, 0, 10, 0], font: 'Lato', textColor: [1, 48, 51], fontStyle: 'normal', fontSize: 9, fillColor: undefined },
      body: [
        ['CONSTANZA SARRÍA \n\n INGENIERO GEOTÉCNICO MCM', 'VALERIA MIRANDA \n\n LÍDER MCM-AMSA', 'LEONARDO ZAHR \n\n JEFE MCM'],

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

  implementarIndicadoresDeServicio() {

    let contenido: Data = {
      titulo: this.contadorItem + '. Indicadores de Servicio',
      pagina: this.contadorPagina,
      sub: [{
        titulo: this.contadorItem + '.1 Disponibilidad del Sistema',
        pagina: this.contadorPagina,
        sub: null
      }]
    }

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
    this.doc.text('La disponibilidad del sistema, indica cuánto tiempo este está operativo con respecto al tiempo programado de funcionamiento. La fórmula para calcular la disponibilidad es:', this.marginContent, this.startcContent + 60, { align: 'left', maxWidth: this.marginRight - this.marginContent })


    //formula
    // this.doc.addImage("assets/images/formula1.png", 'PNG', this.marginLeft + 20, this.startcContent + 300, this.marginRight - this.marginLeft, 90, 'formula1', 'SLOW');
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
    this.doc.text('Efectivo+Demoras+Reserva', this.marginContent + 306, this.startcContent + 120, { align: 'left' })
    this.doc.text('Tiempo', this.marginContent + 345, this.startcContent + 144, { align: 'left' })
    this.doc.setFontSize(9)
    this.doc.text('nominal', this.marginContent + 383, this.startcContent + 148, { align: 'left' })
    this.doc.line(this.marginContent + 300, this.startcContent + 128, this.marginContent + 450, this.startcContent + 128)

    this.doc.setFont('Lato', 'normal')
    this.doc.setFontSize(11)
    this.doc.text('Los componentes del sistema de monitoreo corresponden a Infraestructura EMT (servicio web, imágenes, base de datos, API y computo), Infraestructura ANT (sistema de adquisición de imágenes) y Enlaces (Dedicado AMSA). A continuación, en la TABLA 1 se presenta la disponibilidad del sistema. ', this.marginContent, this.startcContent + 190, { align: 'left', maxWidth: this.marginRight - this.marginContent })

    this.doc.text('La disponibilidad comprometida corresponde al 95% para el caso de Infraestructura EMT.', this.marginContent, this.startcContent + 250, { align: 'left', maxWidth: this.marginRight - this.marginContent })


    this.doc.setFontSize(8)
    this.doc.setFont('Lato', 'normal')
    this.doc.text('TABLA 1: DISPONIBILIDAD DEL SISTEMA', ((this.marginRight - this.marginContent) / 2 + this.marginContent), this.startcContent + 280, { align: 'center', maxWidth: this.marginRight - this.marginContent })

    autoTable(this.doc, {
      tableWidth: this.marginRight - this.marginContent,
      styles: { fontSize: 10, lineWidth: .1, fillColor: undefined, lineColor: [1, 48, 51], textColor: [1, 48, 51] },
      headStyles: { font: 'Lato', fontStyle: 'bold', fillColor: [217, 217, 217], halign: 'center' },
      head: [['Indicador', 'Disponibilidad [%]', 'Observaciones']],
      bodyStyles: { font: 'Lato', fontStyle: 'normal', fontSize: 9, fillColor: undefined, halign: 'left' },
      body: [
        [{ content: 'Infraestructura EMT', styles: { minCellWidth: 200, font: 'Lato', fontStyle: 'bold', fillColor: [218, 218, 217], cellPadding: { left: 50, top: 5 } } }, { content: '98,40', styles: { font: 'Lato', fontStyle: 'bold', fillColor: [218, 218, 217], halign: 'center' } }, { content: '', styles: { fillColor: [218, 218, 217] } }],
        [{ content: 'Servicio web', styles: { halign: 'left', cellPadding: { left: 75, top: 5 } } }, { content: '99,99', styles: { halign: 'center' } }, ''],
        [{ content: 'Servicio imágenes', styles: { halign: 'left', cellPadding: { left: 75, top: 5 } } }, { content: '100,00', styles: { halign: 'center' } }, ''],
        [{ content: 'Servicio base de datos', styles: { halign: 'left', cellPadding: { left: 75, top: 5 } } }, { content: '100,00', styles: { halign: 'center' } }, ''],
        [{ content: 'Servicio API', styles: { halign: 'left', cellPadding: { left: 75, top: 5 } } }, { content: '100,00', styles: { halign: 'center' } }, ''],
        [{ content: 'Servicio de computo', styles: { halign: 'left', cellPadding: { left: 75, top: 5 } } }, { content: '92,00', styles: { halign: 'center' } }, ''],
        [{ content: 'Infraestructura ANT', styles: { font: 'Lato', fontStyle: 'bold', fillColor: [218, 218, 217], cellPadding: { left: 50, top: 5 } } }, { content: '90,11', styles: { font: 'Lato', fontStyle: 'bold', fillColor: [218, 218, 217], halign: 'center' } }, { content: '', styles: { fillColor: [218, 218, 217] } }],
        [{ content: 'Sistema de adquisición de imágenes', styles: { halign: 'left', cellPadding: { left: 75, top: 5 } } }, { content: '90,01', styles: { halign: 'center' } }, ''],
        [{ content: ' Enlaces', styles: { font: 'Lato', fontStyle: 'bold', fillColor: [218, 218, 217], cellPadding: { left: 50, top: 5 } } }, { content: '99,06', styles: { font: 'Lato', fontStyle: 'bold', fillColor: [218, 218, 217], halign: 'center' } }, { content: '', styles: { fillColor: [218, 218, 217] } }],
        [{ content: 'Enlace dedicado AMSA', styles: { halign: 'left', cellPadding: { left: 75, top: 5 } } }, { content: '99,06', styles: { halign: 'center' } }, ''],

      ],
      margin: { top: this.startcContent + 285, left: this.marginContent },
      alternateRowStyles: { fillColor: undefined }
    })
    // this.nuevaPagina()
    this.usoPagina = 1000
  }

  implmentarConfiabilidad() {

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
    this.doc.text('La confiabilidad del servicio, cuantifica la cantidad de grietas alertadas anticipadamente con el sistema de monitoreo disponible, en función a la cantidad de grietas formadas en el área de cobertura asociada a la operación del esparcidor. ', this.marginContent, this.usoPagina + 30, { align: 'left', maxWidth: this.marginRight - this.marginContent })
    this.doc.text('Dentro de los parámetros a considerar están:', this.marginContent, this.usoPagina + 90, { align: 'left', maxWidth: this.marginRight - this.marginContent })

    this.doc.setFont('Lato', 'bold')
    this.doc.text('• Identificación :', this.marginContent + 30, this.usoPagina + 120, { align: 'left', maxWidth: this.marginRight - this.marginContent })
    this.doc.setFont('Lato', 'normal')
    this.doc.text('mide el porcentaje de agrietamientos detectados (como conjunto, no individualmente).', this.doc.getTextWidth('• Identificación :') + 40 + this.marginContent, this.usoPagina + 120, { align: 'left', maxWidth: this.marginRight - this.marginContent - 150 })

    this.doc.setFont('Lato', 'bold')
    this.doc.text('• Clasificación :', this.marginContent + 30, this.startcContent + 160, { align: 'left', maxWidth: this.marginRight - this.marginContent })
    this.doc.setFont('Lato', 'normal')
    this.doc.text('se refiere a la capacidad de asignar correctamente la criticidad a las grietas.', this.doc.getTextWidth('• Identificación :') + 40 + this.marginContent, this.usoPagina + 160, { align: 'left', maxWidth: this.marginRight - this.marginContent - 150 })

    this.doc.setFont('Lato', 'bold')
    this.doc.text('• Comunicación :', this.marginContent + 30, this.usoPagina + 200, { align: 'left', maxWidth: this.marginRight - this.marginContent })
    this.doc.setFont('Lato', 'normal')
    this.doc.text('correcto aviso de EMT a ANT ante una grieta de criticidad alta.', this.doc.getTextWidth('• Identificación :') + 40 + this.marginContent, this.usoPagina + 200, { align: 'left', maxWidth: this.marginRight - this.marginContent - 150 })


    this.doc.text('La confiabilidad del servicio durante el periodo fue del 100%, el cual se desglosa en la TABLA 2 a continuación.', this.marginContent, this.usoPagina + 230, { align: 'left', maxWidth: this.marginRight - this.marginContent })

    this.doc.setFontSize(8)
    this.doc.setFont('Lato', 'normal')
    this.doc.text('TABLA 2: CONFIABILIDAD', ((this.marginRight - this.marginContent) / 2 + this.marginContent), this.usoPagina + 275, { align: 'center', maxWidth: this.marginRight - this.marginContent })

    autoTable(this.doc, {
      styles: { lineWidth: .1, halign: 'center', fontSize: 10, cellWidth: 100, fillColor: undefined, lineColor: [1, 48, 51], textColor: [1, 48, 51] },
      headStyles: { font: 'Lato', fontStyle: 'bold', fillColor: [217, 217, 217] },
      head: [['Parámetro', 'Valor']],
      bodyStyles: { font: 'Lato', fontStyle: 'normal', fontSize: 9, fillColor: undefined },
      body: [
        ['Identificación', '100,00'],
        ['Clasificación', '100,00'],
        ['Comunicación', '100,00'],
        ['Confiabilidad', '100,00'],
      ],
      margin: { top: this.usoPagina + 280, left: (((this.marginRight - (100 * 2) + this.marginContent) / 2)) },
      alternateRowStyles: { fillColor: undefined },
      footStyles: { fillColor: [217, 217, 217] },
      foot: [['Confiabilidad', '100,00']]
    })

    this.usoPagina += 445

  }



  implementarAnalisis(data: any) {
    const manejoData = () => {
      let tabla: any = []
      data.objects.alerts.forEach((dato: any) => {
        let fecha = new Date(dato.date).getMonth()
        if ((fecha == this.mesNum) && !dato.fake) {
          function addZero(i: any) {
            if (i < 10) { i = "0" + i }
            return i;
          }
          let d = new Date(dato.date)
          let date = d.toLocaleString()
          let h = addZero(d.getHours());
          let m = addZero(d.getMinutes());
          let s = addZero(d.getSeconds());
          let hora = h + ":" + m + ":" + s;
          tabla.push([dato.camera, date, hora, dato.zonas, dato.id, dato.openning, dato.length])

        }
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
      this.doc.text('Durante el periodo no se registran grietas de criticidad alta asociadas a alguna condición de fallamiento.', this.marginContent, this.usoPagina + 30, { align: 'left', maxWidth: this.marginRight - this.marginContent })
      this.usoPagina += 65

    } else {
      //GENERA TABLA
      let index = 0
      let lastTableHeight = 0
      let page = 1
      autoTable(this.doc, {
        styles: { lineWidth: .1, halign: 'center', fontSize: 10, fillColor: undefined, lineColor: [1, 48, 51], textColor: [1, 48, 51] },
        headStyles: { font: 'Lato', fontStyle: 'bold', fillColor: [217, 217, 217] },
        head: [['Id Camara', 'Fecha', 'Hora', 'Zona', 'Grieta', 'Apertura', 'Longitud']],
        bodyStyles: { font: 'Lato', fontStyle: 'normal', fontSize: 9, fillColor: undefined },
        body: this.tablaCriticidades,
        margin: { top: this.startcContent, left: this.marginContent, bottom: 80 },
        alternateRowStyles: { fillColor: undefined },
        startY: this.usoPagina + 30,
        didDrawCell: (data) => {
          if (page == data.pageCount) {
            if (data.row.index != index) {
              index = data.row.index
              this.usoPagina += data.row.height
            }
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

  implementarParametroA2MG(dataMatrix: any, dataUltimosCambiosMatrix: any) {

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

    dataMatrix.objects.forEach((data: any) => {
      matrix.matrixNombre.push([data.name]);
      matrix.matrixLongitud.push([data.length_min, data.length_max])
      matrix.matrixApertura.push([data.openning_min, data.openning_max])
      matrix.matrixAreas.push([
        { content: data.m1, styles: { fillColor: colores(data.m1) } },
        { content: data.m2, styles: { fillColor: colores(data.m2) } },
        { content: data.m3, styles: { fillColor: colores(data.m3) } },
        { content: data.m4, styles: { fillColor: colores(data.m4) } }
      ])

    })

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

    this.doc.text('Matriz utilizada entre 01-' + (this.mesNum + 1) + '-' + this.anoNum + ' 00:00 y ' + ultimoDiaMes + '-' + this.mesNum + '-' + this.anoNum + ' 23:59.', this.marginContent, this.usoPagina + 30, { align: 'left', maxWidth: this.marginRight - this.marginContent })

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

    autoTable(doc, {

      margin: { left: this.marginContent },
      styles: { halign: 'center', lineWidth: .1, fillColor: undefined, lineColor: [1, 48, 51], textColor: [1, 48, 51] },
      bodyStyles: { fillColor: undefined },
      headStyles: { fillColor: [217, 217, 217] },
      alternateRowStyles: { fillColor: undefined },
      head: [[{ content: 'Probabilidad de daño al esparcidor', styles: { cellWidth: 125, cellPadding: { top: 15, bottom: 15 } } }, { content: 'Longitud' }, { content: 'Apertura' }, { content: 'Áreas de criticidad' }]],
      body: matrix.matrixNombre,
      startY: this.usoPagina + 65,
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

    this.usoPagina += 240 + lastTableHeight + 80
  }

  implementarConclusion() {

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
    this.doc.text('Con respecto a la disponibilidad de la Infraestructura EMT se cumple con los parámetros establecidos. El servicio se entregó de manera continua y sin incidentes. \n\nSe realiza el monitoreo de acuerdo a lo establecido y con base en los registros de la aplicación A2MG, se puede indicar que no se registran grietas que comprometan la estabilidad de los taludes. Las grietas registradas como alta criticidad que corresponden a falsos positivos se registran e identifican para mejorar el sistema, y así puedan ser eliminadas en próximas versiones. \n \nNo se detectan grietas de criticidad alta asociada a alguna condición de fallamiento de terreno ', this.marginContent, this.usoPagina + 30, { align: 'left', maxWidth: this.marginRight - this.marginContent })

    this.usoPagina += 150
  }

  nuevaPagina() {
    this.usoPagina = this.startcContent
    this.doc.addPage()
    this.doc.addImage("assets/images/marca.jpg", 'JPG', 0, 0, 612, 792, 'marca2', 'SLOW');
    this.implementarHeader()
    this.implementarFooter()
  }

  previsualizar() {
    let string = this.doc.output('datauristring');
    let embed = "<embed width='100%' height='100%' src='" + string + "'/>"
    let x = window.open();
    x!.document.open();
    x!.document.write(embed);
    x!.document.body.style.margin = '0'
    x!.document.close();
  }

  onPrevizualizar(data: any, dataMatrix: any, dataUltimosCambiosMatrix: any) {
    this.implementarFuentes()
    this.implementarPortada()
    this.generarTablaResumen()
    this.implementarIndicadoresDeServicio()
    this.implmentarConfiabilidad()
    this.implementarAnalisis(data)
    this.implementarParametroA2MG(dataMatrix, dataUltimosCambiosMatrix)
    this.implementarConclusion()
    this.implementarTablaContenido()
    this.previsualizar()

  }


}
