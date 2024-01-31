import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { jsPDF } from 'jspdf'
import { latoBold, latoRegular, montBold, montMedium, montSemi } from 'src/assets/fonts/fonts';
import autoTable, { Column, Table } from 'jspdf-autotable';
import { formateadoraDeTexto } from './data';
import { image } from 'html2canvas/dist/types/css/types/image';

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
  private contadorFig = 1
  private contadorTabla = 1

  //campos globales
  private fecha: string = ''
  private nombre: string = ''
  private subtitulo: string = ''
  private codigoInforme: string = ''


  private informacionTronadura(dataTabla: any) {

    let body: any[] = []
    let header: any[] = []

    if (dataTabla.produccion) {
      body.push(dataTabla.pozosProduccion + ' Pozos')
      header.push('Prodcucción')
    }
    if (dataTabla.precorte) {
      body.push(dataTabla.pozosPrecorte + ' Pozos')
      header.push('Precorte')
    }
    if (dataTabla.destape) {
      header.push('Destape')
      body.push('')
    }
    if (dataTabla.bolones) {
      header.push('Bolones')
      body.push('')
    }
    if (dataTabla.desquinche) {
      header.push('Desquinche')
      body.push('')
    }
    if (dataTabla.contorno) {
      header.push('Contorno')
      body.push('')
    }
    if (dataTabla.volumen > 0) {
      header.push('Volumen')
      body.push(dataTabla.volumen + ' Kton')
    }
    if (dataTabla.factorCarga > 0) {
      header.push('Factor de Carga')
      body.push(dataTabla.factorCarga)
    }


    // { produccion, precorte, destape, bolones, desquinche, contorno, pozosPrecorte, pozosProduccion, volumen, factorCarga }
    this.doc.setFontSize(14)
    this.doc.setFont("Lato", "bold");
    this.doc.text('INFORMACIÓN TRONADURA', this.margenIzq, this.usoPagina, { align: 'left' })
    this.usoPagina += 25





    if (header.length > 1) {

      this.doc.setFontSize(8)
      this.doc.setFont("Lato", "normal");
      this.doc.text(`Tabla ${this.contadorTabla}: Tipo de Tronadura`, this.puntoMedio, this.usoPagina, { align: 'center' })
      this.contadorTabla++
      this.usoPagina += 5

      autoTable(this.doc, {
        theme: 'grid',
        styles: { halign: 'center', font: 'Lato', fontStyle: 'normal', fontSize: 8, fillColor: undefined, lineColor: [1, 48, 51], textColor: [1, 48, 51], cellWidth: 80, lineWidth: .1 },
        headStyles: { font: 'Lato', fontStyle: 'bold', fillColor: undefined },
        head: [header],
        body: [body],
        margin: { left: (this.puntoMedio - (header.length * 80) / 2) },
        startY: this.usoPagina,
        alternateRowStyles: { fillColor: undefined },
        rowPageBreak: 'avoid',

        willDrawCell: (data) => {
          // if(data.cell.text[0] == "Destape")
          if (data.cell.text[0] == '') {
            this.doc.addImage('./assets/Tronadura/check.png', 'PNG', data.cell.x + 35, data.cell.y + (data.cell.height / 2) - 5, 10, 10, 'check-mark', 'FAST')
          }
        }
      })

      this.usoPagina += 70
    } else {
      this.usoPagina += 20
    }

  }

  private implementarObs(obs: string) {

    this.doc.setFontSize(14)
    this.doc.setFont("Lato", "bold");
    this.doc.text('OBSERVACIONES', this.margenIzq, this.usoPagina, { align: 'left' })
    this.usoPagina += 20

    this.doc.setFontSize(10)
    this.doc.setFont("Lato", "normal");
    let noObs = 'Sin observaciones.'
    this.usoPagina = formateadoraDeTexto(this.doc, obs.length > 2 ? obs : noObs, this.usoPagina, this.margenIzq, this.margenDer - this.margenIzq) + 20

  }

  private implementarPuntosDeControl(arr: any[]) {
    this.nuevaPagina(300)
    this.doc.setFontSize(14)
    this.doc.setFont("Lato", "bold");
    this.doc.text('PUNTOS DE CONTROL SECTOR TRONADURA', this.margenIzq, this.usoPagina, { align: 'left' })
    this.usoPagina += 25

    if (arr.length == 0) {
      this.nuevaPagina(40)
      this.doc.setFontSize(10)
      this.doc.setFont("Lato", "normal");
      this.doc.text('Sin puntos de control registrados.', this.margenIzq, this.usoPagina, { align: 'left' })
      this.usoPagina += 30
    } else {

      arr.forEach(data => {
        this.nuevaPagina(300)
        this.doc.addImage(data.img, 'PNG', this.puntoMedio - 165, this.usoPagina, 320, 260, `imagen-${data.id}`, 'FAST')


        this.contadorFig++
        this.usoPagina += 270
        this.doc.setFontSize(8)
        this.doc.setFont("Lato", "normal");
        this.doc.text(`Figura ${this.contadorFig}: Gráfico de desplazamientos Vs. tiempo`, this.puntoMedio, this.usoPagina, { align: 'center' })
        this.doc.setFontSize(10)
        this.doc.setFont("Lato", "normal");
        this.usoPagina += 30
        // this.nuevaPagina(300)

        if (data.radares.length > 0) {
          let body: any[] = []
          data.radares.forEach((element: any) => {
            let arr = [element.radar, element.este, element.norte, element.cota, element.desplazamiento + ' mm', element.velocidad + ' mm/h']
            body.push(arr)
          });

          this.doc.setFontSize(8)
          this.doc.setFont("Lato", "normal");
          this.doc.text(`Tabla ${this.contadorTabla}: Puntos de Control Sector Tronadura`, this.puntoMedio, this.usoPagina, { align: 'center' })
          this.doc.setFontSize(10)
          this.doc.setFont("Lato", "normal");
          this.usoPagina += 5
          this.contadorTabla++

          autoTable(this.doc, {
            theme: 'grid',
            styles: { halign: 'center', font: 'Lato', fontStyle: 'normal', fontSize: 8, fillColor: undefined, lineColor: [1, 48, 51], textColor: [1, 48, 51], lineWidth: .1 },
            headStyles: { font: 'Lato', fontStyle: 'bold', fillColor: undefined, cellPadding: 1 },
            head: [['Radar', 'Este', 'Norte', 'Cota', 'Desplazamiento [12 hrs.]', 'Velocidad [12 hrs.]']],
            bodyStyles: { cellPadding: 1 },
            body: body,
            // margin: { left: this.puntoMedio - 265 },
            // tableWidth: 530,
            startY: this.usoPagina,
            alternateRowStyles: { fillColor: undefined },
            rowPageBreak: 'avoid',
            didDrawPage: (data) => {
              if (data.table.pageCount != 1)
                this.usoPagina = this.margenContenido
            },
            didDrawCell: (data) => {
              if (data.column.index == 0) {
                this.usoPagina += data.row.height
              }
            }
          })
          this.usoPagina += 30

        }
      })
      this.usoPagina += 30
    }
  }

  private implementearImagenes(imagenes: any[]) {

    this.nuevaPagina(250)
    this.doc.setFontSize(14)
    this.doc.setFont("Lato", "bold");
    this.doc.text('IMÁGENES', this.margenIzq, this.usoPagina, { align: 'left' })
    this.usoPagina += 20
    imagenes.forEach((data, index) => {
      this.nuevaPagina(200)
      if (data.img && index % 2 == 0) {

        this.doc.addImage(data.img, 'PNG', this.margenIzq, this.usoPagina, 250, 200, 'img' + index, 'FAST')

        this.doc.setFontSize(8)
        this.doc.setFont("Lato", "normal");
        this.doc.text(`Figura ${this.contadorFig}: ${data.nombre}`, this.margenIzq + 125, this.usoPagina + 210, { align: 'center' })
        this.doc.setFontSize(10)
        this.doc.setFont("Lato", "normal");
        this.contadorFig++
        if (!imagenes[index + 1].img) {
          this.usoPagina += 235
        }
      } else {

        if (data.img && index % 2 != 0) {
          this.doc.addImage(data.img, 'PNG', this.margenDer - 250, this.usoPagina, 250, 200, 'img' + index, 'FAST')
          this.doc.setFontSize(8)
          this.doc.setFont("Lato", "normal");
          this.doc.text(`Figura ${this.contadorFig}: ${data.nombre}`, this.margenDer - 125, this.usoPagina + 210, { align: 'center' })
          this.doc.setFontSize(10)
          this.doc.setFont("Lato", "normal");
          this.contadorFig++
          this.usoPagina += 235
        }
      }
    })


  }

  private generarHeader(fecha: string, subTitulo: string, codigoInforme: string) {

    this.doc.setFontSize(16)
    this.doc.setFont("Lato", "normal");
    this.doc.text('INFORME TRONADURA', this.puntoMedio, 50, { align: 'center' })
    this.doc.setFontSize(12)
    this.doc.setFont("Lato", "normal");
    this.doc.text(subTitulo, this.puntoMedio, 65, { align: 'center' })
    this.doc.text(codigoInforme, this.margenIzq, 80, { align: 'left' })
    this.doc.text(fecha, this.puntoMedio, 80, { align: 'center' })
    this.doc.text('IYV-IF-VIG-MLP-02', this.margenDer, 80, { align: 'right' })
    this.doc.line(this.margenIzq, 82, this.margenDer, 82)

    this.doc.addImage('assets/EMT/logo.png', 'PNG', 486, 20, 90, 40, 'LOGO_EMT', 'FAST')

  }

  private generarFooter(codigoInforme: string, nombre: string) {
    this.doc.setFontSize(10)
    this.doc.setFont("Lato", "normal");
    let numPag = this.doc.getNumberOfPages()
    this.doc.text(nombre, this.margenIzq, 780, { align: 'left' })
    this.doc.text(codigoInforme, this.margenDer, 780, { align: 'right' })
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

  private nuevaPagina(usoEstimado: number) {
    if (this.usoPagina + usoEstimado > 760) {
      this.doc.addPage()
      this.usoPagina = this.margenContenido
      this.generarHeader(this.fecha, this.subtitulo, this.codigoInforme)
      this.generarFooter(this.codigoInforme, this.nombre)
    }
  }

  private formateoDeDatos(inputs: FormGroup) {
    let fechaCompleta = new Date(inputs.get('fecha')?.value)
    let obs = inputs.get('comentarios')?.value
    let zona = inputs.get('zonaMonitoreo')?.value
    let pared = inputs.get('pared')?.value
    let este = inputs.get('este')?.value
    let norte = inputs.get('norte')?.value
    let cota = inputs.get('cota')?.value
    let produccion = inputs.get('produccion')?.value
    let precorte = inputs.get('precorte')?.value
    let destape = inputs.get('destape')?.value
    let bolones = inputs.get('bolones')?.value
    let desquinche = inputs.get('desquinche')?.value
    let contorno = inputs.get('contorno')?.value
    let pozosProduccion = inputs.get('pozosProduccion')?.value
    let pozosPrecorte = inputs.get('pozosPrecorte')?.value
    let volumen = inputs.get('volumen')?.value
    let factorCarga = inputs.get('factorCarga')?.value
    let graficosDVT = inputs.get('graficosDVT')?.value
    let aPanoramica = inputs.get('aPanoramica')?.value
    let dPanoramica = inputs.get('dPanoramica')?.value
    let aZoom = inputs.get('aZoom')?.value
    let dZoom = inputs.get('dZoom')?.value
    let aSuperior = inputs.get('aSuperior')?.value
    let dSuperior = inputs.get('dSuperior')?.value
    let aInferior = inputs.get('aInferior')?.value
    let dInferior = inputs.get('dInferior')?.value

    //---------------------------

    // Formateo de fecha 
    let fecha = fechaCompleta.toLocaleString('es-ES', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' hrs.'
    let str = fecha.split(' ')
    let arr = [...str[0]];
    arr[0] = arr[0].toUpperCase();
    str[0] = arr.join('')

    arr = [...str[3]];
    arr[0] = arr[0].toUpperCase();
    str[3] = arr.join('')

    let format: string = ''
    str.forEach((s, index) => {
      if (index == 0) {
        format = s
      } else {
        format += ' ' + s
      }
    })
    fecha = format
    //---------------------

    let subTitulo
    if (pared == '') {
      subTitulo = `TRONADURA ${zona.toUpperCase()} - COORDENADAS: ${este} | ${norte} | ${cota}`
    } else {
      subTitulo = `TRONADURA ${zona.toUpperCase()}${pared.toUpperCase()} - COORDENADAS: ${este} | ${norte} | ${cota}`

    }
    let codigoInforme = fechaCompleta.getFullYear() + '.2'
    let tablaTipoTronadura = { produccion, precorte, destape, bolones, desquinche, contorno, pozosPrecorte, pozosProduccion, volumen, factorCarga }

    let imagenes: any[] = []
    imagenes.push({ nombre: 'Antes Panorámica', img: aPanoramica })
    imagenes.push({ nombre: 'Después Panorámica', img: dPanoramica })
    imagenes.push({ nombre: 'Antes Zoom', img: aZoom })
    imagenes.push({ nombre: 'Después Zoom', img: dZoom })
    imagenes.push({ nombre: 'Antes Superior', img: aSuperior })
    imagenes.push({ nombre: 'Después Superior', img: dSuperior })
    imagenes.push({ nombre: 'Antes Inferior', img: aInferior })
    imagenes.push({ nombre: 'Después Inferior', img: dInferior })


    //---Set de var globales

    this.fecha = fecha
    this.nombre = 'Daniel Z.'
    this.codigoInforme = codigoInforme
    this.subtitulo = subTitulo

    //---retornamos la data que necesitamos

    return {
      fecha,
      subTitulo,
      codigoInforme,
      tablaTipoTronadura,
      obs,
      graficosDVT,
      imagenes
    }
  }

  private implementarContenidoPDF(inputs: FormGroup) {
    const {
      fecha,
      subTitulo,
      codigoInforme,
      tablaTipoTronadura,
      obs,
      graficosDVT,
      imagenes
    } = this.formateoDeDatos(inputs)

    this.implementarFuentes()
    this.generarHeader(fecha, subTitulo, codigoInforme)
    this.generarFooter(codigoInforme, 'Daniel Z.')
    this.informacionTronadura(tablaTipoTronadura)
    this.implementarObs(obs)
    this.implementarPuntosDeControl(graficosDVT)
    this.implementearImagenes(imagenes)

  }

  public previsualizarPDF(inputs: FormGroup) {
    this.implementarContenidoPDF(inputs)
    setTimeout(() => {
      // this.doc.output('dataurlnewwindow')
      // var blob = this.doc.output("blob");
      // window.open(URL.createObjectURL(blob));
      // this.doc = new jsPDF('p', 'pt', 'letter')
      this.doc.save('prueba')

    }, 500);



  }


}
