import { ElementRef } from "@angular/core";
import DomToImage from "dom-to-image";

export function loadScreenshotMapa(mapa: any, imagenMapa: any) {


    var node = mapa.nativeElement
    let img = new Image();
    var scale = 2;
    DomToImage.toPng(node, {
        width: node.clientWidth * scale,
        height: node.clientHeight * scale,
        style: {
            transform: 'scale(' + scale + ')',
            transformOrigin: 'top left'
        }
    })
        .then(function (dataUrl: any) {
            imagenMapa.src = dataUrl
        })
        .catch(function (error: any) {
            console.error('error', error);
        });


}