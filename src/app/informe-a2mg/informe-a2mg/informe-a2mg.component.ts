import { Component, ViewChild, ElementRef, Renderer2, OnInit, ViewChildren } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { InformeService } from '../informe.service';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-informe-a2mg',
  templateUrl: './informe-a2mg.component.html',
  styleUrls: ['./informe-a2mg.component.scss']
})
export class InformeA2mgComponent implements OnInit {


  @ViewChild('preview') element!: ElementRef;
  @ViewChild('templateComentarios') templateComentario!: ElementRef;
  @ViewChildren('imagenes') imagenes!: ElementRef;

  constructor(private informeService: InformeService, private render: Renderer2, private rq: ApiService) { }


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
      identificacion: new FormControl(0),
      clasificacion: new FormControl(0),
      comunicacion: new FormControl(0)
    }),
    conclusion: new FormControl('')
  })

  dataCriticisadad: any
  dataMatrix: any
  tablaDispo: any
  imgCriticidad: any = []
  comentariosCriticidad: any = []
  promedioTablaDispo: number = 0
  numTemplate = 0
  numImagen = 0
  comentariosImagenes: any[] = []


  ngOnInit(): void {

  }

  loadTablas() {
    this.loadGrietasCriticidad()
    this.loadDisponibilidad()
  }

  loadGrietasCriticidad() {
    let fecha = this.inputs.get('fecha')?.value
    let mes = new Date(fecha).getMonth() + 1
    this.dataCriticisadad = this.rq.getTablaAlertas(mes)
    this.imgCriticidad = new Array(this.dataCriticisadad.length)
    // this.rq.getMatrix().subscribe(dato => this.dataMatrix = dato)
  }

  loadDisponibilidad() {
    let fecha = this.inputs.get('fecha')?.value
    let mes = new Date(fecha).toLocaleString('default', { month: 'long' })
    let ano = new Date(fecha).getFullYear()
    let buscar = ano + '/' + mes
    this.rq.getDisponibilidad(buscar).subscribe(dato => {
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
    });
  }

  loadTemplateComentarios() {
    let template = `
      <mdb-form-control class="col-12 mt-5">
        <label mdbLabel class="form-label"
        for="comentarioImagenes">Añadir comentario</label>
        <textarea mdbInput class="form-control"
            id="comentarioImagenes" rows="4" ></textarea>
      </mdb-form-control>
      
      <div class="mt-3">
          <div id="contenedorImg${this.numTemplate}">
          </div>
          <button type="button" style="background-color: #00838F; color: #fbfbfb" class="btn btn-sm mt-2 mb-4" mdbRipple> Añadir Imagen
          </button>
        </div>
    `
    let newElement = document.createElement('div')
    newElement.innerHTML = template
    let elemento: HTMLElement = this.templateComentario.nativeElement
    elemento.appendChild(newElement)
    let num = this.numTemplate
    newElement.querySelector('button')?.addEventListener('click', () => this.loadTemplateImagenes(num))
    newElement.querySelector('textarea')?.addEventListener('change', (event) => this.saveComentario(event, num))
    this.numTemplate++

  }

  saveComentario(event: Event, num: number) {
    event.preventDefault()
    let elemento = event.target as HTMLInputElement
    let validator = this.comentariosImagenes.findIndex(dato => dato.num == num)
    if (validator == -1) {
      this.comentariosImagenes.push({
        num,
        comentario: elemento.value,
        imagenes: [] as any[],
      })
    } else {
      this.comentariosImagenes[validator].comentario = elemento.value
    }

   

  }

  loadTemplateImagenes(id: number) {
    let template = `<div class="mt-4" id="imagen${this.numImagen}">
                    <input type="file" class="form-control" id="customFile" />
                    <div class="border col-12" style="height: 200px;">
                        <img src="#" height="200" class="col-12">
                    </div>
                    <div class="mt-2">
                      <label mdbLabel class="form-label" for="figura${this.numImagen}" >Nombre Figura</label>
                      <input mdbInput type="text" id="figura${this.numImagen}" class="form-control"/>
                    </div>
                </div>`

    let newElement = document.createElement('div')
    newElement.innerHTML = template
    let serachId = "contenedorImg" + id
    let elemento: HTMLElement = document.getElementById(serachId)!
    elemento.appendChild(newElement)


    let img = newElement.querySelector('img')!
    let idImg = this.numImagen
    let nomFigura = newElement.querySelector('#figura' + this.numImagen)!

    nomFigura.addEventListener('change', (event) => { this.saveNomFig(event, id, idImg) })
    newElement.querySelector('input')?.addEventListener('change', (event) => this.saveImagenes(event, id, img,idImg))

    this.numImagen++
  }


  saveImagenes(event: Event, index: number, imgElm: HTMLImageElement, idImg: number) {
    let element = (event.target as HTMLInputElement)
    imgElm.src = URL.createObjectURL(element.files![0]);
    imgElm.onload = function () {
      URL.revokeObjectURL(imgElm.src) // free memory
    }

    let file = element.files![0]
    var reader = new FileReader();
    reader.readAsDataURL(file);

    

    reader.onload = (_event) => {
      let validator = this.comentariosImagenes.findIndex(dato => dato.num == index)
      if (validator == -1) {
        this.comentariosImagenes.push({
          num: index,
          comentario: '',
          imagenes: [{ id: idImg, img: reader.result, nomFigura: '' }] as any[],
        })
      } else {
        let validador = this.comentariosImagenes[index].imagenes.findIndex((dato: any) => dato.id == idImg)
        if (validador == -1) {
          this.comentariosImagenes[index].imagenes.push({ id: idImg, img: reader.result, nomFigura: '' })
        } else {
          let elm =  this.comentariosImagenes[index].imagenes[validador]
          this.comentariosImagenes[index].imagenes[validador].img = reader.result
        }

      }
    }
  }

  saveNomFig(event: Event, index: number, idImg: number) {
    let nomFig = (event.target as HTMLInputElement).value
    let validator = this.comentariosImagenes.findIndex(dato => dato.num == index)
    if (validator == -1) {
      this.comentariosImagenes.push({
        num: index,
        comentario: '',
        imagenes: [{ id: idImg, img: '', nomFigura: '' }] as any[],
      })
    } else {
      let validador = this.comentariosImagenes[index].imagenes.findIndex((dato: any) => dato.id == idImg)
      if (validador == -1) {
        this.comentariosImagenes[index].imagenes.push({ id: idImg, img: '', nomFigura: '' })
      } else {
        this.comentariosImagenes[index].imagenes[validador].nomFigura = nomFig
      }

    }

  

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
    this.informeService.onPrevizualizar(this.dataCriticisadad, this.dataMatrix, this.tablaDispo, this.imgCriticidad, this.comentariosCriticidad, this.inputs, this.comentariosImagenes)
  }

}


