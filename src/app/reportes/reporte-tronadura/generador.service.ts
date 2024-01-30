import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { jsPDF } from 'jspdf'
import { latoBold, latoRegular, montBold, montMedium, montSemi } from 'src/assets/fonts/fonts';
import autoTable from 'jspdf-autotable';

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


  private informacionTronadura(dataTabla: any) {

    let body : any[] = []
    let header : any[] = []

    if(dataTabla.produccion){
      body.push(dataTabla.pozosProduccion)
      header.push('Prodcucción')
    }
    if(dataTabla.precorte){
      body.push(dataTabla.pozosPrecorte)
      header.push('Precorte')
    }
    if(dataTabla.destape){
      header.push('Destape')
    }
    if(dataTabla.bolones){
      header.push('bolones')
    }
    if(dataTabla.desquinche){
      header.push('desquinche')
    }
    if(dataTabla.contorno){
      header.push('contorno')
    }
    if(dataTabla.volumen > 0){
      header.push('volumen')
      body.push(dataTabla.volumen)
    }
    if(dataTabla.factorCarga > 0){
      header.push('Factor de Carga')
      body.push(dataTabla.volumen)
    }
    

    // { produccion, precorte, destape, bolones, desquinche, contorno, pozosPrecorte, pozosProduccion, volumen, factorCarga }

    autoTable(this.doc, {
      theme: 'grid',
      styles: { halign: 'center', font: 'Lato', fontStyle: 'normal', fontSize: 10, fillColor: undefined, lineColor: [1, 48, 51], textColor: [1, 48, 51], cellPadding: 2},
      headStyles: { font: 'Lato', fontStyle: 'bold', fillColor: undefined},
      head: [header],
      body: [body],
      startY: this.usoPagina,
      alternateRowStyles: { fillColor: undefined },
      rowPageBreak: 'avoid',

      willDrawCell: (data) => {

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

  private formateoDeDatos(inputs: FormGroup) {
    let fechaCompleta = new Date(inputs.get('fecha')?.value)
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

    //---------------------------

    let fecha = fechaCompleta.toLocaleString('es-ES', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' hrs.'
    const arr = [...fecha];
    arr[0] = arr[0].toUpperCase();
    arr[14] = arr[14].toUpperCase();
    fecha = arr.join('')

    let subTitulo
    if(pared == ''){
      subTitulo = `TRONADURA ${zona.toUpperCase()} - COORDENADAS: ${este} | ${norte} | ${cota}`
    }else{
      subTitulo = `TRONADURA ${zona.toUpperCase()}${pared.toUpperCase()} - COORDENADAS: ${este} | ${norte} | ${cota}`
      
    }
    let codigoInforme = fechaCompleta.getFullYear() + '.2'
    let tablaTipoTronadura = { produccion, precorte, destape, bolones, desquinche, contorno, pozosPrecorte, pozosProduccion, volumen, factorCarga }

    return {
      fecha,
      subTitulo,
      codigoInforme,
      tablaTipoTronadura
    }
  }

  private implementarContenidoPDF(inputs: FormGroup) {
    const {
      fecha,
      subTitulo,
      codigoInforme,
      tablaTipoTronadura
    } = this.formateoDeDatos(inputs)

    this.implementarFuentes()
    this.generarHeader(fecha, subTitulo, codigoInforme)
    this.generarFooter(codigoInforme, 'Daniel Z.')
    this.informacionTronadura(tablaTipoTronadura)

  }

  public previzualizarPDF(inputs: FormGroup) {
    this.implementarContenidoPDF(inputs)
    this.doc.output('dataurlnewwindow')
  }


}
