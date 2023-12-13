import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { font, latoRegular, montBold, montMedium, montSemi } from 'src/assets/fonts/fonts';
import { colores, data, dividirTexto, espaciarTextosLargos, justify, obtenerAncho } from './data';

@Injectable({
  providedIn: 'root'
})
export class InformeService {

  constructor() { }


  doc = new jsPDF('p', 'pt', 'letter')
  margenIzq = 20
  margenDer = 562
  finalPagina = 760
  comienzoPaginaY = 20
  cominezoContenidoY = this.comienzoPaginaY + 80
  margenContenidoIzq = this.margenIzq + 50
  contadorPagina = 1
  usoPagina = this.cominezoContenidoY
  totalUso = this.finalPagina - this.cominezoContenidoY
  contadorItem = 1
  maxMargen = this.margenDer - this.margenContenidoIzq
  puntoMedio = (this.doc.internal.pageSize.width || this.doc.internal.pageSize.getWidth()) / 2
  mes = new Date(data.ano, data.mes - 1, 1).toLocaleString('default', { month: 'long' });


  generarSeccion1() {
    this.doc.addImage("assets/EFE/Luis.jpg", 'JPG', this.margenIzq, this.cominezoContenidoY, 370, 270, 'LUIS' + this.contadorPagina, 'SLOW');

    this.doc.setTextColor(colores.negro)
    this.doc.setFontSize(10)
    this.doc.setFont("Lato", "bold");
    this.doc.text('Estado de la Instrumentación', this.margenDer - 165, this.cominezoContenidoY + 10, { align: 'left', maxWidth: this.maxMargen });

    this.doc.setFont("Lato", "normal");

    if (data.seccion1.estadoIntrumentos.piezometro) {
      this.doc.setTextColor(colores.verde)
      this.doc.addImage("assets/EFE/checkmark.png", 'PNG', this.margenDer - 165, this.cominezoContenidoY + 20, 12, 12, 'check' + this.contadorPagina, 'SLOW');
    } else {
      this.doc.setTextColor(colores.amarillo)
      this.doc.addImage("assets/EFE/caution.png", 'PNG', this.margenDer - 165, this.cominezoContenidoY + 20, 12, 12, 'caution' + this.contadorPagina, 'SLOW');
    }
    this.doc.text('Piezómetros', this.margenDer - 150, this.cominezoContenidoY + 30, { align: 'left', maxWidth: this.maxMargen });


    if (data.seccion1.estadoIntrumentos.gcd) {
      this.doc.setTextColor(colores.verde)
      this.doc.addImage("assets/EFE/checkmark.png", 'PNG', this.margenDer - 165, this.cominezoContenidoY + 40, 12, 12, 'check' + this.contadorPagina, 'SLOW');
    } else {
      this.doc.setTextColor(colores.amarillo)
      this.doc.addImage("assets/EFE/caution.png", 'PNG', this.margenDer - 165, this.cominezoContenidoY + 40, 12, 12, 'caution' + this.contadorPagina, 'SLOW');
    }
    this.doc.text('GCD: Geo Centinela Deformación', this.margenDer - 150, this.cominezoContenidoY + 50, { align: 'left', maxWidth: this.maxMargen });



    if (data.seccion1.estadoIntrumentos.gcc) {
      this.doc.setTextColor(colores.verde)
      this.doc.addImage("assets/EFE/checkmark.png", 'PNG', this.margenDer - 165, this.cominezoContenidoY + 60, 12, 12, 'check' + this.contadorPagina, 'SLOW');
    } else {
      this.doc.setTextColor(colores.amarillo)
      this.doc.addImage("assets/EFE/caution.png", 'PNG', this.margenDer - 165, this.cominezoContenidoY + 60, 12, 12, 'caution' + this.contadorPagina, 'SLOW');
    }

    this.doc.text('GCC: Geo Centinela Corte', this.margenDer - 150, this.cominezoContenidoY + 70, { align: 'left', maxWidth: this.maxMargen });


    if (data.seccion1.estadoIntrumentos.prisma) {
      this.doc.setTextColor(colores.verde)
      this.doc.addImage("assets/EFE/checkmark.png", 'PNG', this.margenDer - 165, this.cominezoContenidoY + 80, 12, 12, 'check' + this.contadorPagina, 'SLOW');

    } else {
      this.doc.setTextColor(colores.amarillo)
      this.doc.addImage("assets/EFE/caution.png", 'PNG', this.margenDer - 165, this.cominezoContenidoY + 80, 12, 12, 'caution' + this.contadorPagina, 'SLOW');

    }

    this.doc.text('Prismas', this.margenDer - 150, this.cominezoContenidoY + 90, { align: 'left', maxWidth: this.maxMargen });

    autoTable(this.doc, {
      theme: 'grid',
      styles: { halign: 'center', fontSize: 7, fillColor: undefined, lineColor: [1, 48, 51] },
      headStyles: { font: 'Lato', fontStyle: 'bold', textColor: [1, 48, 51], fillColor: undefined, lineWidth: .1 },
      head: [['   Operativo', '   Con Observación']],
      margin: { left: this.margenDer - 165 },
      startY: this.cominezoContenidoY + 100,
      tableWidth: 170,

      didDrawCell: (data) => {
        let width = data.cell.width
        let height = data.cell.height
        let x = data.cell.x + 5
        let y = data.cell.y + 3
        if (data.column.index == 0) {
          this.doc.addImage("assets/EFE/checkmark.png", 'PNG', x, y, 11, 11, 'check' + this.contadorPagina, 'SLOW');
        } else {
          this.doc.addImage("assets/EFE/caution.png", 'PNG', x + 6, y, 11, 11, 'caution' + this.contadorPagina, 'SLOW');
        }
      }
    })


    //Tabla de criterios
    this.doc.setTextColor(colores.negro)
    this.doc.setFontSize(12)
    this.doc.setFont("Lato", "bold");
    this.doc.text('Criterios de Aceptabilidad', this.margenDer - 165, this.cominezoContenidoY + 145, { align: 'left', maxWidth: this.maxMargen });

    this.doc.setFont("Lato", "normal");

    this.doc.setLineWidth(0.1);
    this.doc.setFillColor(89, 238, 33);
    this.doc.circle(this.margenDer - 155, this.cominezoContenidoY + 165, 7, "FD");
    this.doc.text('Normal', this.margenDer - 144, this.cominezoContenidoY + 169, { align: 'left', maxWidth: this.maxMargen });

    this.doc.setFillColor(237, 243, 38);
    this.doc.circle(this.margenDer - 70, this.cominezoContenidoY + 165, 7, "FD");
    this.doc.text('Precaución', this.margenDer - 59, this.cominezoContenidoY + 169, { align: 'left', maxWidth: this.maxMargen });

    this.doc.setFillColor(238, 166, 33);
    this.doc.circle(this.margenDer - 155, this.cominezoContenidoY + 195, 7, "FD");
    this.doc.text('Alerta', this.margenDer - 144, this.cominezoContenidoY + 200, { align: 'left', maxWidth: this.maxMargen });

    this.doc.setFillColor(238, 42, 33);
    this.doc.circle(this.margenDer - 70, this.cominezoContenidoY + 195, 7, "FD");
    this.doc.text('Alarma', this.margenDer - 59, this.cominezoContenidoY + 200, { align: 'left', maxWidth: this.maxMargen });


    //Estado General
    this.doc.setFontSize(10)
    this.doc.setFont("Lato", "bold");
    this.doc.text('Estado General:', this.margenIzq, this.cominezoContenidoY + 290, { align: 'left', maxWidth: this.maxMargen });

    this.doc.setFont("Lato", "normal");

    let start = this.cominezoContenidoY + 310
    this.usoPagina = espaciarTextosLargos(this.doc, data.seccion1.estadogeneral, start, this.margenIzq, this.margenDer)

    //Observaciones
    this.doc.setFontSize(10)
    this.doc.setFont("Lato", "bold");
    this.doc.text('Observaciones:', this.margenIzq, this.usoPagina + 10, { align: 'left', maxWidth: this.maxMargen });
    this.usoPagina += 20
    let page = 1
    autoTable(this.doc, {
      // theme: 'grid',
      styles: { halign: 'left', font: 'Lato', fontStyle: 'normal', fontSize: 10, fillColor: undefined, lineColor: [1, 48, 51], textColor: [1, 48, 51] },
      headStyles: { font: 'Lato', fontStyle: 'bold', fillColor: undefined, lineWidth: .1 },
      body: [['Piezómetros:', data.seccion1.observaciones.piezometro], ['GCD:', data.seccion1.observaciones.gcd], ['GCC:', data.seccion1.observaciones.gcc], ['Prismas:', data.seccion1.observaciones.prisma]],
      margin: { left: this.margenIzq, top: this.cominezoContenidoY },
      startY: this.usoPagina,
      columnStyles: { 0: { cellWidth: 80 }, 1: { halign: 'justify' } },
      alternateRowStyles: { fillColor: undefined },
      rowPageBreak: 'avoid',
      didDrawCell: (data) => {
        if (data.column.index == 1 && data.cell.section == 'body') {
          this.usoPagina += data.row.height
        }
      },

      didDrawPage: (data) => {
        if (data.pageNumber != page) {
          this.usoPagina = this.cominezoContenidoY
          page = data.pageNumber
        }
      },

      willDrawPage: (data) => {

        if (page != data.pageNumber) {
          this.doc.addImage("assets/images/marca.jpg", 'JPG', 0, 0, 612, 792, 'marca-x', 'SLOW');
          this.implementarHeader()
          this.implementarFooter()
        }
      },
    })

    this.usoPagina += 20

    this.crearNuevaPagina(this.usoPagina + 89)

    //Tabla de monitoreo geotecnico
    this.doc.setFontSize(10)
    this.doc.setFont("Lato", "bold");
    this.doc.text('Monitoreo Geotécnico', this.puntoMedio, this.usoPagina, { align: 'center', maxWidth: this.maxMargen });

    this.usoPagina += 10

    autoTable(this.doc, {
      theme: 'grid',
      styles: { halign: 'left', font: 'Lato', fontStyle: 'normal', fontSize: 8, fillColor: undefined, lineColor: [1, 48, 51], textColor: [1, 48, 51] },
      headStyles: { font: 'Lato', fontStyle: 'bold', fillColor: undefined, lineWidth: .1 },
      body: [['Alarmas mes', data.seccion1.tablaMonitoreo.alarmas], ['Alerta mes', data.seccion1.tablaMonitoreo.alertas], ['Modo Vigilancia', data.seccion1.tablaMonitoreo.vigilacia], ['Reporte post sismo ', data.seccion1.tablaMonitoreo.sismo]],
      margin: { left: this.puntoMedio - (70 + 90) / 2, top: this.usoPagina },
      startY: this.usoPagina,
      columnStyles: { 0: { halign: 'left', cellWidth: 90 }, 1: { halign: 'center', cellWidth: 70 } },
      alternateRowStyles: { fillColor: undefined },
      rowPageBreak: 'avoid',

      didDrawCell: (data) => {
        let width = data.cell.width
        let height = data.cell.height
        let x = data.cell.x + 5
        let y = data.cell.y + 3
        if (data.column.index == 0 && data.row.index == 0) {

          this.doc.setFillColor(238, 42, 33);
          this.doc.circle(x + width - 20, y + 7, 4, "FD");

        }
        if (data.column.index == 0 && data.row.index == 1) {
          this.doc.setFillColor(238, 166, 33);
          this.doc.circle(x + width - 20, y + 7, 4, "FD");
        }
      }
    })
  }

  generarAnalisisDeDatos() {
    let nEstacion = 6
    data.seccionAnalisis.forEach(seccion => {
      this.crearNuevaPagina(this.usoPagina + 400)

      this.doc.setFontSize(10)
      this.doc.setFont("Lato", "bold");
      this.doc.text('Análisis de datos estación ' + nEstacion, this.margenIzq, this.usoPagina, { align: 'left', maxWidth: this.maxMargen });
      this.usoPagina += 10

      this.doc.addImage("assets/EFE/Luis.jpg", 'JPG', this.margenIzq, this.usoPagina, 320, 220, 'LUIS' + this.contadorPagina, 'SLOW');

      //Tabla de criterios
      this.doc.setTextColor(colores.negro)
      this.doc.setFontSize(12)
      this.doc.setFont("Lato", "bold");
      this.doc.text('Criterios de Aceptabilidad', this.margenDer - 215, this.usoPagina + 10, { align: 'left', maxWidth: this.maxMargen });
      this.usoPagina += 10

      this.doc.setFont("Lato", "normal");

      this.doc.setLineWidth(0.1);
      this.doc.setFillColor(89, 238, 33);
      this.doc.circle(this.margenDer - 205, this.usoPagina + 24, 7, "FD");
      this.doc.text('Normal', this.margenDer - 194, this.usoPagina + 28, { align: 'left', maxWidth: this.maxMargen });

      this.doc.setFillColor(237, 243, 38);
      this.doc.circle(this.margenDer - 123, this.usoPagina + 24, 7, "FD");
      this.doc.text('Precaución', this.margenDer - 112, this.usoPagina + 28, { align: 'left', maxWidth: this.maxMargen });
      this.usoPagina += 30

      this.doc.setFillColor(238, 166, 33);
      this.doc.circle(this.margenDer - 205, this.usoPagina + 24, 7, "FD");
      this.doc.text('Alerta', this.margenDer - 194, this.usoPagina + 28, { align: 'left', maxWidth: this.maxMargen });

      this.doc.setFillColor(238, 42, 33);
      this.doc.circle(this.margenDer - 123, this.usoPagina + 24, 7, "FD");
      this.doc.text('Alarma', this.margenDer - 112, this.usoPagina + 28, { align: 'left', maxWidth: this.maxMargen });
      this.usoPagina += 28

      this.doc.setTextColor(colores.negro)
      this.doc.setFontSize(10)
      this.doc.setFont("Lato", "bold");
      this.doc.text('Observaciones generales', this.margenDer - 215, this.usoPagina + 30, { align: 'left', maxWidth: this.maxMargen });
      this.usoPagina += 30

      this.doc.setFontSize(10)
      this.doc.setFont("Lato", "normal");
      this.usoPagina += 20 + espaciarTextosLargos(this.doc, seccion.obsGenerales, this.usoPagina + 20, this.margenDer - 215, 215 + this.margenIzq)

      //Estado mensual sensores
      this.usoPagina = this.cominezoContenidoY + 230
      this.doc.setFontSize(10)
      this.doc.setFont("Lato", "bold");
      this.doc.text('Estado mensual sensores GCD y GCC', this.margenIzq, this.usoPagina + 30, { align: 'left', maxWidth: this.maxMargen });
      this.usoPagina += 20

      this.doc.addImage("assets/EFE/Luis.jpg", 'JPG', this.margenIzq, this.usoPagina + 20, 230, 220, 'LUIS' + this.contadorPagina, 'SLOW');
      this.doc.addImage("assets/EFE/Luis.jpg", 'JPG', this.margenDer - 320 + this.margenIzq, this.usoPagina + 20, 320, 220, 'LUIS' + this.contadorPagina, 'SLOW');
      this.usoPagina += 20 + 220



      let texto1 = obtenerAncho(this.doc, seccion.obsEspecificas.gcd, 188)
      let texto2 = obtenerAncho(this.doc, seccion.obsEspecificas.gcc, 188)
      if (texto1 > texto2) {
        this.crearNuevaPagina(this.usoPagina + texto1 + 50)
        texto2 = texto1
      }
      if (texto2 > texto1) {
        this.crearNuevaPagina(this.usoPagina + texto2 + 50)
        texto1 = texto2
      }

      this.doc.setFontSize(10)
      this.doc.setFont("Lato", "bold");
      this.doc.text('Observaciones específicas GCC y GCD', this.margenIzq, this.usoPagina + 30, { align: 'left', maxWidth: this.maxMargen });
      this.usoPagina += 30

      this.doc.setFontSize(10)
      this.doc.setFont("Lato", "bold");
      this.doc.text('GCD Pozo 13: ', this.margenIzq + 30, this.usoPagina + 20, { align: 'left', maxWidth: this.maxMargen });
      this.doc.text('GCC Pozo 13: ', this.margenIzq + 310, this.usoPagina + 20, { align: 'left', maxWidth: this.maxMargen });

      this.doc.setFont("Lato", "normal");
      espaciarTextosLargos(this.doc, seccion.obsEspecificas.gcd, this.usoPagina + 20, this.margenIzq + 95, 188)
      espaciarTextosLargos(this.doc, seccion.obsEspecificas.gcc, this.usoPagina + 20, this.margenIzq + 375, 188)
      this.usoPagina += texto1 + 30
    
      
      this.crearNuevaPagina(this.usoPagina + obtenerAncho(this.doc, seccion.obsEspecificas.obsGrafico2, this.margenDer - this.margenIzq - 8 ) + 2  )
      this.doc.setFontSize(10)
      this.doc.setFont("Lato", "normal");
      espaciarTextosLargos(this.doc, seccion.obsEspecificas.obsGrafico2, this.usoPagina, this.margenIzq + 30, this.margenDer - this.margenIzq - 8)


      this.usoPagina += 250
      nEstacion++
    })


  }

  generarTablaResumen() {
    let mes = this.mes
    mes = mes.charAt(0).toUpperCase() + mes.slice(1);
    this.doc.addPage()
    this.doc.addImage("assets/images/marca.jpg", 'JPG', 0, 0, 612, 792, 'marca-x', 'SLOW');
    this.doc.addImage("assets/images/logo.png", 'PNG', this.margenIzq, this.comienzoPaginaY, 160, 50, 'logo-x', 'SLOW');

    let altura = 246
    let margenIzq = this.margenIzq + 72
    this.doc.setTextColor(colores.azul)
    this.doc.setFont("Montserrat", "bold");
    this.doc.setFontSize(22)
    this.doc.text(data.titulo + data.numInfo, this.puntoMedio, altura, { align: 'center' });

    this.doc.setTextColor(colores.negro)
    this.doc.setFontSize(16)
    this.doc.setFont("Lato", "normal");
    this.doc.text(data.subTiutlo, this.puntoMedio, altura + 30, { align: 'center', maxWidth: this.maxMargen });

    altura += obtenerAncho(this.doc, data.subTiutlo, this.maxMargen);
    this.doc.setTextColor(colores.azul)
    this.doc.setFontSize(12)
    this.doc.text(mes + ' ' + data.ano, margenIzq + 320, altura + 154, { align: 'left' });



    let nombre1 = data.tablaResumen.elaborado
    let cargo1 = data.tablaResumen.cargo
    let nombre2 = data.tablaResumen.revisado
    let cargo2 = data.tablaResumen.cargo2
    let nombre3 = data.tablaResumen.aprobado
    let cargo3 = data.tablaResumen.cargo3



    autoTable(this.doc, {
      theme: 'grid',
      styles: { halign: 'center', fontSize: 10, cellWidth: 150, fillColor: undefined, lineColor: [1, 48, 51] },
      headStyles: { font: 'Lato', fontStyle: 'bold', textColor: [1, 48, 51], fillColor: [217, 217, 217], lineWidth: .1 },
      head: [['ELABORADO', 'REVISADO', 'APROBADO']],
      bodyStyles: { cellPadding: [10, 0, 10, 0], font: 'Lato', textColor: [1, 48, 51], fontStyle: 'normal', fontSize: 9, fillColor: undefined },
      body: [
        [nombre1?.toUpperCase() + '\n\n' + cargo1?.toUpperCase(), nombre2?.toUpperCase() + '\n\n' + cargo2?.toUpperCase(), nombre3?.toUpperCase() + '\n\n' + cargo3?.toUpperCase()],

      ],
      margin: { left: (((this.margenDer - (150 * 3) + this.margenContenidoIzq) / 2)) },
      startY: this.cominezoContenidoY + 400
    })

    autoTable(this.doc, {
      theme: 'grid',
      styles: { halign: 'center', fontSize: 10, cellWidth: 120, fillColor: undefined, lineColor: [1, 48, 51], textColor: [1, 48, 51] },
      headStyles: { font: 'Lato', fontStyle: 'bold', fillColor: [217, 217, 217], lineWidth: .1 },
      head: [['FAENA', 'TIPO DE DOCUMENTO', 'ESTADO', 'CÓDIGO']],
      bodyStyles: { cellPadding: 15, font: 'Lato', fontStyle: 'normal', fontSize: 9 },
      body: [
        ['EFE', 'INFORME', 'VIGENTE', 'YV-INF-VIG-EFE-02'],

      ],
      margin: { left: (((this.margenDer - (120 * 4) + this.margenContenidoIzq) / 2)) },

    })

    this.implementarFooter()
    this.nuevaPagina()

  }

  implementarPortada() {
    let mes = this.mes
    mes = mes.charAt(0).toUpperCase() + mes.slice(1);
    let altura = 246
    let margenIzq = this.margenIzq + 72
    this.doc.addImage("assets/images/image2.jpg", 'JPG', 0, 0, 612, 792, 'marca-1', 'SLOW');
    this.doc.setTextColor(colores.blanco)
    this.doc.setFont("Montserrat", "bold");
    this.doc.setFontSize(22)
    this.doc.text(data.titulo + data.numInfo, this.puntoMedio, altura, { align: 'center' });

    this.doc.setTextColor(colores.blanco)
    this.doc.setFontSize(16)
    this.doc.setFont("Lato", "normal");
    this.doc.text(data.subTiutlo, this.puntoMedio, altura + 30, { align: 'center', maxWidth: this.maxMargen });
    altura += obtenerAncho(this.doc, data.subTiutlo, this.maxMargen);
    this.doc.setTextColor(colores.naranjo)
    this.doc.setFontSize(14)
    this.doc.text(data.subTitulo2, this.puntoMedio, altura + 70, { align: 'center', maxWidth: this.maxMargen });
    this.doc.setTextColor(colores.blanco)
    this.doc.setFontSize(12)
    this.doc.text(mes + ' ' + data.ano, margenIzq + 320, altura + 154, { align: 'left' });
  }

  implementarFooter() {
    this.doc.setFontSize(8.5)
    this.doc.setTextColor(colores.negro)
    let calc = (this.margenDer + this.margenContenidoIzq) / 2 - 14
    this.doc.setFont("Lato", 'normal')
    this.doc.text('E-Mining Technology S.A. • Calle Limache 3405, Oficina 21, Viña del Mar • Teléfono: +56 32 2187440 • eminingtech.com', calc, this.finalPagina, { align: 'center' });

    this.doc.setFont("Lato", 'bold')
    this.doc.setFontSize(10)
    // this.doc.text(this.contadorPagina.toString(), this.margenDer - 20, this.finalPagina - 20, { align: 'right' });
    this.contadorPagina++
  }

  implementarHeader() {
    this.doc.setTextColor(colores.negro)
    this.doc.addImage("assets/images/logo.png", 'PNG', this.margenDer - 60, this.comienzoPaginaY - 10, 90, 30, 'logo' + this.contadorPagina, 'SLOW');

    this.doc.setFontSize(9)
    this.doc.setFont('Lato', 'normal')
    this.doc.text('IYV-INF-VIG-EFE-02', this.margenDer + 28, this.comienzoPaginaY + 35, { align: 'right' })
    this.doc.addImage("assets/EFE/logoefe.png", 'PNG', this.margenIzq, this.comienzoPaginaY - 18, 90, 50, 'logoEfe' + this.contadorPagina, 'FAST')
    this.doc.text(data.ano + '.' + ('0' + data.mes).slice(-2), this.margenIzq + 25, this.comienzoPaginaY + 35, { align: 'left' })

    this.doc.setFontSize(13)
    this.doc.setFont('Lato', 'normal')
    this.doc.text('INFORME MENSUAL DE ANÁLISIS DE TENDENCIAS DE COMPORTAMIENTO DE LA INFRAESTRUCTURA', this.puntoMedio, this.comienzoPaginaY + 12, { align: 'center', maxWidth: this.puntoMedio + 20 })
    let altura = obtenerAncho(this.doc, data.subTiutlo, this.maxMargen) + this.comienzoPaginaY;
    this.doc.setFontSize(11)
    let mes = this.mes
    mes = mes.charAt(0).toUpperCase() + mes.slice(1);
    this.doc.text(mes + ' ' + data.ano, this.puntoMedio, altura + 20, { align: 'center' })
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

  nuevaPagina() {
    this.usoPagina = this.cominezoContenidoY
    this.doc.addPage()
    this.doc.addImage("assets/images/marca.jpg", 'JPG', 0, 0, 612, 792, 'marca-x', 'SLOW');
    this.implementarHeader()
    this.implementarFooter()
  }

  crearNuevaPagina(uso: number) {
    if (uso + 10 > this.finalPagina - 15) {
      this.nuevaPagina()
    }
  }

  crearInforme() {
    this.implementarFuentes()
    this.implementarPortada()
    this.generarTablaResumen()
    this.generarSeccion1()
    this.generarAnalisisDeDatos()
  }

  generarInforme() {
    this.crearInforme()
    this.doc.setProperties({ title: 'Informe Mensual EFE' })
    this.doc.output('pdfobjectnewwindow')
  }


}
