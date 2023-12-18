import { jsPDF } from 'jspdf'


export const colores = {
    negro: '#013033',
    blanco: '#D5E1E2',
    naranjo: '#DE6719',
    azul: '#038080',
    gris: '#7A7A7A',
    gris_claro: '#CCCCCC',
    verde: '#30B31E',
    amarillo: '#C2C71B'
}

export const obtenerAncho = (pdfGen: jsPDF, texto: string, margen: number) => {
    let dimensiones = pdfGen.getTextDimensions(texto)
    let tamanoFuente = pdfGen.getFontSize()
    let lines = dimensiones.w / margen
    let valor = Math.trunc(lines) + 1.7 // Creo que 1.7 (espaciado) se multiplica por la cantidad de lineas
    return tamanoFuente * valor
}

export const dividirTexto = (text: string) => {
    return text.split('\n')
}

export function justify(pdfGen: jsPDF, text: string, xStart: number, yStart: number, textWidth: number) {
    text = text.replace(/(?:\r\n|\r|\n)/g, ' ');
    text = text.replace(/ +(?= )/g, '');
    const lineHeight = pdfGen.getTextDimensions('a').h * 1.15;
    const words = text.split(' ');
    let lineNumber = 0;
    let wordsInfo: IWordInfo[] = [];
    let lineLength = 0;
    for (const word of words) {
        const wordLength = pdfGen.getTextWidth(word + ' ');
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
    pdfGen.text(line, xStart, yStart + lineNumber * lineHeight);
}

function writeLine(pdfGen: jsPDF, wordsInfo: IWordInfo[], lineLength: number, lineNumber: number, xStart: number, yStart: number, lineHeight: number, textWidth: number) {

    const wordSpacing = (textWidth - lineLength) / (wordsInfo.length - 1);
    let x = xStart;
    const y = yStart + lineNumber * lineHeight;
    for (const wordInfo of wordsInfo) {
        pdfGen.text(wordInfo.text, x, y);
        x += wordInfo.wordLength + wordSpacing;
    }
}

interface IWordInfo {
    text: string;
    wordLength: number;
}

export const espaciarTextosLargos = (doc: jsPDF, texto: string, margenTop: number, inicio: number, anchoMax: number) => {
    const arrText = dividirTexto(texto)
    if (arrText) {
        arrText.forEach(str => {
            justify(doc, str, inicio, margenTop, anchoMax)
            margenTop = margenTop + obtenerAncho(doc, str, anchoMax)
        })
    }

    return margenTop
}



export const data = {
    ano: 2023,
    mes: 11,
    numInfo: 5,
    titulo: 'INFORME MENSUAL N°',
    subTiutlo: 'ANÁLISIS DE TENDENCIAS DE COMPORTAMIENTO DE LA INFRAESTRUCTURA',
    subTitulo2: 'SERVICIO DE MONITOREO GEOTÉCNICO TALUD DE ACCESO PUENTE LAS CUCHARAS DE METRO VALPARAÍSO',
    tablaResumen: {
        elaborado: 'ANDRÉS LEÓN',
        cargo: 'INGENIERO GEOTÉCNICO',
        revisado: 'LEONARDO ZAHR',
        cargo2: 'LÍDER DE GEOTECNIA',
        aprobado: 'LEONARDO ZAHR',
        cargo3: 'ADMINISTRADOR DE CONTRATO'
    },
    seccion1: {
        estadoIntrumentos: {
            piezometro: true,
            gcd: true,
            gcc: false,
            prisma: false
        },
        estadogeneral: 'La plataforma posee comunicación con piezómetros, Geo Centinelas de Corte y Deformación (GCC y GCC). Además de tener cargadas la información de desplazamientos de los prismas del sector de interés.\nDesde la ultima revisión de información han ocurrido dos eventos que gatillan el modo vigilancia el 29 de Octubre y 10 de Noviembre.\nEl comportamiento del Talud de Acceso a Puente Las Cucharas se mantiene estable, con todas las estaciones en estado Normal.\nDesde el 21 de Octubre hasta el 21 de Noviembre de 2023 no se superaron los umbrales establecidos, emitiéndose un reporte post sismo el 6 de Noviembre (5.1 Mw).',
        observaciones: {
            piezometro: 'No se observan variaciones significativas a lo largo del mes.',
            gcd: 'Vegetación suele tapar los pequeños paneles de los equipos haciendo que los equipos se descarguen.',
            gcc: 'Sin corte hasta el 15/11/2023.Prismas 04, 05, 06 y 09 sin lectura debido a que la vegetación obstaculiza la toma de datos.\nPrisma 21 con lecturas no representativas del talud debido a que el prisma no se encuentra fijo. Prismas 04, 05, 06 y 09 sin lectura debido a  que la vegetación obstaculiza la toma de datos.\nPrisma 21 con lecturas no representativas del talud debido a que el prisma no se encuentra fijo.  que la vegetación obstaculiza la toma de datos.\nPrisma 21 con lecturas no representativas del talud debido a que el prisma no se encuentra fijo. \nque la vegetación obstaculiza la toma de datos.\nPrisma 21 con lecturas no representativas del talud debido a que el prisma no se encuentra fijo.',
            prisma: 'Prismas 04, 05, 06 y 09 sin lectura debido a que la vegetación obstaculiza la toma de datos.\nPrisma 21 con lecturas no representativas del talud debido a que el prisma no se encuentra fijo. \nPrisma 21 con lecturas no representativas del talud debido a que el prisma no se encuentra fijo. \nPrisma 21 con lecturas no representativas del talud debido a que el prisma no se encuentra fijo. \nPrisma 21 con lecturas no representativas del talud debido a que el prisma no se encuentra fijo.'
        },
        tablaMonitoreo: {
            alarmas: 0,
            alertas: 0,
            vigilacia: 2,
            sismo: 1
        },
    },
    seccionAnalisis: [
        {
            obsGenerales: 'Durante el periodo comprendido entre el 21 de Octubre de 2023 al 21 de Noviembre la estación se encontró en estado Normal.',
            obsEspecificas: {
                obsGrafico1: '',
                obsGrafico2: '',
                gcd: 'Tendencias estables, últimos datos del 15 de Noviembre de 2023',
                gcc: 'Sin cortes hasta el último dato 15 de Noviembre de 2023.'
            },
            obsPiezometro: 'No se observan variaciones significativas.',
            pozo: 12
        },
        {
            obsGenerales: 'Durante el periodo comprendido entre el 21 de Octubre de 2023 al 21 de Noviembre la estación se encontró en estado NORMAL.',
            obsEspecificas: {
                obsGrafico1: '',
                obsGrafico2: 'Dada la sensibilidad del sensor, se puede producir cambios bruscos en las lecturas debido a reacomodos puntuales de material producto de la perforación misma o por precipitaciones.\nSi bien se observan cambios bruscos no existe en general una tendencia que apunte hacia un fallamiento.\nLas ventanas en gris muestran periodos en donde los nodos se descargaron y no registraron datos.',
                gcd: 'Tendencias estables*. Últimos datos del 15/10123.',
                gcc: 'Sin cortes hasta el último dato 15 de Noviembre de 2023.'
            },
            obsPiezometro: 'No se observan variaciones.',
            pozo: 13
        },
        {
            obsGenerales: 'Durante el periodo comprendido entre el 21 de Octubre de 2023 al 21 de Noviembre la estación se encontró en estado NORMAL.',
            obsEspecificas: {
                obsGrafico1: '',
                obsGrafico2: 'Se observa un canal saturado a 2,9m de profundidad, pero que no se correlaciona con la deformación que muestran los demás canales.',
                gcd: 'Tendencias estables*. Últimos datos del 15/10123.',
                gcc: 'Sin cortes hasta el último dato 15 de Noviembre de 2023.'
            },
            obsPiezometro: 'No se observan variaciones significativas.',
            pozo: 15,
            pozo2: 16
        },
    ]
}

