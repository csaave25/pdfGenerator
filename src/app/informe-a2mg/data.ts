
export const colores = {
    negro: '#013033',
    blanco: '#D5E1E2',
    naranjo: '#DE6719',
    azul: '#038080',
    gris: '#7A7A7A',
    gris_claro: '#CCCCCC'
}

export const dataInforme = {
    subTitulo: 'Monitoreo Ripios Aplicación A2MG',
    subTitulo2: 'Superintendencia de Geotecnia',
    faena: 'Minera Antucoya – AMSA',
    fecha: 'Octubre 2023',
    disponibilidad: {
        texto1: 'La disponibilidad del sistema, indica cuánto tiempo este está operativo con respecto al tiempo programado de funcionamiento. La fórmula para calcular la disponibilidad es:',
        texto2: 'Los componentes del sistema de monitoreo corresponden a Infraestructura EMT (servicio web, imágenes, base de datos, API y cómputo), Infraestructura ANT (sistema de adquisición de imágenes) y Enlaces (Dedicado AMSA). A continuación, en la *TABLA 1* se presenta la disponibilidad del sistema. '
    },
    confiabilidad: {
        texto1: 'La confiabilidad del servicio, cuantifica la cantidad de grietas alertadas anticipadamente con el sistema de monitoreo disponible, en función a la cantidad de grietas formadas en el área de cobertura asociada a la operación del esparcidor. ',
        texto3: 'Durante el mes de noviembre, se detectan grietas de criticidad media durante la madrugada del día 26/11/23 desde la 03:30 a través de la cámara 4 (ver Figura 1) en específico la grieta C1, la cuál se mantiene hasta las 07:04 del mismo día. La detección de esta grieta es posible dado que existe iluminación en el sector. La grieta C0, identificada en el borde de la solución corresponde a un falso positivo.'
    }

}


import jsPDF from "jspdf";

export function justify(pdfGen: jsPDF, text: string, xStart: number, yStart: number, textWidth: number) {
    text = text.replace(/(?:\r\n|\r|\n)/g, ' ');
    text = text.replace(/ +(?= )/g, '');
    const lineHeight = pdfGen.getTextDimensions('a').h * 1.15;
    const words = text.split(' ');
    let lineNumber = 0;
    let wordsInfo: IWordInfo[] = [];
    let lineLength = 0;
    for (const word of words) {
        const wordLength = pdfGen.getTextWidth(word.replace('*', "").replace('*', "") + ' ');
        if (wordLength + lineLength > textWidth) {
            writeLine(pdfGen, wordsInfo, lineLength, lineNumber++, xStart, yStart, lineHeight, textWidth);
            wordsInfo = [];
            lineLength = 0;
        }
        wordsInfo.push({ text: word, wordLength });
        lineLength += wordLength;
    }
    if (wordsInfo.length > 0) {
        writeLastLine(wordsInfo, pdfGen, xStart, yStart, lineNumber, lineHeight);
    }
}

function writeLastLine(wordsInfo: IWordInfo[], pdfGen: jsPDF, xStart: number, yStart: number, lineNumber: number, lineHeight: number) {

    //-Esto es una *prueba* de todas maneras. Esto es una *prueba* de todas maneras. Esto es una *prueba* de todas maneras. Esto es una *prueba* de todas maneras. Esto es una *prueba* de todas maneras. Esto es una *prueba* de todas maneras. Esto es una *prueba* de todas maneras. Esto es una *prueba* de todas maneras. Esto es una *prueba* de todas maneras.

    const line = wordsInfo.map(x => x.text).join(' ');
    let txt = line.split('*')
    let lastWordWidth = 0
    txt.forEach((str, index) => {
        if (index % 2 != 0) {
            pdfGen.setFont('Lato', 'bold')
        } else {
            pdfGen.setFont('Lato', 'normal')
        }
        pdfGen.text(str, xStart + lastWordWidth, yStart + lineNumber * lineHeight);
        lastWordWidth += pdfGen.getTextWidth(str)
    })
}

function writeLine(pdfGen: jsPDF, wordsInfo: IWordInfo[], lineLength: number, lineNumber: number, xStart: number, yStart: number, lineHeight: number, textWidth: number) {

    const wordSpacing = (textWidth - lineLength) / (wordsInfo.length - 1);
    let x = xStart;
    const y = yStart + lineNumber * lineHeight;
    for (const wordInfo of wordsInfo) {
        if (wordInfo.text.includes('*')) {
            pdfGen.setFont('Lato', 'bold')
        } else {
            pdfGen.setFont('Lato', 'normal')
        }
        pdfGen.text(wordInfo.text.replace('*', "").replace('*', ""), x, y);
        x += wordInfo.wordLength + wordSpacing;
    }
}

interface IWordInfo {
    text: string;
    wordLength: number;
}

export const obtenerAncho = (pdfGen: jsPDF, texto: string, margen: number) => {
    let dimensiones = pdfGen.getTextDimensions(texto)
    let tamanoFuente = pdfGen.getFontSize()
    let lines = ((dimensiones.w * tamanoFuente) / margen)
    let valor = Math.trunc(lines) * 1.7  // Creo que 1.7 (espaciado) se multiplica por la cantidad de lineas
    return valor
}

const dividirTexto = (text: string) => {
    return text.split('\n')
}

const saltoDePagina = (str: string, doc: jsPDF, ancho: number, usopag: number, date: string, anoMes: string) => {
    if (usopag + obtenerAncho(doc, str, ancho) > 745) {
        doc.addPage()
        // genradorDeHeaderYFooter(doc, date, anoMes)
        return 100
    }
    return usopag
}

//doc: jsPDF, texto: string, margenTop: number, inicio: number, anchoMax: number, date: string, anoMes: string, finalPag : number
export const formateadoraDeTexto = (doc: jsPDF, textos: string, margenTop: number, inicio: number, anchoMax: number, date: string, anoMes: string, finalPag: number) => {
    if (textos) {
        let text = dividirTexto(textos)
        let init = inicio + 18
        let ancho = anchoMax - 18
        console.log(text);

        text.forEach(texto => {

            let copytext = texto
            copytext = copytext.replace(' ', '')
            if (texto[0] == '-') {
                let txt = texto.slice(1, texto.length)
                margenTop = saltoDePagina(txt, doc, ancho, margenTop, date, anoMes)
                doc.setFont("Lato", 'bold')
                doc.text('    •', inicio, margenTop, { align: 'left' })
                doc.setFont("Lato", 'normal')
                justify(doc, txt, init, margenTop, ancho)
                margenTop = margenTop + obtenerAncho(doc, txt, ancho)
            } else {
                if (copytext.length == 0) {
                    margenTop += 10
                } else {
                    margenTop = saltoDePagina(texto, doc, ancho, margenTop, date, anoMes)
                    justify(doc, texto, inicio, margenTop, anchoMax)
                    margenTop = margenTop + obtenerAncho(doc, texto, anchoMax)
                }
            }

        })
    }
    return margenTop
}



// function nuevaPagina(doc : jsPDF) {

//     doc.addImage("assets/images/marca.jpg", 'JPG', 0, 0, 612, 792, 'marca-x', 'SLOW');
//     // implementarHeader()
//     implementarFooter(doc)
// }


function implementarFooter(doc : jsPDF) {
    let marginLeft = 20
    let marginRight = 562
    let endPage = 760
    let marginContent = marginLeft + 50
    let contadorPagina = 2
  


    doc.setFontSize(8.5)
    doc.setTextColor(colores.negro)
    let calc = (marginRight + marginContent) / 2 - 14
    doc.setFont("Lato", 'normal')
    doc.text('E-Mining Technology S.A. • Calle Limache 3405, Oficina 21, Viña del Mar • Teléfono: +56 32 2187440 • eminingtech.com', calc, endPage, { align: 'center' });

    doc.setFont("Lato", 'bold')
    doc.setFontSize(10)
    doc.text(contadorPagina.toString(), marginRight - 20, endPage - 20, { align: 'right' });
    contadorPagina++
}

// function implementarHeader() {

//     // this.doc.addImage("assets/images/logo.png", 'PNG', this.marginLeft , 20, 222, 69, 'logo', 'SLOW'); LOGO CON PORTE IGUAL AL DE PORTADA
//     this.doc.addImage("assets/images/logo.png", 'PNG', this.marginLeft, this.startPage, 160, 50, 'logo' + this.contadorPagina, 'SLOW');
//     this.doc.setFontSize(8)
//     this.doc.setTextColor(this.colores.negro)
//     this.doc.setFont('Lato', 'normal')
//     this.doc.text('Informe Mensual', this.marginRight, this.startPage + 12, { align: 'right' })
//     this.doc.setTextColor(this.colores.negro)
//     this.doc.text('Monitoreo de Ripios Aplicación A2MG', this.marginRight, this.startPage + 24, { align: 'right' })
//     this.doc.text(this.fecha, this.marginRight, this.startPage + 36, { align: 'right' })
// }





