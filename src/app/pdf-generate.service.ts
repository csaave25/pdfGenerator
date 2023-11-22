import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf'
import { radares } from './dataPrueba';
import { font, latoRegular } from 'src/assets/fonts/fonts';

@Injectable({
  providedIn: 'root'
})
export class PdfGenerateService  {

  constructor() { }


  rds = radares

  startY = 10
  endY = 810
  left = 30
  right = 570
  midPointX = (this.right + this.left) / 2
  midPointY = (this.startY + this.endY) / 2
  totalY = this.endY - this.startY
  numFigura = 1
  contadorPagina = 1
  usoPage = 0
  doc = new jsPDF('p', 'pt', 'A4')

  generateNewPage(espacio: number) {
    let zona = ''
    let este = 22
    let norte = 22
    let cota = 22
    let fecha = new Date().toLocaleString()
    let espacioUtilizable = (this.totalY - this.usoPage - 20)
    if (espacioUtilizable < espacio) {
      this.doc.addPage()
      this.generateHeader(zona, este, norte, cota, fecha)
      this.generateFooter()
    }
  }


  generateHeader(zona: string, este: number, norte: number, cota: number, fecha: string) {
    this.doc.addImage("assets/images/marca.jpg", 'JPG', 0, 0, 600, 842, 'marca2', 'SLOW');
    this.doc.setTextColor('#013033')
    this.doc.setFontSize(13)
    this.doc.text("REPORTE PUNTOS DE SEGUIMIENTO POST TRONADURA", this.midPointX, 40, { align: 'center' });
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(11)
    this.doc.text("TRONADURA " + zona.toUpperCase() + " - COORDENADAS: " + este + " | " + norte + " | " + cota, this.midPointX, 55, { align: 'center' });
    this.doc.text(fecha, this.midPointX, 70, { align: 'center' });
    this.doc.setFont("helvetica", "bold")
    this.doc.text("2023.12", this.left, 80, { align: 'left' });
    this.doc.text("IYV-RP-VIG-CMZ-04", this.right, 80, { align: 'right' });
    this.doc.line(this.left, 85, this.right, 85);
    this.usoPage = 110

  }

  generateFooter() {
    //E-Mining Technology S.A.  •  Calle Limache 3405, Oficina 21, Viña del Mar  •  Teléfono: +56 32 2187440  •  eminingtech.com

    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text(this.contadorPagina.toString(), this.midPointX, this.endY - 20, { align: 'center' });
    this.doc.setFont('helvetica', 'bold')
    this.doc.text("Néstor Ramírez Muena", 30, this.endY - 20, { align: 'left' });
    this.doc.text("2023.12", 570, this.endY - 20, { align: 'right' });

    //template emt
    this.doc.setFontSize(8)
    let calc = (this.right + this.left) / 6
    this.doc.setFont("helvetica", 'bold')
    this.doc.text('E-Mining Technology S.A.', this.left, this.endY, { align: 'left' });
    this.doc.text('•', this.left + 115, this.endY, { align: 'left' });
    this.doc.setFont("helvetica", 'normal')
    this.doc.text('Calle Limache 3405, Oficina 21, Viña del Mar', this.left + 135, this.endY, { align: 'left' });
    this.doc.setFont("helvetica", 'bold')
    this.doc.text('•', this.left + 314, this.endY, { align: 'left' });
    this.doc.setFont("helvetica", 'normal')
    this.doc.text('Teléfono: +56 32 2187440', this.left + 336, this.endY, { align: 'left' });
    this.doc.setFont("helvetica", 'bold')
    this.doc.text('•', this.left + 455, this.endY, { align: 'right' });
    this.doc.text('eminingtech.com', this.right, this.endY, { align: 'right' });


    this.contadorPagina++
  }

  planoDeUbicacion() {
    this.doc.setFontSize(12)
    this.doc.setFont("helvetica", "bold");
    this.doc.text("PLANO DE UBICACIÓN", this.left, 110, { align: 'left' });
    this.doc.addImage("assets/img1.png", "PNG", this.left + 100, 130, 340, 360, "alias1", 'SLOW');
    this.doc.setFontSize(8)
    this.doc.setFont("helvetica", "normal");

    //aumneto num figura
    this.doc.text("Figura " + this.numFigura + ": Posición de tronadura e instrumentación", this.midPointX, 500, { align: 'center' });
    this.numFigura++

    this.usoPage += 430
  }

  informacionTronadura(produccion: boolean, precorte: boolean, destape: boolean, bolones: boolean, desquinche: boolean, contorno: boolean,
    pozosProduccion: number, pozosPrecorte: number, nMallas: number, volumen: number, factorCarga: number) {

    this.doc.setFontSize(12)
    this.doc.setFont("helvetica", "bold");
    this.doc.text("INFORMACIÓN TRONADURA", 30, this.usoPage, { align: 'left' });
    this.doc.line(this.left, this.usoPage + 20, this.right, this.usoPage + 20);
    this.doc.setFontSize(10)
    let calc = (this.right + this.left) / 7
    this.doc.text("Producción", calc, this.usoPage + 35, { align: 'center' });
    this.doc.text("Precorte", calc * 2, this.usoPage + 35, { align: 'center' });
    this.doc.text("Destape", calc * 3, this.usoPage + 35, { align: 'center' });
    this.doc.text("Bolones", calc * 4, this.usoPage + 35, { align: 'center' });
    this.doc.text("Desquinche", calc * 5, this.usoPage + 35, { align: 'center' });
    this.doc.text("Contorno", calc * 6, this.usoPage + 35, { align: 'center' });
    let tamañoImg = 7
    let alturaY = this.usoPage + 50

    produccion ? this.doc.addImage("../../assets/check.png", 'PNG', calc - 5, alturaY, tamañoImg, tamañoImg, 'icon1', 'SLOW') : this.doc.addImage("../../assets/ximg.png", 'PNG', calc - 5, alturaY, tamañoImg, tamañoImg, 'icon1', 'SLOW');
    precorte ? this.doc.addImage("../../assets/check.png", 'PNG', calc * 2 - 5, alturaY, tamañoImg, tamañoImg, 'icon2', 'SLOW') : this.doc.addImage("../../assets/ximg.png", 'PNG', calc * 2 - 5, alturaY, tamañoImg, tamañoImg, 'icon2', 'SLOW');
    destape ? this.doc.addImage("../../assets/check.png", 'PNG', calc * 3 - 5, alturaY, tamañoImg, tamañoImg, 'icon3', 'SLOW') : this.doc.addImage("../../assets/ximg.png", 'PNG', calc * 3 - 5, alturaY, tamañoImg, tamañoImg, 'icon3', 'SLOW');
    bolones ? this.doc.addImage("../../assets/check.png", 'PNG', calc * 4 - 5, alturaY, tamañoImg, tamañoImg, 'icon4', 'SLOW') : this.doc.addImage("../../assets/ximg.png", 'PNG', calc * 4 - 5, alturaY, tamañoImg, tamañoImg, 'icon4', 'SLOW');
    desquinche ? this.doc.addImage("../../assets/check.png", 'PNG', calc * 5 - 5, alturaY, tamañoImg, tamañoImg, 'icon5', 'SLOW') : this.doc.addImage("../../assets/ximg.png", 'PNG', calc * 5 - 5, alturaY, tamañoImg, tamañoImg, 'icon5', 'SLOW');
    contorno ? this.doc.addImage("../../assets/check.png", 'PNG', calc * 6 - 5, alturaY, tamañoImg, tamañoImg, 'icon6', 'SLOW') : this.doc.addImage("../../assets/ximg.png", 'PNG', calc * 6 - 5, alturaY, tamañoImg, tamañoImg, 'icon6', 'SLOW');


    this.doc.line(this.left, alturaY + 20, this.right, alturaY + 20);
    calc = (this.right + this.left) / 4
    this.doc.text("N° Pozos Producción: ", calc, alturaY + 40, { align: 'center' });
    this.doc.setFont("helvetica", "normal");
    this.doc.text(pozosProduccion.toString(), calc + 65, alturaY + 40, { align: 'center' });
    this.doc.setFont("helvetica", "bold");
    this.doc.text("N° Pozos Precorte: ", calc * 2, alturaY + 40, { align: 'center' });
    this.doc.setFont("helvetica", "normal");
    this.doc.text(pozosPrecorte.toString(), calc * 2 + 57, alturaY + 40, { align: 'center' });
    this.doc.setFont("helvetica", "bold");
    this.doc.text("N° de Mallas: ", calc * 3, alturaY + 40, { align: 'center' });
    this.doc.setFont("helvetica", "normal");
    this.doc.text(nMallas.toString(), calc * 3 + 43, alturaY + 40, { align: 'center' });
    calc = (this.right + this.left) / 3
    this.doc.setFont("helvetica", "bold");
    this.doc.line(this.left, alturaY + 55, this.right, alturaY + 55);
    this.doc.text("Volumen (Kton):", calc, alturaY + 75, { align: 'center' });
    this.doc.setFont("helvetica", "normal");
    this.doc.text(volumen.toString(), calc + 50, alturaY + 75, { align: 'center' });
    this.doc.setFont("helvetica", "bold");
    this.doc.text("Factor de Carga General: ", calc * 2, alturaY + 75, { align: 'center' });
    this.doc.setFont("helvetica", "normal");
    this.doc.text(factorCarga.toString(), calc * 2 + 70, alturaY + 75, { align: 'center' });

    this.usoPage = alturaY + 95

  }

  controlSector(radar: string, descripcionPunto: number, radarEste: number, radarNorte: number, radarCota: number, deplazamiento4horas: number, velocidadPromedio: number) {
    this.usoPage += 20
    this.generateNewPage(220)
    this.doc.setFontSize(12)
    this.doc.setFont("helvetica", "bold");
    this.doc.text("PUNTOS DE CONTROL SECTOR TRONADURA", this.left, this.usoPage, { align: 'left' });
    let midIMG = 110 + this.left


    //1ra Img
    this.doc.addImage("assets/img/mapa1.png", 'PNG', midIMG, this.usoPage + 15, 320, 220, 'figura2', 'SLOW');
    this.doc.setFontSize(8)
    this.doc.setFont("helvetica", "normal");


    this.doc.text("Figura " + this.numFigura + ": Mapa sintético de desplazamientos Vs. tiempo", this.midPointX, this.usoPage + 245, { align: 'center' });
    //Aumento num figura
    this.numFigura++

    this.usoPage += 230

    //2da Img
    this.generateNewPage(220)
    this.doc.addImage("../../assets/img/mapa2.png", 'PNG', midIMG, this.usoPage + 25, 320, 220, 'figura 3', 'SLOW');
    this.doc.setFontSize(8)
    this.doc.setFont("helvetica", "normal");

    this.doc.text("Figura " + this.numFigura + ": Gráfico de desplazamientos Vs. tiempo", this.midPointX, this.usoPage + 255, { align: 'center' });
    //Aumento num figura
    this.numFigura++

    this.usoPage += 230


    //TABLA
    this.usoPage += 50
    this.generateNewPage(50)
    this.doc.line(this.left, this.usoPage, this.right, this.usoPage);
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(9)
    let calc = (this.right + this.left) / 8
    this.doc.text("Radar", calc, this.usoPage + 20, { align: 'center' });
    this.doc.text("Descripción del", calc * 2, this.usoPage + 15, { align: 'center' });
    this.doc.text("Punto", calc * 2, this.usoPage + 25, { align: 'center' });
    this.doc.text("Este", calc * 3, this.usoPage + 20, { align: 'center' });
    this.doc.text("Norte", calc * 4, this.usoPage + 20, { align: 'center' });
    this.doc.text("Cota", calc * 5, this.usoPage + 20, { align: 'center' });
    this.doc.text("Desplazamiento", calc * 6, this.usoPage + 15, { align: 'center' });
    this.doc.text("(4hrs.)", calc * 6, this.usoPage + 25, { align: 'center' });
    this.doc.text("Velocidad", calc * 7, this.usoPage + 15, { align: 'center' });
    this.doc.text("(4hrs.)", calc * 7, this.usoPage + 25, { align: 'center' });
    this.doc.setFont("helvetica", "normal");
    this.doc.line(this.left, this.usoPage + 38, this.right, this.usoPage + 38);
    //radares

    this.usoPage += 50
    this.rds.forEach(rdr => {
      this.doc.setFontSize(9)
      this.doc.setFont("helvetica", "normal");
      // this.doc.text(radar, calc, this.usoPage, { align: 'center' });
      // this.doc.text(descripcionPunto.toString(), calc * 2, this.usoPage, { align: 'center' });
      // this.doc.text(radarEste.toString(), calc * 3, this.usoPage, { align: 'center' });
      // this.doc.text(radarNorte.toString(), calc * 4, this.usoPage, { align: 'center' });
      // this.doc.text(radarCota.toString(), calc * 5, this.usoPage, { align: 'center' });
      // this.doc.text(deplazamiento4horas + "mm", calc * 6, this.usoPage, { align: 'center' });
      // this.doc.text(velocidadPromedio + "mm/h", calc * 7, this.usoPage, { align: 'center' });
      this.doc.text(rdr.radar, calc, this.usoPage, { align: 'center' });
      this.doc.text(rdr.descripcion.toString(), calc * 2, this.usoPage, { align: 'center' });
      this.doc.text(rdr.este.toString(), calc * 3, this.usoPage, { align: 'center' });
      this.doc.text(rdr.norte.toString(), calc * 4, this.usoPage, { align: 'center' });
      this.doc.text(rdr.norte.toString(), calc * 5, this.usoPage, { align: 'center' });
      this.doc.text(rdr.desplazamiento + "mm", calc * 6, this.usoPage, { align: 'center' });
      this.doc.text(rdr.velocidad + "mm/h", calc * 7, this.usoPage, { align: 'center' });
      this.usoPage += 12
      this.generateNewPage(10)
    })
  }


  generarImagenes() {
    this.generateNewPage(190)
    this.usoPage += 20
    this.doc.setFontSize(12)
    this.doc.setFont("helvetica", "bold");
    this.doc.text("IMÁGENES", this.left, this.usoPage, { align: 'left' });
    let midIMG = 110 + this.left

    this.doc.setFontSize(8)
    this.doc.setFont("helvetica", "normal");
    //Primera img
    this.doc.addImage("assets/img1.png", 'PNG', this.left, this.usoPage + 10, 260, 180, 'alias1', 'SLOW');
    this.doc.text("Figura " + this.numFigura + ": Antes Panorámica ", 260 / 2 + this.left, this.usoPage + 200, { align: 'center' });
    //Aumento num figura
    this.numFigura++

    //segunda img
    this.doc.addImage("assets/img1.png", 'PNG', this.right - 260, this.usoPage + 10, 260, 180, 'alias1', 'SLOW');
    this.doc.text("Figura " + this.numFigura + ": Después Panorámica", this.right - 260 / 2, this.usoPage + 200, { align: 'center' });
    //Aumento num figura
    this.numFigura++

    this.usoPage += 210
    this.generateNewPage(260)

    //3ra img
    this.doc.addImage("assets/img1.png", 'PNG', this.left, this.usoPage + 10, 260, 180, 'alias1', 'SLOW');
    this.doc.text("Figura " + this.numFigura + ": Antes Panorámica ", 260 / 2 + this.left, this.usoPage + 200, { align: 'center' });
    //Aumento num figura
    this.numFigura++

    //4ta img
    this.doc.addImage("assets/img1.png", 'PNG', this.right - 260, this.usoPage + 10, 260, 180, 'alias1', 'SLOW');
    this.doc.text("Figura " + this.numFigura + ": Después Panorámica", this.right - 260 / 2, this.usoPage + 200, { align: 'center' });
    //Aumento num figura
    this.numFigura++

    this.usoPage += 210
    this.generateNewPage(260)

    //5ra img
    this.doc.addImage("assets/img1.png", 'PNG', this.left, this.usoPage + 10, 260, 180, 'alias1', 'SLOW');
    this.doc.text("Figura " + this.numFigura + ": Antes Panorámica ", 260 / 2 + this.left, this.usoPage + 200, { align: 'center' });
    //Aumento num figura
    this.numFigura++

    //6ta img
    this.doc.addImage("assets/img1.png", 'PNG', this.right - 260, this.usoPage + 10, 260, 180, 'alias1', 'SLOW');
    this.doc.text("Figura " + this.numFigura + ": Después Panorámica", this.right - 260 / 2, this.usoPage + 200, { align: 'center' });
    //Aumento num figura
    this.numFigura++

    this.usoPage += 210
    this.generateNewPage(260)

    //7ra img
    this.doc.addImage("assets/img1.png", 'PNG', this.left, this.usoPage + 10, 260, 180, 'alias1', 'SLOW');
    this.doc.text("Figura  " + this.numFigura + ": Antes Panorámica ", 260 / 2 + this.left, this.usoPage + 200, { align: 'center' });
    //Aumento num figura
    this.numFigura++

    //8ta img
    this.doc.addImage("assets/img1.png", 'PNG', this.right - 260, this.usoPage + 10, 260, 180, 'alias1', 'SLOW');
    this.doc.text("Figura " + this.numFigura + ": Después Panorámica", this.right - 260 / 2, this.usoPage + 200, { align: 'center' });
    //Aumento num figura
    this.numFigura++


  }

  tampleEMT() {
    this.implementarFuentes()

    this.doc.addImage("assets/images/image2.jpg", 'JPG', 0, 0, 600, 842, 'marca', 'SLOW');
    this.doc.setTextColor('#D5E1E2')
    this.doc.setFont("Lato", "normal");
    this.doc.setFontSize(20)
    this.doc.text("REPORTE PUNTOS DE\n" + "SEGUIMIENTO POST TRONADURA", 100, 250, { align: 'left' });
    this.doc.setTextColor('#DE6719')
    this.doc.setFontSize(18)
    this.doc.setFont("Lato", "bold");
    this.doc.text("Nombre Faena", 100, 295, { align: 'left' });
    this.doc.setTextColor('#D5E1E2')
    this.doc.setFontSize(12)
    this.doc.text("25 de agosto de 2022.", 331, 450, { align: 'left' });
    // this.doc.addImage("assets/images/image1.png", 'PNG', 20, 23, 217, 70, 'logo', 'SLOW');


    this.doc.setFontSize(8)
    this.doc.setTextColor("#D5E1E2")
    let calc = (this.right + this.left) / 6
    this.doc.setFont("helvetica", 'bold')
    this.doc.text('E-Mining Technology S.A.', this.left, this.endY, { align: 'left' });
    this.doc.text('•', this.left + 115, this.endY, { align: 'left' });
    this.doc.setFont("helvetica", 'normal')
    this.doc.text('Calle Limache 3405, Oficina 21, Viña del Mar', this.left + 135, this.endY, { align: 'left' });
    this.doc.setFont("helvetica", 'bold')
    this.doc.text('•', this.left + 314, this.endY, { align: 'left' });
    this.doc.setFont("helvetica", 'normal')
    this.doc.text('Teléfono: +56 32 2187440', this.left + 336, this.endY, { align: 'left' });
    this.doc.setFont("helvetica", 'bold')
    this.doc.text('•', this.left + 455, this.endY, { align: 'right' });
    this.doc.text('eminingtech.com', this.right, this.endY, { align: 'right' });
  }


  implementarFuentes() {
    this.doc.addFileToVFS("Lato-Font-bold.ttf", font);
    this.doc.addFont("Lato-Font-bold.ttf", "Lato", "bold");
    this.doc.addFileToVFS("Lato-Font-normal.ttf", latoRegular);
    this.doc.addFont("Lato-Font-normal.ttf", "Lato", "normal");
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


}


