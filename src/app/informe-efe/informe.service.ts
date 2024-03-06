import { ElementRef, Injectable, QueryList } from '@angular/core';
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { latoBold, latoRegular, montBold, montMedium, montSemi } from 'src/assets/fonts/fonts';
import { colores, data, formateadoraDeTexto, justify, obtenerAncho } from './data';
import { AbstractControl, FormGroup } from '@angular/forms';
import { ApiService } from './api.service';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class InformeService {

  constructor(private api: ApiService) { }


  doc = new jsPDF('p', 'pt', 'letter', true)
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
  maxMargen = this.margenDer - this.margenIzq
  puntoMedio = (this.doc.internal.pageSize.width || this.doc.internal.pageSize.getWidth()) / 2
  date: string = ''
  numeroInforme: number = 0
  anoMes: string = ''
  entreFechas: string = ''


  generarSeccion1(estaciones: AbstractControl<any, any>) {

    const estados = {
      piezometro: estaciones.get('estados.piezometro')?.value,
      gcd: estaciones.get('estados.gcd')?.value,
      gcc: estaciones.get('estados.gcc')?.value,
      prismas: estaciones.get('estados.prismas')?.value,
    }
    const estadoGeneral = estaciones.get('estadoGeneral')?.value
    const observaciones = {
      piezometro: estaciones.get('observaciones.piezometro')?.value,
      gcd: estaciones.get('observaciones.gcd')?.value,
      gcc: estaciones.get('observaciones.gcc')?.value,
      prismas: estaciones.get('observaciones.prismas')?.value,
    }
    const monitoreo = {
      alarmas: estaciones.get('monitoreo.alarmas')?.value,
      alertas: estaciones.get('monitoreo.alertas')?.value,
      vigilancia: estaciones.get('monitoreo.vigilancia')?.value,
      sismo: estaciones.get('monitoreo.sismo')?.value,
    }


    this.doc.setFontSize(10)
    this.doc.setFont("Lato", "bold");
    this.doc.text('Análisis de datos estaciones', this.margenIzq, this.usoPagina, { align: 'left', maxWidth: this.maxMargen });
    this.usoPagina += 10

    this.doc.addImage("assets/EFE/estaciones.png", 'PNG', this.margenIzq, this.usoPagina, 370, 270, 'estacioness', 'FAST');

    this.doc.setTextColor(colores.negro)
    this.doc.setFontSize(10)
    this.doc.setFont("Lato", "bold");
    this.doc.text('Estado de la Instrumentación', this.margenDer - 165, this.usoPagina + 10, { align: 'left', maxWidth: this.maxMargen });

    this.doc.setFont("Lato", "normal");

    if (estados.piezometro) {
      this.doc.setTextColor(colores.verde)
      this.doc.addImage("assets/EFE/checkmark.png", 'PNG', this.margenDer - 165, this.usoPagina + 20, 12, 12, 'check-1' + this.contadorPagina, 'FAST');
    } else {
      this.doc.setTextColor(colores.amarillo)
      this.doc.addImage("assets/EFE/caution.png", 'PNG', this.margenDer - 165, this.usoPagina + 20, 12, 12, 'caution-1' + this.contadorPagina, 'FAST');
    }
    this.doc.text('Piezómetros', this.margenDer - 150, this.usoPagina + 30, { align: 'left', maxWidth: this.maxMargen });


    if (estados.gcd) {
      this.doc.setTextColor(colores.verde)
      this.doc.addImage("assets/EFE/checkmark.png", 'PNG', this.margenDer - 165, this.usoPagina + 40, 12, 12, 'check-2' + this.contadorPagina, 'FAST');
    } else {
      this.doc.setTextColor(colores.amarillo)
      this.doc.addImage("assets/EFE/caution.png", 'PNG', this.margenDer - 165, this.usoPagina + 40, 12, 12, 'caution-2' + this.contadorPagina, 'FAST');
    }
    this.doc.text('GCD: Geo Centinela Deformación', this.margenDer - 150, this.usoPagina + 50, { align: 'left', maxWidth: this.maxMargen });



    if (estados.gcc) {
      this.doc.setTextColor(colores.verde)
      this.doc.addImage("assets/EFE/checkmark.png", 'PNG', this.margenDer - 165, this.usoPagina + 60, 12, 12, undefined, 'FAST');
    } else {
      this.doc.setTextColor(colores.amarillo)
      this.doc.addImage("assets/EFE/caution.png", 'PNG', this.margenDer - 165, this.usoPagina + 60, 12, 12, undefined, 'FAST');
    }

    this.doc.text('GCC: Geo Centinela Corte', this.margenDer - 150, this.usoPagina + 70, { align: 'left', maxWidth: this.maxMargen });


    if (estados.prismas) {
      this.doc.setTextColor(colores.verde)
      this.doc.addImage("assets/EFE/checkmark.png", 'PNG', this.margenDer - 165, this.usoPagina + 80, 12, 12, 'check-4' + this.contadorPagina, 'FAST');

    } else {
      this.doc.setTextColor(colores.amarillo)
      this.doc.addImage("assets/EFE/caution.png", 'PNG', this.margenDer - 165, this.usoPagina + 80, 12, 12, 'caution-4' + this.contadorPagina, 'FAST');

    }

    this.doc.text('Prismas', this.margenDer - 150, this.usoPagina + 90, { align: 'left', maxWidth: this.maxMargen });

    autoTable(this.doc, {
      theme: 'grid',
      styles: { halign: 'center', fontSize: 7, fillColor: undefined, lineColor: [1, 48, 51] },
      headStyles: { font: 'Lato', fontStyle: 'bold', textColor: [1, 48, 51], fillColor: undefined, lineWidth: .1 },
      head: [['   Operativo', '   Con Observación']],
      margin: { left: this.margenDer - 165 },
      startY: this.usoPagina + 100,
      tableWidth: 170,

      didDrawCell: (data) => {
        let width = data.cell.width
        let height = data.cell.height
        let x = data.cell.x + 5
        let y = data.cell.y + 3
        if (data.column.index == 0) {
          this.doc.addImage("assets/EFE/checkmark.png", 'PNG', x, y, 11, 11, 'check-5' + this.contadorPagina, 'FAST');
        } else {
          this.doc.addImage("assets/EFE/caution.png", 'PNG', x + 6, y, 11, 11, 'caution-5' + this.contadorPagina, 'FAST');
        }
      }
    })


    //Tabla de criterios
    this.doc.setTextColor(colores.negro)
    this.doc.setFontSize(10)
    this.doc.setFont("Lato", "bold");
    this.doc.text('Criterios de Aceptabilidad', this.margenDer - 165, this.usoPagina + 145, { align: 'left', maxWidth: this.maxMargen });

    this.doc.setFont("Lato", "normal");

    this.doc.setLineWidth(0.1);
    this.doc.setFillColor(146, 208, 80);
    this.doc.circle(this.margenDer - 130, this.usoPagina + 165, 5, "FD");
    this.doc.text('Normal', this.margenDer - 119, this.usoPagina + 170, { align: 'left', maxWidth: this.maxMargen });

    this.doc.setFillColor(255, 255, 0);
    this.doc.circle(this.margenDer - 130, this.usoPagina + 185, 5, "FD");
    this.doc.text('Precaución', this.margenDer - 119, this.usoPagina + 190, { align: 'left', maxWidth: this.maxMargen });

    this.doc.setFillColor(228, 108, 10);
    this.doc.circle(this.margenDer - 130, this.usoPagina + 205, 5, "FD");
    this.doc.text('Alerta', this.margenDer - 119, this.usoPagina + 210, { align: 'left', maxWidth: this.maxMargen });

    this.doc.setFillColor(255, 0, 0);
    this.doc.circle(this.margenDer - 130, this.usoPagina + 225, 5, "FD");
    this.doc.text('Alarma', this.margenDer - 119, this.usoPagina + 230, { align: 'left', maxWidth: this.maxMargen });


    //Estado General
    this.doc.setFontSize(10)
    this.doc.setFont("Lato", "bold");
    this.doc.text('Estado General:', this.margenIzq, this.usoPagina + 290, { align: 'left', maxWidth: this.maxMargen });

    this.doc.setFont("Lato", "normal");

    this.usoPagina = this.usoPagina + 310

    this.usoPagina = formateadoraDeTexto(this.doc, estadoGeneral, this.usoPagina, this.margenIzq, this.margenDer, this.date, this.anoMes)

    this.crearNuevaPagina(this.usoPagina + 50)
    //Observaciones
    this.doc.setFontSize(10)
    this.doc.setFont("Lato", "bold");
    this.doc.text('Observaciones:', this.margenIzq, this.usoPagina + 10, { align: 'left', maxWidth: this.maxMargen });
    this.usoPagina += 20
    let page = 1
    autoTable(this.doc, {
      // theme: 'grid',
      styles: { halign: 'left', font: 'Lato', fontStyle: 'normal', fontSize: 10, fillColor: undefined, lineColor: [1, 48, 51], textColor: [1, 48, 51], cellPadding: { bottom: 6 } },
      headStyles: { font: 'Lato', fontStyle: 'bold', fillColor: undefined, lineWidth: .1 },
      body: [['Piezómetros:', observaciones.piezometro], ['GCD:', observaciones.gcd], ['GCC:', observaciones.gcc], ['Prismas:', observaciones.prismas]],
      margin: { left: this.margenIzq, top: this.cominezoContenidoY, bottom: 50 },
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
          page = data.pageNumber
        }
      },

      willDrawPage: (data) => {
        if (page != data.pageNumber) {
          this.usoPagina = this.cominezoContenidoY
          this.doc.addImage("assets/EMT/marcaAgua.jpg", 'JPG', 0, 0, 612, 792, 'marca-x-20', 'FAST');
          this.implementarHeader()
          this.implementarFooter()


        }
      },
    })

    this.crearNuevaPagina(this.usoPagina + 89)

    this.usoPagina += 20
    //Tabla de monitoreo geotecnico
    this.doc.setFontSize(10)
    this.doc.setFont("Lato", "bold");
    this.doc.text('Monitoreo Geotécnico', this.puntoMedio, this.usoPagina, { align: 'center', maxWidth: this.maxMargen });

    autoTable(this.doc, {
      theme: 'grid',
      styles: { halign: 'left', font: 'Lato', fontStyle: 'normal', fontSize: 8, fillColor: undefined, lineColor: [1, 48, 51], textColor: [1, 48, 51] },
      headStyles: { font: 'Lato', fontStyle: 'bold', fillColor: undefined, lineWidth: .1 },
      body: [['Alarmas mes', monitoreo.alarmas], ['Alerta mes', monitoreo.alertas], ['Modo Vigilancia', monitoreo.vigilancia], ['Reporte post sismo ', monitoreo.sismo]],
      margin: { left: this.puntoMedio - (70 + 90) / 2 },
      startY: this.usoPagina + 10,
      columnStyles: { 0: { halign: 'left', cellWidth: 90 }, 1: { halign: 'center', cellWidth: 70 } },
      alternateRowStyles: { fillColor: undefined },
      rowPageBreak: 'avoid',
      didDrawCell: (data) => {
        let width = data.cell.width
        let height = data.cell.height
        let x = data.cell.x + 5
        let y = data.cell.y + 3
        if (data.column.index == 0 && data.row.index == 0) {
          this.doc.setFillColor(255, 0, 0);
          this.doc.circle(x + width - 20, y + 7, 4, "FD");
        }
        if (data.column.index == 0 && data.row.index == 1) {
          this.doc.setFillColor(228, 108, 10);
          this.doc.circle(x + width - 20, y + 7, 4, "FD");
        }
      }
    })

    this.usoPagina += 89
  }

  generarAnalisisDeDatos(arrGCC: any[], arrGCD: any[], arrPiezometro: any[], estaciones: AbstractControl<any, any>) {
    let nEstacion = 6



    data.seccionAnalisis.forEach((seccion, index) => {
      const estacion = estaciones.get('estacion' + nEstacion)
      const obsGenerales = estacion?.get('obsGenerales')?.value
      const obsGCD = estacion?.get('obsGCD')?.value
      const obsGCC = estacion?.get('obsGCC')?.value
      const obsEspecificas = estacion?.get('obsEspecificas')?.value
      const imgAguaAcumulada = estacion?.get('piezometro.imgAguaAcumulada')?.value
      const obsPiezometro = estacion?.get('piezometro.observaciones')?.value




      this.crearNuevaPagina(this.usoPagina + 800)

      this.doc.setFontSize(10)
      this.doc.setFont("Lato", "bold");
      this.doc.text('Análisis de datos estación ' + nEstacion, this.margenIzq, this.usoPagina, { align: 'left', maxWidth: this.maxMargen });
      this.usoPagina += 10
      if (index == 0) {
        this.doc.addImage("assets/EFE/estacion6.png", 'PNG', this.margenIzq, this.usoPagina, 320, 220, undefined, 'FAST');
      }
      if (index == 1) {
        this.doc.addImage("assets/EFE/estacion7.png", 'PNG', this.margenIzq, this.usoPagina, 320, 220, undefined, 'FAST');
      }
      if (index == 2) {
        this.doc.addImage("assets/EFE/estacion8.png", 'PNG', this.margenIzq, this.usoPagina, 320, 220, undefined, 'FAST');
      }

      //Tabla de criterios
      this.doc.setTextColor(colores.negro)
      this.doc.setFontSize(10)
      this.doc.setFont("Lato", "bold");
      this.doc.text('Criterios de Aceptabilidad', this.margenDer - 215, this.usoPagina + 10, { align: 'left', maxWidth: this.maxMargen });
      this.usoPagina += 10

      this.doc.setFont("Lato", "normal");

      this.doc.setLineWidth(0.1);
      this.doc.setFillColor(146, 208, 80);
      this.doc.circle(this.margenDer - 205, this.usoPagina + 20, 5, "FD");
      this.doc.text('Normal', this.margenDer - 194, this.usoPagina + 25, { align: 'left', maxWidth: this.maxMargen });

      this.doc.setFillColor(255, 255, 0);
      this.doc.circle(this.margenDer - 205, this.usoPagina + 40, 5, "FD");
      this.doc.text('Precaución', this.margenDer - 194, this.usoPagina + 45, { align: 'left', maxWidth: this.maxMargen });

      this.doc.setFillColor(228, 108, 10);
      this.doc.circle(this.margenDer - 205, this.usoPagina + 60, 5, "FD");
      this.doc.text('Alerta', this.margenDer - 194, this.usoPagina + 65, { align: 'left', maxWidth: this.maxMargen });

      this.doc.setFillColor(238, 42, 33);
      this.doc.circle(this.margenDer - 205, this.usoPagina + 80, 5, "FD");
      this.doc.text('Alarma', this.margenDer - 194, this.usoPagina + 85, { align: 'left', maxWidth: this.maxMargen });
      this.usoPagina += 80


      //obs generales
      this.doc.setTextColor(colores.negro)
      this.doc.setFontSize(10)
      this.doc.setFont("Lato", "bold");
      this.doc.text('Observaciones generales', this.margenDer - 215, this.usoPagina + 30, { align: 'left', maxWidth: this.maxMargen });
      this.usoPagina += 30

      this.doc.setFontSize(10)
      this.doc.setFont("Lato", "normal");
      this.usoPagina += 20 + formateadoraDeTexto(this.doc, obsGenerales, this.usoPagina + 20, this.margenDer - 215, 215 + this.margenIzq, this.date, this.anoMes)

      //Estado mensual sensores
      this.usoPagina = this.cominezoContenidoY + 230
      this.doc.setFontSize(10)
      this.doc.setFont("Lato", "bold");
      this.doc.text('Estado mensual sensores GCD y GCC', this.margenIzq, this.usoPagina + 30, { align: 'left', maxWidth: this.maxMargen });
      this.usoPagina += 20


      // this.doc.addImage(arrGCC[index], 'PNG', this.margenIzq, this.usoPagina + 20, 229, 220, 'scren' + index, 'FAST');
      this.doc.addImage(arrGCC[index], 'PNG', this.margenIzq, this.usoPagina + 20, 170, 220, 'gccgraph' + index, 'FAST');

      // this.doc.addImage("assets/EFE/Luis.jpg", 'JPG', this.margenDer - 370 + this.margenIzq, this.usoPagina + 20, 368, 220, 'LUIS 4' + this.contadorPagina, 'FAST');
      if (arrGCD.length != 0)
        this.doc.addImage(arrGCD[index], 'PNG', this.margenDer - 370 + this.margenIzq, this.usoPagina + 20, 368, 220, 'gcdgraph' + index, 'FAST');
      this.usoPagina += 20 + 220



      let texto1 = obtenerAncho(this.doc, obsGCD, 188)
      let texto2 = obtenerAncho(this.doc, obsGCC, 188)
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
      this.doc.text('GCC Pozo ' + seccion.pozo + ': ', this.margenIzq + 30, this.usoPagina + 20, { align: 'left', maxWidth: this.maxMargen });
      this.doc.text('GCD Pozo ' + seccion.pozo + ': ', this.margenIzq + 310, this.usoPagina + 20, { align: 'left', maxWidth: this.maxMargen });

      this.doc.setFont("Lato", "normal");
      formateadoraDeTexto(this.doc, obsGCC, this.usoPagina + 20, this.margenIzq + 95, 187, this.date, this.anoMes)
      formateadoraDeTexto(this.doc, obsGCD, this.usoPagina + 20, this.margenIzq + 375, 187, this.date, this.anoMes)
      this.usoPagina += texto1 + 30


      this.doc.setFontSize(10)
      this.doc.setFont("Lato", "normal");
      this.usoPagina = formateadoraDeTexto(this.doc, obsEspecificas, this.usoPagina, this.margenIzq, this.margenDer, this.date, this.anoMes) + 10

      this.crearNuevaPagina(this.usoPagina + 400)

      this.doc.setFontSize(10)
      this.doc.setFont("Lato", "bold");
      this.doc.text('Estado mensual piezómetros', this.margenIzq, this.usoPagina, { align: 'left', maxWidth: this.maxMargen });

      if (imgAguaAcumulada)
        this.doc.addImage(imgAguaAcumulada, 'JPG', this.puntoMedio - (450 / 2), this.usoPagina + 10, 450, 100, 'LUIS 5' + this.contadorPagina, 'FAST');

      this.doc.addImage(arrPiezometro[index], 'PNG', this.puntoMedio - (450 / 2), this.usoPagina + 120, 450, 250, 'piezometro' + this.contadorPagina, 'FAST');
      this.usoPagina += 360

      if (nEstacion == 8) {
        this.doc.setFontSize(10)
        this.doc.setFont("Lato", "bold");
        this.doc.text('Observaciones piezómetro pozo ' + seccion.pozo2, this.margenIzq, this.usoPagina + 35, { align: 'left', maxWidth: this.maxMargen });
        this.usoPagina += 35

      } else {
        this.doc.setFontSize(10)
        this.doc.setFont("Lato", "bold");
        this.doc.text('Observaciones piezómetro pozo ' + seccion.pozo, this.margenIzq, this.usoPagina + 35, { align: 'left', maxWidth: this.maxMargen });
        this.usoPagina += 35
      }

      this.doc.setFontSize(10)
      this.doc.setFont("Lato", "normal");
      this.usoPagina = formateadoraDeTexto(this.doc, obsPiezometro, this.usoPagina + 20, this.margenIzq, this.margenDer, this.date, this.anoMes)
      nEstacion++

    })


  }

  generarAnalisisGeneralPrismas(prismas: AbstractControl<any, any>) {
    const imagenGeneral = prismas.get('imagenGeneral')?.value
    const obsGeneral = prismas.get('obsGeneral')?.value


    this.crearNuevaPagina(800)
    this.doc.setFontSize(12)
    this.doc.setFont("Lato", "bold");
    this.doc.text('Análisis de prismas', this.margenIzq, this.usoPagina, { align: 'left', maxWidth: this.maxMargen });
    this.usoPagina += 12
    let mes1 = new Date(data.ano, data.mes - 2, 1).toLocaleString('default', { month: 'long' });
    let mes2 = new Date(data.ano, data.mes - 1, 1).toLocaleString('default', { month: 'long' });

    this.doc.setFontSize(10)
    this.doc.setFont("Lato", "normal");
    this.doc.text('Período: ' + this.entreFechas, this.margenIzq, this.usoPagina, { align: 'left', maxWidth: this.maxMargen });

    this.usoPagina += 10

    if (imagenGeneral)
      this.doc.addImage(imagenGeneral, 'JPG', this.margenIzq, this.usoPagina, 420, 320, 'LUIS 6' + this.contadorPagina, 'FAST');

    //tabla
    this.doc.setFontSize(10)
    this.doc.setFont("Lato", "bold");
    this.doc.text('Leyenda', this.margenIzq + 502, this.usoPagina + 10, { align: 'center', maxWidth: this.maxMargen });
    this.doc.setFontSize(10)
    this.doc.setFont("Lato", "normal");
    this.doc.text('(mm)', this.margenIzq + 502, this.usoPagina + 20, { align: 'center', maxWidth: this.maxMargen });

    this.doc.setFontSize(10)
    this.doc.setFont("Lato", "normal");
    this.doc.setFillColor(94, 79, 162);
    this.doc.circle(this.margenIzq + 477, this.usoPagina + 40, 5, "FD");
    this.doc.text('100 - 150', this.margenIzq + 488, this.usoPagina + 43, { align: 'left', maxWidth: this.maxMargen });
    this.usoPagina += 40

    this.doc.setFillColor(50, 136, 189);
    this.doc.circle(this.margenIzq + 477, this.usoPagina + 22, 5, "FD");
    this.doc.text('50 - 100', this.margenIzq + 488, this.usoPagina + 25, { align: 'left', maxWidth: this.maxMargen });
    this.usoPagina += 20

    this.doc.setFillColor(102, 194, 165);
    this.doc.circle(this.margenIzq + 477, this.usoPagina + 22, 5, "FD");
    this.doc.text('25 - 50', this.margenIzq + 488, this.usoPagina + 25, { align: 'left', maxWidth: this.maxMargen });
    this.usoPagina += 20

    this.doc.setFillColor(171, 221, 164);
    this.doc.circle(this.margenIzq + 477, this.usoPagina + 22, 5, "FD");
    this.doc.text('5 - 25', this.margenIzq + 488, this.usoPagina + 25, { align: 'left', maxWidth: this.maxMargen });
    this.usoPagina += 20

    this.doc.setFillColor(230, 245, 152);
    this.doc.circle(this.margenIzq + 477, this.usoPagina + 22, 5, "FD");
    this.doc.text('-5 - 5', this.margenIzq + 488, this.usoPagina + 25, { align: 'left', maxWidth: this.maxMargen });
    this.usoPagina += 20

    this.doc.setFillColor(254, 224, 139);
    this.doc.circle(this.margenIzq + 477, this.usoPagina + 22, 5, "FD");
    this.doc.text('-25 - -5', this.margenIzq + 488, this.usoPagina + 25, { align: 'left', maxWidth: this.maxMargen });
    this.usoPagina += 20

    this.doc.setFillColor(253, 174, 97);
    this.doc.circle(this.margenIzq + 477, this.usoPagina + 22, 5, "FD");
    this.doc.text('-50 - -25', this.margenIzq + 488, this.usoPagina + 25, { align: 'left', maxWidth: this.maxMargen });
    this.usoPagina += 20

    this.doc.setFillColor(244, 109, 67);
    this.doc.circle(this.margenIzq + 477, this.usoPagina + 22, 5, "FD");
    this.doc.text('-100 - -50', this.margenIzq + 488, this.usoPagina + 25, { align: 'left', maxWidth: this.maxMargen });
    this.usoPagina += 20

    this.doc.setFillColor(213, 62, 79);
    this.doc.circle(this.margenIzq + 477, this.usoPagina + 22, 5, "FD");
    this.doc.text('-150 - -100', this.margenIzq + 488, this.usoPagina + 25, { align: 'left', maxWidth: this.maxMargen });
    this.usoPagina += 20

    this.doc.setFillColor(158, 1, 66);
    this.doc.circle(this.margenIzq + 477, this.usoPagina + 22, 5, "FD");
    this.doc.text('-200 - -150', this.margenIzq + 488, this.usoPagina + 25, { align: 'left', maxWidth: this.maxMargen });
    this.usoPagina += 20

    let str = 'El desplazamiento es calculado a partir de la distancia inclinada.'
    justify(this.doc, str, this.margenIzq + 430, this.usoPagina + 30, 140)
    this.usoPagina += 115

    //Observaciones generales
    this.doc.setFontSize(10)
    this.doc.setFont("Lato", "bold");
    this.doc.text('Observaciones generales', this.margenIzq, this.usoPagina + 8, { align: 'left', maxWidth: this.maxMargen });

    this.usoPagina = formateadoraDeTexto(this.doc, obsGeneral, this.usoPagina + 28, this.margenIzq, this.margenDer, this.date, this.anoMes)

  }

  generarAnalisisPrismas(arrPrismas: any[], prismas: AbstractControl<any, any>) {

    data.seccionPrismas.analisisPrismas.forEach((elm, index) => {
      const prisma = prismas.get('prismas' + (index + 1))
      const imagenPrismas = prisma?.get('imagen')?.value
      const obsGeneral = prisma?.get('obsGeneral')?.value


      //PRISMAS P04-12
      this.crearNuevaPagina(800)
      this.doc.setFontSize(12)
      this.doc.setFont("Lato", "bold");
      this.doc.text('Análisis de prismas ' + elm.prismas, this.margenIzq, this.usoPagina, { align: 'left', maxWidth: this.maxMargen });
      this.usoPagina += 12
      let mes1 = new Date(data.ano, data.mes - 2, 1).toLocaleString('default', { month: 'long' });
      let mes2 = new Date(data.ano, data.mes - 1, 1).toLocaleString('default', { month: 'long' });

      this.doc.setFontSize(10)
      this.doc.setFont("Lato", "normal");
      this.doc.text('Período: ' + this.entreFechas, this.margenIzq, this.usoPagina, { align: 'left', maxWidth: this.maxMargen });

      this.usoPagina += 10

      if (imagenPrismas)
        this.doc.addImage(imagenPrismas, 'JPG', this.margenIzq, this.usoPagina, 320, 240, 'LUIS 7' + this.contadorPagina, 'FAST');

      //tabla
      this.doc.setFontSize(10)
      this.doc.setFont("Lato", "bold");
      this.doc.text('Leyenda', this.margenIzq + 450, this.usoPagina + 10, { align: 'center', maxWidth: this.maxMargen });
      this.doc.setFontSize(10)
      this.doc.setFont("Lato", "normal");
      this.doc.text('(mm)', this.margenIzq + 450, this.usoPagina + 20, { align: 'center', maxWidth: this.maxMargen });

      this.doc.setFontSize(10)
      this.doc.setFont("Lato", "normal");
      this.doc.setFillColor(94, 79, 162);
      this.doc.circle(this.margenIzq + 425, this.usoPagina + 40, 5, "FD");
      this.doc.text('100 - 150', this.margenIzq + 436, this.usoPagina + 43, { align: 'left', maxWidth: this.maxMargen });
      this.usoPagina += 40

      this.doc.setFillColor(50, 136, 189);
      this.doc.circle(this.margenIzq + 425, this.usoPagina + 22, 5, "FD");
      this.doc.text('50 - 100', this.margenIzq + 436, this.usoPagina + 25, { align: 'left', maxWidth: this.maxMargen });
      this.usoPagina += 20

      this.doc.setFillColor(102, 194, 165);
      this.doc.circle(this.margenIzq + 425, this.usoPagina + 22, 5, "FD");
      this.doc.text('25 - 50', this.margenIzq + 436, this.usoPagina + 25, { align: 'left', maxWidth: this.maxMargen });
      this.usoPagina += 20

      this.doc.setFillColor(171, 221, 164);
      this.doc.circle(this.margenIzq + 425, this.usoPagina + 22, 5, "FD");
      this.doc.text('5 - 25', this.margenIzq + 436, this.usoPagina + 25, { align: 'left', maxWidth: this.maxMargen });
      this.usoPagina += 20

      this.doc.setFillColor(230, 245, 152);
      this.doc.circle(this.margenIzq + 425, this.usoPagina + 22, 5, "FD");
      this.doc.text('-5 - 5', this.margenIzq + 436, this.usoPagina + 25, { align: 'left', maxWidth: this.maxMargen });
      this.usoPagina += 20

      this.doc.setFillColor(254, 224, 139);
      this.doc.circle(this.margenIzq + 425, this.usoPagina + 22, 5, "FD");
      this.doc.text('-25 - -5', this.margenIzq + 436, this.usoPagina + 25, { align: 'left', maxWidth: this.maxMargen });
      this.usoPagina += 20

      this.doc.setFillColor(253, 174, 97);
      this.doc.circle(this.margenIzq + 425, this.usoPagina + 22, 5, "FD");
      this.doc.text('-50 - -25', this.margenIzq + 436, this.usoPagina + 25, { align: 'left', maxWidth: this.maxMargen });
      this.usoPagina += 20

      this.doc.setFillColor(244, 109, 67);
      this.doc.circle(this.margenIzq + 425, this.usoPagina + 22, 5, "FD");
      this.doc.text('-100 - -50', this.margenIzq + 436, this.usoPagina + 25, { align: 'left', maxWidth: this.maxMargen });
      this.usoPagina += 20

      this.doc.setFillColor(213, 62, 79);
      this.doc.circle(this.margenIzq + 425, this.usoPagina + 22, 5, "FD");
      this.doc.text('-150 - -100', this.margenIzq + 436, this.usoPagina + 25, { align: 'left', maxWidth: this.maxMargen });
      this.usoPagina += 20

      this.doc.setFillColor(158, 1, 66);
      this.doc.circle(this.margenIzq + 425, this.usoPagina + 22, 5, "FD");
      this.doc.text('-200 - -150', this.margenIzq + 436, this.usoPagina + 25, { align: 'left', maxWidth: this.maxMargen });
      this.usoPagina += 50

      //segunda img
      this.doc.addImage(arrPrismas[index], 'JPG', this.margenIzq, this.usoPagina, this.margenDer, 240, 'LUIS 8' + this.contadorPagina, 'FAST');
      this.usoPagina += 254


      //Observaciones generales
      this.doc.setFontSize(10)
      this.doc.setFont("Lato", "bold");
      this.doc.text('Observaciones generales', this.margenIzq, this.usoPagina + 10, { align: 'left', maxWidth: this.maxMargen });
      this.usoPagina += 10

      this.usoPagina = formateadoraDeTexto(this.doc, obsGeneral, this.usoPagina + 20, this.margenIzq, this.margenDer, this.date, this.anoMes)
    });
  }

  conclusion(conclusion: any) {
    this.crearNuevaPagina(800)

    this.doc.setFontSize(12)
    this.doc.setFont("Lato", "bold");
    this.doc.text('Conclusiones', this.margenIzq, this.usoPagina, { align: 'left', maxWidth: this.maxMargen });
    this.usoPagina += 20

    this.doc.setFontSize(10)
    this.doc.setFont("Lato", "normal");
    formateadoraDeTexto(this.doc, conclusion.value, this.usoPagina, this.margenIzq, this.margenDer, this.date, this.anoMes)


  }

  generarTablaResumen(inputs: AbstractControl<any, any>) {
    let gestores = inputs.get('gestores')
    this.doc.addPage()
    this.doc.addImage("assets/EMT/marcaAgua.jpg", 'JPG', 0, 0, 612, 792, 'marca-x2', 'FAST');
    this.doc.addImage("assets/EMT/logo.png", 'PNG', this.margenIzq, this.comienzoPaginaY, 160, 60, 'logo-x2', 'FAST');

    let altura = 246
    let margenIzq = this.margenIzq + 72
    this.doc.setTextColor(colores.azul)
    this.doc.setFont("Montserrat", "bold");
    this.doc.setFontSize(22)
    this.doc.text(data.titulo + this.numeroInforme, this.puntoMedio, altura, { align: 'center' });

    this.doc.setTextColor(colores.negro)
    this.doc.setFontSize(16)
    this.doc.setFont("Lato", "normal");
    this.doc.text(data.subTiutlo, this.puntoMedio, altura + 30, { align: 'center', maxWidth: this.maxMargen });

    altura += obtenerAncho(this.doc, data.subTiutlo, this.maxMargen);
    this.doc.setTextColor(colores.azul)
    this.doc.setFontSize(12)
    this.doc.text(this.date, margenIzq + 320, altura + 154, { align: 'left' });



    let nombre1 = gestores?.get('elaborado')?.value
    let cargo1 = gestores?.get('cargo1')?.value
    let nombre2 = gestores?.get('revisado')?.value
    let cargo2 = gestores?.get('cargo2')?.value
    let nombre3 = gestores?.get('aprobado')?.value
    let cargo3 = gestores?.get('cargo3')?.value



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

  implementarPortada(datos: AbstractControl<any, any>) {

    let altura = 246
    let margenIzq = this.margenIzq + 72
    this.doc.addImage("assets/EMT/portada.jpg", 'JPG', 0, 0, 612, 792, 'marca-1', 'FAST');
    this.doc.setTextColor(colores.blanco)
    this.doc.setFont("Montserrat", "bold");
    this.doc.setFontSize(22)
    this.doc.text(data.titulo + datos.get('numeroInforme')?.value, this.puntoMedio, altura, { align: 'center' });

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
    this.doc.text(this.date, margenIzq + 320, altura + 154, { align: 'left' });
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
    this.doc.addImage("assets/EMT/logo.png", 'PNG', this.margenDer - 60, this.comienzoPaginaY - 10, 90, 40, 'logo' + this.contadorPagina, 'FAST');

    this.doc.setFontSize(9)
    this.doc.setFont('Lato', 'normal')
    this.doc.text('IYV-INF-VIG-EFE-02', this.margenDer + 28, this.comienzoPaginaY + 40, { align: 'right' })
    this.doc.addImage("assets/EFE/logoefe.png", 'PNG', this.margenIzq, this.comienzoPaginaY - 15, 90, 50, 'logoEfe' + this.contadorPagina, 'FAST')
    this.doc.text(this.anoMes, this.margenIzq + 25, this.comienzoPaginaY + 40, { align: 'left' })

    this.doc.setFontSize(13)
    this.doc.setFont('Lato', 'normal')
    this.doc.text('INFORME MENSUAL DE ANÁLISIS DE TENDENCIAS DE COMPORTAMIENTO DE LA INFRAESTRUCTURA', this.puntoMedio, this.comienzoPaginaY + 12, { align: 'center', maxWidth: this.puntoMedio + 20 })
    this.doc.setFontSize(11)
    this.doc.text(this.date, this.puntoMedio, this.comienzoPaginaY + 40, { align: 'center' })
  }

  implementarFuentes() {
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

  nuevaPagina() {
    this.usoPagina = this.cominezoContenidoY
    this.doc.addPage()
    this.doc.addImage("assets/EMT/marcaAgua.jpg", 'JPG', 0, 0, 612, 792, 'marca-x3' + Math.random(), 'FAST');
    this.implementarHeader()
    this.implementarFooter()
  }

  crearNuevaPagina(uso: number) {
    if (uso + 10 > this.finalPagina - 15) {
      this.nuevaPagina()
    }
  }


  completarDatos(inputs: FormGroup) {
    
    let fecha =  new Date( inputs.get('datos.fechaFinal')?.value)
    let fechaInicio = new Date (inputs.get('datos.fechaInicio')?.value)
    // let mesNum = fecha?.value.getMonth() + 1
    let mes = fecha.toLocaleString('default', { month: 'long' });
    let mesInicio = fechaInicio.toLocaleString('default', { month: 'long' });
    let ano = fecha.getFullYear()
    let anoInicio = fechaInicio.getFullYear()
    this.date = mes.charAt(0).toUpperCase() + mes.slice(1) + ' ' + ano;
    this.numeroInforme = inputs.get('datos.numeroInforme')?.value
    this.anoMes = ano + '.' + ('0' + this.numeroInforme).slice(-2)
    this.entreFechas = (fechaInicio.getDate() +1) +' de ' + mesInicio + ' de ' + anoInicio + ' a ' + (fecha.getDate()+1) + ' de ' + mes + ' de ' + ano

  }

  crearInforme(inputs: FormGroup, arrGCC: any[], arrGCD: any[], gcdElements: QueryList<ElementRef>, arrPrismas: any[], arrPiezometro: any[]) {

    this.completarDatos(inputs)
    this.implementarFuentes()
    this.implementarPortada(inputs.controls['datos'])
    this.generarTablaResumen(inputs)
    this.generarSeccion1(inputs.controls['estaciones'])
    this.generarAnalisisDeDatos(arrGCC, arrGCD, arrPiezometro, inputs.controls['estaciones'])
    this.generarAnalisisGeneralPrismas(inputs.controls['prismas'])
    this.generarAnalisisPrismas(arrPrismas, inputs.controls['prismas'])
    this.conclusion(inputs.controls['conclusion'])
  }

  generarInforme(inputs: FormGroup, arrGCC: any[], arrGCD: any[], gcdElements: QueryList<ElementRef>, arrPrismas: any[], arrPiezometro: any[]) {
    this.crearInforme(inputs, arrGCC, arrGCD, gcdElements, arrPrismas, arrPiezometro)
    this.doc.setProperties({ title: 'INFORME_EFE' })
    // this.doc.output('pdfobjectnewwindow', { filename: 'REPORTE_MENSUAL_' + this.mes.toUpperCase() + '_' + data.ano })
    this.doc.save('TESTING_REPORTE_MENSUAL_' + data.numReporte + '_' + this.date)
    this.doc = new jsPDF('p', 'pt', 'letter')

  }

  subirInforme(inputs: FormGroup, arrGCC: any[], arrGCD: any[], gcdElements: QueryList<ElementRef>, arrPrismas: any[], arrPiezometro: any[]) {
    let dataForm = new FormData()
    this.crearInforme(inputs, arrGCC, arrGCD, gcdElements, arrPrismas, arrPiezometro)
    this.doc.setProperties({ title: 'REPORTE EFE' })
    var blob = this.doc.output('blob')
    dataForm.append('file', blob, 'REPORTE_MENSUAL_' + data.numReporte)
    dataForm.append('fecha', this.date)
    // this.api.sendPDF(dataForm)
    //descomentar cuando este todo claro
    this.doc = new jsPDF('p', 'pt', 'letter')
    this.usoPagina = this.cominezoContenidoY
  }


}
