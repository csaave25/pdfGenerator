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
        if(wordInfo.text.includes('*')){
            pdfGen.setFont('Lato', 'bold')
        }else{
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

export const espaciarTextosLargos = (doc: jsPDF, texto: string, margenTop: number, inicio: number, anchoMax: number, date: string, anoMes: string, finalPag : number) => {
    const arrText = dividirTexto(texto)
    if (arrText) {
        arrText.forEach(str => {
            if (margenTop + obtenerAncho(doc, str, anchoMax) > finalPag) {
                doc.addPage()
                // genradorDeHeaderYFooter(doc, date, anoMes)
                margenTop = 100
                justify(doc, str, inicio, margenTop, anchoMax)
                margenTop = margenTop + obtenerAncho(doc, str, anchoMax)
            } else {
                justify(doc, str, inicio, margenTop, anchoMax)
                margenTop = margenTop + obtenerAncho(doc, str, anchoMax)
            }
        })
    }

    return margenTop
}

export const obtenerAncho = (pdfGen: jsPDF, texto: string, margen: number) => {
    let dimensiones = pdfGen.getTextDimensions(texto)
    let tamanoFuente = pdfGen.getFontSize()
    let lines = dimensiones.w / margen
    let valor = Math.trunc(lines) + 1.7 // Creo que 1.7 (espaciado) se multiplica por la cantidad de lineas
    return tamanoFuente * valor
}

const dividirTexto = (text: string) => {
    return text.split('\n')
}

const saltoDePagina = (str: string, doc: jsPDF, ancho: number, usopag: number, date: string, anoMes: string ) => {
    if (usopag + obtenerAncho(doc, str, ancho) > 745) {
        doc.addPage()
        // genradorDeHeaderYFooter(doc, date, anoMes)
        return 100
    }
    return usopag
}

export const formateadoraDeTexto = (doc: jsPDF, textos: string, margenTop: number, inicio: number, anchoMax: number, date: string, anoMes: string) => {
    if (textos) {
        let text = dividirTexto(textos)
        let init = inicio + 18
        let ancho = anchoMax - 18
        text.forEach(texto => {
            if (texto[0] == '-') {
                let txt = texto.slice(1, texto.length)
                margenTop = saltoDePagina(txt, doc, ancho, margenTop, date, anoMes)
                doc.setFont("Lato", 'bold')
                doc.text('    •', inicio, margenTop, { align: 'left' })
                doc.setFont("Lato", 'normal')
                justify(doc, txt, init, margenTop, ancho)
                margenTop = margenTop + obtenerAncho(doc, txt, ancho)
            } else {
                if (texto.length == 0) {
                    margenTop += 17
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