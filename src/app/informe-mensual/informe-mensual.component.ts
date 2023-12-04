import { Component, ViewChild, ElementRef, Renderer2, AfterViewInit, OnInit } from '@angular/core';
import { InformeMensualService } from '../informe-mensual.service';
import { ConsultasService } from '../consultas.service';

@Component({
  selector: 'app-informe-mensual',
  templateUrl: './informe-mensual.component.html',
  styleUrls: ['./informe-mensual.component.scss']
})
export class InformeMensualComponent implements AfterViewInit, OnInit {


  @ViewChild('preview') element!: ElementRef;

  constructor(private informeService: InformeMensualService, private render: Renderer2, private rq: ConsultasService) {

  }

  dataCriticisadad: any
  dataMatrix: any
  dataUltimosCambiosMatrix: any
  tablaDispo: any

  ngOnInit(): void {
    this.load()
  }

  load() {
    this.dataCriticisadad = this.rq.getTablaAlertas(10)//cambiar mes
    this.rq.getDisponibilidad('noviembre').subscribe(dato => {
      let prom = (dato.servicio_web + dato.servicio_imagenes + dato.servicio_db + dato.servicio_api + dato.servicio_computo) / 5
      let promRound = prom.toString().match(/^-?\d+(?:\.\d{0,2})?/)![0]
      this.tablaDispo = {
        infraestructura: promRound,
        servicio_web: dato.servicio_web.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0],
        servicio_imagenes: dato.servicio_imagenes.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0],
        servicio_db: dato.servicio_db.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0],
        servicio_api: dato.servicio_api.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0],
        servicio_computo: dato.servicio_computo.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0],
        sistema_adquisicion_imagenes: dato.sistema_adquisicion_imagenes.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0],
        enlace_dedicado: dato.enlace_dedicado.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0],
      }

    });//cambiar mes




    this.rq.getMatrix().subscribe(dato => this.dataMatrix = dato)
    this.rq.getUltimosCambiosMatrix().subscribe(dato => this.dataUltimosCambiosMatrix = dato)
  }



  ngAfterViewInit(): void {
    // this.activarInforme()
  }

  activarInforme() {
    this.informeService.onPrevizualizar(this.dataCriticisadad, this.dataMatrix, this.dataUltimosCambiosMatrix, this.tablaDispo)
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
