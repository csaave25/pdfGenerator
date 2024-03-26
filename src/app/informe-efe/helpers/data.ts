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

export const espaciarTextosLargos = (doc: jsPDF, texto: string, margenTop: number, inicio: number, anchoMax: number, date: string, anoMes: string) => {
    const arrText = dividirTexto(texto)
    if (arrText) {
        arrText.forEach(str => {
            if (margenTop + obtenerAncho(doc, str, anchoMax) > 745) {
                doc.addPage()
                genradorDeHeaderYFooter(doc, date, anoMes)
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

const saltoDePagina = (str: string, doc: jsPDF, ancho: number, usopag: number, date: string, anoMes: string ) => {
    if (usopag + obtenerAncho(doc, str, ancho) > 745) {
        doc.addPage()
        doc.addImage("assets/EMT/marcaAgua.jpg", 'JPG', 0, 0, 612, 792, 'marca-x3' + Math.random(), 'FAST');
        genradorDeHeaderYFooter(doc, date, anoMes)
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

export const genradorDeHeaderYFooter = (doc: jsPDF , date: string, anoMes: string) => {
    let margenIzq = 20
    let margenDer = 562
    let finalPagina = 760
    let comienzoPaginaY = 20
    let margenContenidoIzq = margenIzq + 50
    let contadorPagina = 1
    let maxMargen = margenDer - margenIzq
    let puntoMedio = (doc.internal.pageSize.width || doc.internal.pageSize.getWidth()) / 2
    let mes2 = new Date(data.ano, data.mes - 1, 1).toLocaleString('default', { month: 'long' });

    function implementarFooter() {
        doc.setFontSize(8.5)
        doc.setTextColor(colores.negro)
        let calc = (margenDer + margenContenidoIzq) / 2 - 14
        doc.setFont("Lato", 'normal')
        doc.text('E-Mining Technology S.A. • Calle Limache 3405, Oficina 21, Viña del Mar • Teléfono: +56 32 2187440 • eminingtech.com', calc, finalPagina, { align: 'center' });

        doc.setFont("Lato", 'bold')
        doc.setFontSize(10)
        // doc.text(contadorPagina.toString(), margenDer - 20, finalPagina - 20, { align: 'right' });
        contadorPagina++
    }

    function implementarHeader() {
        doc.setTextColor(colores.negro)
        doc.addImage("assets/EMT/logo.png", 'PNG', margenDer - 60, comienzoPaginaY - 10, 90, 30, 'logo' + contadorPagina, 'SLOW');

        doc.setFontSize(9)
        doc.setFont('Lato', 'normal')
        doc.text('IYV-INF-VIG-EFE-02', margenDer + 28, comienzoPaginaY + 35, { align: 'right' })
        doc.addImage("assets/EFE/logoefe.png", 'PNG', margenIzq, comienzoPaginaY - 18, 90, 50, 'logoEfe' + contadorPagina, 'FAST')
        doc.text(anoMes, margenIzq + 25, comienzoPaginaY + 35, { align: 'left' })

        doc.setFontSize(13)
        doc.setFont('Lato', 'normal')
        doc.text('INFORME MENSUAL DE ANÁLISIS DE TENDENCIAS DE COMPORTAMIENTO DE LA INFRAESTRUCTURA', puntoMedio, comienzoPaginaY + 12, { align: 'center', maxWidth: puntoMedio + 20 })
        let altura = obtenerAncho(doc, data.subTiutlo, maxMargen) + comienzoPaginaY;
        doc.setFontSize(11)
        let mes = mes2
        mes = mes.charAt(0).toUpperCase() + mes.slice(1);
        doc.text(date, puntoMedio, altura + 20, { align: 'center' })
    }

    implementarFooter()
    implementarHeader()
    doc.setFontSize(10)
    doc.setFont("Lato", "normal");


}


export function getFechasFormatos(fechaInicio : string, fechaTermino : string){
    
    function formater(fc : string){
        let fecha = fc.replaceAll('-', '/')
        return fecha
    }

    let fechaInit = formater(fechaInicio)
    let fechaFin = formater(fechaTermino)
    
    return {fechaInit , fechaFin}
}



export const data = {
    ano: 2023,
    mes: 12,
    dia: 21,
    numReporte:6,
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
        estadogeneral: 'La plataforma posee comunicación con piezómetros, Geo Centinelas de Corte y Deformación (GCC y GCC). Además de tener cargadas la información de desplazamientos de los prismas del sector de interés.\nDesde la ultima revisión de información han ocurrido dos eventos que gatillan el modo vigilancia el 29 de Octubre y 10 de Noviembre.\nEl comportamiento del Talud de Acceso a Puente Las Cucharas se mantiene estable, con todas las estaciones en estado Normal.\nDesde el 21 de Octubre hasta el 21 de Noviembre de 2023 no se superaron los umbrales establecidos, emitiéndose un reporte post sismo el 6 de Noviembre (5.1 Mw)',
        observaciones: {
            piezometro: 'No se observan variaciones significativas a lo largo del mes.',
            gcd: 'Vegetación suele tapar los pequeños paneles de los equipos haciendo que los equipos se descarguen.',
            gcc: 'Sin corte hasta el 15/11/2023.',
            prisma: 'Prismas 04, 05, 06 y 09 sin lectura debido a que la vegetación obstaculiza la toma de datos.\nPrisma 21 con lecturas no representativas del talud debido a que el prisma no se encuentra fijo.'
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
                obsGrafico2: 'Dada la sensibilidad del sensor, se puede producir cambios bruscos en las lecturas debido a reacomodos puntuales de material producto de la perforación misma o por precipitaciones.\nSi bien se observan cambios bruscos no existe en general una tendencia que apunte hacia un fallamiento.\nLas ventanas en gris muestran periodos en donde los nodos se descargaron y no registraron datos. Dada la sensibilidad del sensor, se puede producir cambios bruscos en las lecturas debido a reacomodos puntuales de material producto de la perforación misma o por precipitaciones.\nSi bien se observan cambios bruscos no existe en general una tendencia que apunte hacia un fallamiento.\nLas ventanas en gris muestran periodos en donde los nodos se descargaron y no registraron datos. Dada la sensibilidad del sensor, se puede producir cambios bruscos en las lecturas debido a reacomodos puntuales de material producto de la perforación misma o por precipitaciones.\nSi bien se observan cambios bruscos no existe en general una tendencia que apunte hacia un fallamiento.\nLas ventanas en gris muestran periodos en donde los nodos se descargaron y no registraron datos.',
                gcd: 'Tendencias estables*. Últimos datos del 15/10123.',
                gcc: 'Sin cortes hasta el último dato 15 de Noviembre de 2023.'
            },
            obsPiezometro: 'No se observan variaciones.  Dada la sensibilidad del sensor, se puede producir cambios bruscos en las lecturas debido a reacomodos puntuales de material producto de la perforación misma o por precipitaciones.\nSi bien se observan cambios bruscos no existe en general una tendencia que apunte hacia un fallamiento.\nLas ventanas en gris muestran periodos en donde los nodos se descargaron y no registraron datos. Dada la sensibilidad del sensor, se puede producir cambios bruscos en las lecturas debido a reacomodos puntuales de material producto de la perforación misma o por precipitaciones.\nSi bien se observan cambios bruscos no existe en general una tendencia que apunte hacia un fallamiento.\nLas ventanas en gris muestran periodos en donde los nodos se descargaron y no registraron datos.  Dada la sensibilidad del sensor, se puede producir cambios bruscos en las lecturas debido a reacomodos puntuales de material producto de la perforación misma o por precipitaciones.\nSi bien se observan cambios bruscos no existe en general una tendencia que apunte hacia un fallamiento.\nLas ventanas en gris muestran periodos en donde los nodos se descargaron y no registraron datos. Dada la sensibilidad del sensor, se puede producir cambios bruscos en las lecturas debido a reacomodos puntuales de material producto de la perforación misma o por precipitaciones.\nSi bien se observan cambios bruscos no existe en general una tendencia que apunte hacia un fallamiento.\nLas ventanas en gris muestran periodos en donde los nodos se descargaron y no registraron datos.',
            pozo: 13
        },
        {
            obsGenerales: 'Durante el periodo comprendido entre el 21 de Octubre de 2023 al 21 de Noviembre la estación se encontró en estado *normal*.',
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
    ],
    seccionPrismas: {
        obsGenerales: '-Datos históricos cargados en la plataforma.\n-Prismas 04, 05, 06 y 09 sin lecturas (en rojo) debido a que vegetación impide correcta captura de datos.\n-Prisma 14 presentó lectura anómala en la medición de Agosto 2023, sin embargo, ahora muestra lecturas parecidas al resto de prismas.\n-Prisma 21 presenta lecturas no representativas del talud debido a que la base del prisma no se encuentra fija.\n-El resto de prismas (07, 08, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19 y 20) presentan una condición inactiva (velocidad tiende a 0).',

        analisisPrismas: [
            {
                prismas: 'P04-P12',
                obs: '-P04, 05, 06 y 09 sin lectura debido a que vegetación impide correcta captura de datos.\n-P07, 08,10, 11 y 12 presentan bajos desplazamientos, que no se asocian a desplazamientos superficiales del talud. Sus lecturas están dentro de los márgenes de error del equipo. Su condición es inactiva.',

            },
            {
                prismas: 'P13-P21',
                obs: '-P13, 14, 15, 16, 17, 18, 19 y 20 presentan bajos desplazamientos, que no se asocian a desplazamientos superficiales del talud. Sus lecturas están dentro de los márgenes de error del equipo.\n-P21 muestra lecturas anómalas producto a que el prisma no se encuentra fijo.'
            }
        ]

    },

    conclusion: 'Estos datos son los que se hablan por hablar y que no estan\n-El monitoreo se encuentra en estado *Normal*.\n-La plataforma posee una comunicación con piezómetros, Geo Centinelas de Corte y Deformación (GCC y GCC), sumado a información de agua caída producto de las lluvias.\n-Durante el mes se presentan 2 instancias de vigilancia, siendo el 29 de Octubre y el 10 de Noviembre.\nEsto es una prueba\n-Durante el mes se envió un reporte post sismo el 6 de Noviembre (5.1 Mw).\n-No se observaron variaciones significativas en las lecturas de piezómetros a lo largo del mes, aún cuando se presentaron 2 episodios de precipitación mayor a 10 mm/día.\n-No se observaron variaciones en las lecturas de los instrumentos posterior al evento sísmico del 6 de Noviembre, el cual fue de una magnitud mediana y su epicentro estuvo cerca (30 Km al Oeste de Valparaíso).\n-La comunicación de algunos equipos como Geo Centinelas se ve interrumpida por problemas de sombra en algunos sensores, los cuales pueden descargarse, sin embargo, al recuperar la energía se recupera la conexión, por lo que se hace necesario realizar una visita para limpiar equipos, vegetación y corroborar el estado de los prismas, puesto que permite hacer un contraste entre las diferentes mediciones.\n\nEsto es el final de algo...'
}


