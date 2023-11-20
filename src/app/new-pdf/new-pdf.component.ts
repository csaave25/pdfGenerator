import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-new-pdf',
  templateUrl: './new-pdf.component.html',
  styleUrls: ['./new-pdf.component.scss']
})
export class NewPDFComponent {



  export = false

  reporte = new FormGroup({
    fecha: new FormControl(''),
    observaciones: new FormControl('Sin observaciones'),
    zona: new FormControl(''),
    pared: new FormControl(null),
    este: new FormControl(null),
    norte: new FormControl(null),
    cota: new FormControl(null),
    produccion: new FormControl(false),
    precorte: new FormControl(false),
    destape: new FormControl(false),
    bolones: new FormControl(false),
    desquinche: new FormControl(false),
    contorno: new FormControl(false),
    pozosProduccion: new FormControl(null),
    nMallas: new FormControl(null),
    pozosPrecorte: new FormControl(null),
    factorCarga: new FormControl(null),
    Volumne: new FormControl(null),
    mapaSintetico: new FormControl(null),
    graficoDesplazaminetotiempo: new FormControl(null),
    radar: new FormControl(null),
    descripcionPunto: new FormControl(null),
    radarEste: new FormControl(null),
    radarNorte: new FormControl(null),
    radarCota: new FormControl(null),
    deplazamiento4horas: new FormControl(null),
    velocidadPromedio: new FormControl(null),
    posicionTronadura: new FormControl(null),
    antesPanoramica: new FormControl(null),
    despuesPanoramica: new FormControl(null),
    antesZoom: new FormControl(null),
    despuesZoom: new FormControl(null),
    antesSuperior: new FormControl(null),
    DespuesSuperior: new FormControl(null),
    antesInferior: new FormControl(null),
    despuesinferior: new FormControl(null),
  });

  changeState() {
    this.export = !this.export
  }

  createTable() {

    let form = this.reporte.controls
    let tab = []
    // produccion: new FormControl(false),
    // precorte: new FormControl(false),
    // destape: new FormControl(false),
    // bolones: new FormControl(false),
    // desquinche: new FormControl(false),
    // contorno:
  }

  getFecha(): string {

    const dias = [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
    ];

    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    let form = this.reporte.controls
    let dia = dias[new Date(form.fecha.value!).getDay()]
    let diaNum = new Date(form.fecha.value!).getDate()
    let mes = meses[new Date(form.fecha.value!).getMonth()]
    let hora = new Date(form.fecha.value!).getHours() + ':' + new Date(form.fecha.value!).getMinutes()
    let ano = new Date(form.fecha.value!).getFullYear()
    return dia + ' ' + diaNum + ' de ' + mes + ' de ' + ano + ', ' + hora + ' hrs.'


  }


  generatePDF() {

    let form = this.reporte.controls
    let startY = 10
    let endY = 835
    let left = 30
    let right = 570
    let midPointX = (right + left) / 2

    let doc = new jsPDF('p', 'pt', 'a4')

    //HEADER
    doc.setFontSize(13)
    doc.setFont("helvetica")
    doc.text("REPORTE PUNTOS DE SEGUIMIENTO POST TRONADURA", midPointX, 40, { align: 'center' });
    doc.setFont("helvetica");
    doc.setFontSize(11)
    doc.text("TRONADURA " + form.zona.value!.toUpperCase() + " - COORDENADAS: " + form.este.value + " | " + form.norte.value + " | " + form.cota.value, midPointX, 55, { align: 'center' });
    doc.text(this.getFecha(), midPointX, 70, { align: 'center' });
    doc.text("2023.12", left, 80, { align: 'left' });
    doc.text("IYV-RP-VIG-CMZ-04", right, 80, { align: 'right' });
    doc.line(left, 85, right, 85);


    //midINFO
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold");
    doc.text("PLANO DE UBICACIÓN", left, 110, { align: 'left' });
    doc.addImage("assets/img1.png", 'PNG', 130, 130, 340, 360);
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal");
    doc.text("Figura 1: Posición de tronadura e instrumentación", midPointX, 500, { align: 'center' });

    doc.setFontSize(12)
    doc.setFont("helvetica", "bold");
    doc.text("INFORMACIÓN TRONADURA", 30, 540, { align: 'left' });
    doc.line(left, 560, right, 560);
    doc.setFontSize(10)

    let calc = (right + left) / 7
    doc.text("Producción", calc, 590, { align: 'center' });
    doc.text("Precorte", calc * 2, 590, { align: 'center' });
    doc.text("Destape", calc * 3, 590, { align: 'center' });
    doc.text("Bolones", calc * 4, 590, { align: 'center' });
    doc.text("Desquinche", calc * 5, 590, { align: 'center' });
    doc.text("Contorno", calc * 6, 590, { align: 'center' });
    let tamañoImg = 7
    form.produccion.value ? doc.addImage("../../assets/check.png", 'PNG', calc - 5, 600, tamañoImg, tamañoImg) : doc.addImage("../../assets/ximg.png", 'PNG', calc - 5, 600, tamañoImg, tamañoImg);
    form.precorte.value ? doc.addImage("../../assets/check.png", 'PNG', calc * 2 - 5, 600, tamañoImg, tamañoImg) : doc.addImage("../../assets/ximg.png", 'PNG', calc * 2 - 5, 600, tamañoImg, tamañoImg);
    form.destape.value ? doc.addImage("../../assets/check.png", 'PNG', calc * 3 - 5, 600, tamañoImg, tamañoImg) : doc.addImage("../../assets/ximg.png", 'PNG', calc * 3 - 5, 600, tamañoImg, tamañoImg);
    form.bolones.value ? doc.addImage("../../assets/check.png", 'PNG', calc * 4 - 5, 600, tamañoImg, tamañoImg) : doc.addImage("../../assets/ximg.png", 'PNG', calc * 4 - 5, 600, tamañoImg, tamañoImg);
    form.desquinche.value ? doc.addImage("../../assets/check.png", 'PNG', calc * 5 - 5, 600, tamañoImg, tamañoImg) : doc.addImage("../../assets/ximg.png", 'PNG', calc * 5 - 5, 600, tamañoImg, tamañoImg);
    form.contorno.value ? doc.addImage("../../assets/check.png", 'PNG', calc * 6 - 5, 600, tamañoImg, tamañoImg) : doc.addImage("../../assets/ximg.png", 'PNG', calc * 6 - 5, 600, tamañoImg, tamañoImg);

    doc.line(left, 635, right, 635);
    calc = (right + left) / 4
    doc.text("N° Pozos Producción: " + form.pozosProduccion, calc, 665, { align: 'center' });
    doc.text("N° Pozos Precorte: " + form.pozosPrecorte, calc * 2, 665, { align: 'center' });
    doc.text("N° de Mallas: " + form.nMallas, calc * 3, 665, { align: 'center' });
    doc.line(left, 685, right, 685);
    calc = (right + left) / 3
    doc.text("Volumen (Kton): " + form.Volumne, calc, 715, { align: 'center' });
    doc.text("Factor de Carga General: " + form.factorCarga, calc * 2, 715, { align: 'center' });


    //FOOTER
    doc.setFontSize(10)
    doc.text("1", midPointX, endY, { align: 'center' });
    doc.text("Néstor Ramírez Muena", 30, endY, { align: 'left' });
    doc.text("2023.12", 570, endY, { align: 'right' });


    //NUEVA PAGINA  
    doc.addPage()


    //HEADER
    doc.setFontSize(13)
    doc.setFont("helvetica")
    doc.text("REPORTE PUNTOS DE SEGUIMIENTO POST TRONADURA", midPointX, 40, { align: 'center' });
    doc.setFont("helvetica");
    doc.setFontSize(11)
    doc.text("TRONADURA " + form.zona.value!.toUpperCase() + " - COORDENADAS: " + form.este.value + " | " + form.norte.value + " | " + form.cota.value, midPointX, 55, { align: 'center' });
    doc.text(this.getFecha(), midPointX, 70, { align: 'center' });
    doc.text("2023.12", left, 80, { align: 'left' });
    doc.text("IYV-RP-VIG-CMZ-04", right, 80, { align: 'right' });
    doc.line(left, 85, right, 85);


    //MID

    doc.setFontSize(12)
    doc.setFont("helvetica", "bold");
    doc.text("PUNTOS DE CONTROL SECTOR TRONADURA", left, 110, { align: 'left' });
    let midIMG = 110 + left
    doc.addImage("assets/img1.png", 'PNG', midIMG, 125, 320, 220);
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal");
    doc.text("Figura 2: Mapa sintético de desplazamientos Vs. tiempo", midPointX, 355, { align: 'center' });



    doc.addImage("../../assets/img1.png", 'PNG', midIMG, 380, 320, 220);
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal");
    doc.text("Figura 3: Gráfico de desplazamientos Vs. tiempo", midPointX, 610, { align: 'center' });

    doc.line(left, 630, right, 630);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9)
    calc = (right + left) / 8
    doc.text("Radar", calc, 650, { align: 'center' });
    doc.text("Descripción del", calc * 2, 645, { align: 'center' });
    doc.text("Punto", calc * 2, 655, { align: 'center' });
    doc.text("Este", calc * 3, 650, { align: 'center' });
    doc.text("Norte", calc * 4, 650, { align: 'center' });
    doc.text("Cota", calc * 5, 650, { align: 'center' });
    doc.text("Desplazamiento", calc * 6, 645, { align: 'center' });
    doc.text("(4hrs.)", calc * 6, 655, { align: 'center' });
    doc.text("Velocidad", calc * 7, 645, { align: 'center' });
    doc.text("(4hrs.)", calc * 7, 655, { align: 'center' });
    doc.setFont("helvetica", "normal");
    doc.line(left, 668, right, 668);
    //radares
    doc.text("IBIS ArcSAR", calc, 680, { align: 'center' });
    doc.text("138", calc * 2, 680, { align: 'center' });
    doc.text("93572", calc * 3, 680, { align: 'center' });
    doc.text("22485", calc * 4, 680, { align: 'center' });
    doc.text("3149", calc * 5, 680, { align: 'center' });
    doc.text("-2,48mm", calc * 6, 680, { align: 'center' });
    doc.text("-0,63mm/h", calc * 7, 680, { align: 'center' });

    //FOOTER
    doc.setFontSize(10)
    doc.text("2", midPointX, endY, { align: 'center' });
    doc.text("Néstor Ramírez Muena", 30, endY, { align: 'left' });
    doc.text("2023.12", 570, endY, { align: 'right' });



    //NUEVA PAGINA  
    doc.addPage()

    //HEADER
    doc.setFontSize(13)
    doc.setFont("helvetica")
    doc.text("REPORTE PUNTOS DE SEGUIMIENTO POST TRONADURA", midPointX, 40, { align: 'center' });
    doc.setFont("helvetica");
    doc.setFontSize(11)
    doc.text("TRONADURA " + form.zona.value!.toUpperCase() + " - COORDENADAS: " + form.este.value + " | " + form.norte.value + " | " + form.cota.value, midPointX, 55, { align: 'center' });
    doc.text(this.getFecha(), midPointX, 70, { align: 'center' });
    doc.text("2023.12", left, 80, { align: 'left' });
    doc.text("IYV-RP-VIG-CMZ-04", right, 80, { align: 'right' });
    doc.line(left, 85, right, 85);


    //MID

    doc.setFontSize(12)
    doc.setFont("helvetica", "bold");
    doc.text("IMÁGENES", left, 110, { align: 'left' });
    midIMG = 110 + left
    doc.addImage("assets/img1.png", 'PNG', left, 120, 260, 180);
    doc.addImage("assets/img1.png", 'PNG', right - 260, 120, 260, 180);
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal");
    doc.text("Figura 4: Antes Panorámica ", 260/2 +left, 310, { align: 'center' });
    doc.text("Figura 5: Después Panorámica", right - 260/2, 310, { align: 'center' });



    //FOOTER
    doc.setFontSize(10)
    doc.text("2", midPointX, endY, { align: 'center' });
    doc.text("Néstor Ramírez Muena", 30, endY, { align: 'left' });
    doc.text("2023.12", 570, endY, { align: 'right' });


    //ABRIR VENTANA NUEVA
    var string = doc.output('datauristring');
    var embed = "<embed width='100%' height='100%' src='" + string + "'/>"
    var x = window.open();
    x!.document.open();
    x!.document.write(embed);
    x!.document.body.style.margin = '0'
    x!.document.close();
    //doc.save('intento1')

  }


}
