import { Component, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { InformeMensualService } from '../informe-mensual.service';

@Component({
  selector: 'app-informe-mensual',
  templateUrl: './informe-mensual.component.html',
  styleUrls: ['./informe-mensual.component.scss']
})
export class InformeMensualComponent implements AfterViewInit {

  
  @ViewChild('preview') element!:ElementRef;

  constructor(private informeService: InformeMensualService, private render: Renderer2) {

  }

  ngAfterViewInit(): void {
      this.activarInforme()
  }

  activarInforme() {
    this.informeService.onPrevizualizar()
    let string = this.informeService.doc.output('datauristring');
    let elemento = this.element.nativeElement
    let embed = this.render.createElement("embed")
    this.render.setAttribute(embed,'width', '100%')
    this.render.setAttribute(embed,'height', '100%')
    this.render.setAttribute(embed,'src', string)
    this.render.appendChild(elemento,embed)

  }

}
