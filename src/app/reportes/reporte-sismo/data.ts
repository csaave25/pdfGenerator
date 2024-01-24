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
    let lineHeight = dimensiones.h * 1.15
    let lines = Math.round(dimensiones.w / margen)
    if ((dimensiones.w / margen) > Math.round(dimensiones.w / margen)) {
        lines += 1
    }
    let valor = lines * lineHeight
    return valor
}

const dividirTexto = (text: string) => {
    return text.split('\n')
}

const saltoDePagina = (str: string, doc: jsPDF, ancho: number, usopag: number, date?: string, anoMes?: string) => {
    if (usopag + obtenerAncho(doc, str, ancho) > 730) {
        doc.addPage()
        doc.setFontSize(11)
        doc.setFont('Lato', 'normal')
        return 100
    }
    return usopag
}

//doc: jsPDF, texto: string, margenTop: number, inicio: number, anchoMax: number, date: string, anoMes: string, finalPag : number
export const formateadoraDeTexto = (doc: jsPDF, textos: string, margenTop: number, inicio: number, anchoMax: number) => {
    if (textos) {
        let text = dividirTexto(textos)
        let init = inicio + doc.getTextWidth('•  ')
        let ancho = anchoMax - doc.getTextWidth('•  ')
        text.forEach(texto => {
            let copytext = texto
            copytext = copytext.replace(' ', '')
            if (texto[0] == '-') {
                let txt = texto.slice(1, texto.length)
                margenTop = saltoDePagina(txt, doc, ancho, margenTop)
                doc.setFont("Lato", 'bold')
                doc.text('•', inicio, margenTop, { align: 'left' })
                doc.setFont("Lato", 'normal')
                justify(doc, txt, init, margenTop, ancho)
                margenTop = margenTop + obtenerAncho(doc, txt, ancho)+4
            } else {
                if (copytext.length == 0) {
                    margenTop += 10
                } else {
                    margenTop = saltoDePagina(texto, doc, ancho, margenTop)
                    justify(doc, texto, inicio, margenTop, anchoMax)
                    margenTop = margenTop + obtenerAncho(doc, texto, anchoMax)
                }
            }

        })
    }
    return margenTop
}


export function obtenerFechaEnPredefinido(fecha: Date, local: boolean) {
    if (local) {
        let ano = fecha.getFullYear().toString()
        let diaNombre = fecha.toLocaleDateString('es-ES', { weekday: 'long' });
        diaNombre = diaNombre[0].toUpperCase() + diaNombre.slice(1)
        let diaNumero = fecha.toLocaleDateString().slice(0, 2)
        let mesNombre = fecha.toLocaleDateString('es-ES', { month: 'long' })
        mesNombre = mesNombre[0].toUpperCase() + mesNombre.slice(1)
        let hora = ('0' + fecha.toLocaleTimeString('es-ES')).slice(-8).slice(0, 5)
        return diaNombre + ' ' + diaNumero + ' de ' + mesNombre + ' de ' + ano + ', ' + hora + ' hrs.'
    } else {
        let ano = fecha.getFullYear().toString()
        let diaNombre = fecha.toLocaleDateString('us-US', { weekday: 'long' , timeZone: 'UTC' });
        diaNombre = diaNombre[0].toUpperCase() + diaNombre.slice(1)
        let diaNumero = fecha.toLocaleDateString().slice(0, 2)
        let mesNombre = fecha.toLocaleDateString('us-US', { month: 'long' ,timeZone: 'UTC' })
        mesNombre = mesNombre[0].toUpperCase() + mesNombre.slice(1)
        let hora = ('0' + fecha.toLocaleTimeString('us-US',{timeZone: 'UTC' })).slice(-8).slice(0, 5)
        return diaNombre + ' ' + diaNumero + ' de ' + mesNombre + ' de ' + ano + ', ' + hora + ' hrs.'
    }

}




