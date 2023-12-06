import { Component, ViewChild, ElementRef, Renderer2, AfterViewInit, OnInit } from '@angular/core';
import { InformeMensualService } from '../informe-mensual.service';
import { ConsultasService } from '../consultas.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-informe-mensual',
  templateUrl: './informe-mensual.component.html',
  styleUrls: ['./informe-mensual.component.scss']
})
export class InformeMensualComponent implements AfterViewInit, OnInit {


  @ViewChild('preview') element!: ElementRef;

  constructor(private informeService: InformeMensualService, private render: Renderer2, private rq: ConsultasService) {

  }


  inputs = new FormGroup({
    fecha: new FormControl(),
    usrs: new FormGroup({
      elavorado: new FormControl(''),
      cargo1: new FormControl(''),
      revisado: new FormControl(''),
      cargo2: new FormControl(''),
      aprobado: new FormControl(''),
      cargo3: new FormControl(''),
    }),
    disponibilidadComentario: new FormGroup({
      web: new FormControl(),
      img: new FormControl(),
      bd: new FormControl(),
      api: new FormControl(),
      computo: new FormControl(),
      sistema: new FormControl(),
      enlace: new FormControl(),
    }),
    confiabilidad: new FormGroup({
      identificacion: new FormControl(),
      clasificacion: new FormControl(),
      comunicacion: new FormControl(),
    }),
    conclusion: new FormControl('')
  })

  dataCriticisadad: any
  dataMatrix: any
  dataUltimosCambiosMatrix: any
  tablaDispo: any
  imgCriticidad: any = []
  comentariosCriticidad: any = []


  ngOnInit(): void {
    this.load()
  }


  load() {

    this.dataCriticisadad = this.rq.getTablaAlertas(10)//cambiar mes
    this.imgCriticidad = new Array(this.dataCriticisadad.length)

    this.rq.getDisponibilidad('noviembre').subscribe(dato => {
      let prom = (dato.servicio_web + dato.servicio_imagenes + dato.servicio_db + dato.servicio_api + dato.servicio_computo) / 5
      let promRound = prom
      this.tablaDispo = {
        infraestructura: promRound?.toFixed(2),
        servicio_web: dato.servicio_web?.toFixed(2),
        servicio_imagenes: dato.servicio_imagenes?.toFixed(2),
        servicio_db: dato.servicio_db?.toFixed(2),
        servicio_api: dato.servicio_api?.toFixed(2),
        servicio_computo: dato.servicio_computo?.toFixed(2),
        sistema_adquisicion_imagenes: dato.sistema_adquisicion_imagenes?.toFixed(2),
        enlace_dedicado: dato.enlace_dedicado?.toFixed(2)
      }

    });//cambiar mes

    this.rq.getMatrix().subscribe(dato => this.dataMatrix = dato)
    this.rq.getUltimosCambiosMatrix().subscribe(dato => this.dataUltimosCambiosMatrix = dato)
  }



  ngAfterViewInit(): void {
    // this.activarInforme()
  }


  loadImg(event: Event, index: number) {
    let file = (event.target as HTMLInputElement).files![0]
    var reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (_event) => {
      this.imgCriticidad[index] = reader.result
    }
  }

  loadComentarios(event: Event, index: number, criticidad: number) {
    let res = (event.target as HTMLInputElement).value
    this.comentariosCriticidad.push({
      id: criticidad,
      comentario: res
    })
  }

  activarInforme() {
    this.informeService.onPrevizualizar(this.dataCriticisadad, this.dataMatrix, this.dataUltimosCambiosMatrix, this.tablaDispo, this.imgCriticidad, this.comentariosCriticidad, this.inputs)
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
