import { jsPDF } from 'jspdf'

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