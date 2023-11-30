import { Component, ViewChild, ElementRef, Renderer2, AfterViewInit, OnInit } from '@angular/core';
import { InformeMensualService } from '../informe-mensual.service';
import { ConsultasService } from '../consultas.service';

@Component({
  selector: 'app-informe-mensual',
  templateUrl: './informe-mensual.component.html',
  styleUrls: ['./informe-mensual.component.scss']
})
export class InformeMensualComponent implements AfterViewInit, OnInit {

  
  @ViewChild('preview') element!:ElementRef;

  constructor(private informeService: InformeMensualService, private render: Renderer2, private rq : ConsultasService) {

  }

  data:any

  ngOnInit(): void {      
    this.load()
  }

  load() {
    this.rq.getHttp().subscribe(dato => this.data = dato);
  }

  ngAfterViewInit(): void {
      // this.activarInforme()
  }

  activarInforme() {
    this.informeService.onPrevizualizar(this.data)
    // console.log(this.data);
    
    // let string = this.informeService.doc.output('datauristring');
    // let elemento = this.element.nativeElement
    // let embed = this.render.createElement("embed")
    // this.render.setAttribute(embed,'width', '100%')
    // this.render.setAttribute(embed,'height', '100%')
    // this.render.setAttribute(embed,'src', string)
    // this.render.appendChild(elemento,embed)

  }

}
