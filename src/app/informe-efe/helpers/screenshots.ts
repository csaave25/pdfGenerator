import { ElementRef, QueryList } from "@angular/core";
import html2canvas from "html2canvas";

export async function loadScreenshots(geoElements: QueryList<ElementRef<any>>, arr: string[]) {
    if (geoElements.length) {
        const promises = geoElements.map(e => {
            let element = e.nativeElement;
            return html2canvas(element, { scale: 3 }).then((canvas) => {
                const base64image = canvas.toDataURL("image/png");
                arr.push(base64image);
            });
        });

        await Promise.all(promises);
    }
}