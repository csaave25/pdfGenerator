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
  @ViewChild('matriz') matriz!: ElementRef;
  @ViewChild('matrizImagenes') matrizImagenes!: ElementRef;


  constructor(private informeService: InformeService, private render: Renderer2, private rq: ApiService) { }


  inputs = new FormGroup({
    fecha: new FormControl(),
    usrs: new FormGroup({
      elaborado: new FormControl('CONSTANZA SARRÍA'),
      cargo1: new FormControl('INGENIERO GEOTÉCNICO MCM'),
      revisado: new FormControl('LEONARDO ZAHR'),
      cargo2: new FormControl('LÍDER MCM-AMSA'),
      aprobado: new FormControl('LEONARDO ZAHR'),
      cargo3: new FormControl('LÍDER MCM'),
    }),
    disponibilidadComentario: new FormGroup({
      infraEMT: new FormControl(''),
      infraANT: new FormControl(''),
      enlaceObs: new FormControl(''),
      web: new FormControl(''),
      img: new FormControl(''),
      bd: new FormControl(''),
      api: new FormControl(''),
      computo: new FormControl(''),
      sistema: new FormControl(''),
      enlace: new FormControl(''),
    }),
    confiabilidad: new FormGroup({
      identificacion: new FormControl(0),
      clasificacion: new FormControl(0),
      comunicacion: new FormControl(0),
      promedioConfia: new FormControl(0),
    }),
    conclusion: new FormControl('')
  })

  dataCriticisadad: any

  tablaDispo: any
  comentariosCriticidad: any = []
  promedioTablaDispo: number = 0
  numTemplate = 0
  numImagen = 0
  numTemplateMatriz = 0
  numImagenMatriz = 0
  dataMatrix: any[] = []
  imgCriticidad: any = []
  comentariosImagenes: any[] = []
  comentariosImagenesMatriz: any[] = []

  hoy: any = ""




  ngOnInit(): void {
    this.loadLocalStorage()
    this.inputs.get('confiabilidad.promedioConfia')?.disable()
    let date = new Date()
    this.hoy = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2)
  }

  calcularPromedioConfiabilidad() {
    let uno = this.inputs.get('confiabilidad.identificacion')?.value!
    let dos = this.inputs.get('confiabilidad.clasificacion')?.value!
    let tres = this.inputs.get('confiabilidad.comunicacion')?.value!
    let promedio = (uno + dos + tres) / 3
    this.inputs.get('confiabilidad.promedioConfia')?.setValue(promedio)
  }

  loadLocalStorage() {
    let data = localStorage.getItem('data')
    if (data) {
      let datos = JSON.parse(data)
      this.inputs.get('fecha')?.setValue(datos.inputs.fecha)
      this.inputs.get('usrs.elaborado')?.setValue(datos.inputs.usrs.elaborado)
      this.inputs.get('usrs.cargo1')?.setValue(datos.inputs.usrs.cargo1)
      this.inputs.get('usrs.revisado')?.setValue(datos.inputs.usrs.revisado)
      this.inputs.get('usrs.cargo2')?.setValue(datos.inputs.usrs.cargo2)
      this.inputs.get('usrs.aprobado')?.setValue(datos.inputs.usrs.aprobado)
      this.inputs.get('usrs.cargo3')?.setValue(datos.inputs.usrs.cargo3)
      this.inputs.get('disponibilidadComentario.infraEMT')?.setValue(datos.inputs.disponibilidadComentario.infraEMT)
      this.inputs.get('disponibilidadComentario.web')?.setValue(datos.inputs.disponibilidadComentario.web)
      this.inputs.get('disponibilidadComentario.img')?.setValue(datos.inputs.disponibilidadComentario.img)
      this.inputs.get('disponibilidadComentario.bd')?.setValue(datos.inputs.disponibilidadComentario.bd)
      this.inputs.get('disponibilidadComentario.api')?.setValue(datos.inputs.disponibilidadComentario.api)
      this.inputs.get('disponibilidadComentario.computo')?.setValue(datos.inputs.disponibilidadComentario.computo)
      this.inputs.get('disponibilidadComentario.infraANT')?.setValue(datos.inputs.disponibilidadComentario.infraANT)
      this.inputs.get('disponibilidadComentario.sistema')?.setValue(datos.inputs.disponibilidadComentario.sistema)
      this.inputs.get('disponibilidadComentario.enlaceObs')?.setValue(datos.inputs.disponibilidadComentario.enlaceObs)
      this.inputs.get('disponibilidadComentario.enlace')?.setValue(datos.inputs.disponibilidadComentario.enalce)
      this.inputs.get('confiabilidad.identificacion')?.setValue(datos.inputs.confiabilidad.identificacion)
      this.inputs.get('confiabilidad.clasificacion')?.setValue(datos.inputs.confiabilidad.clasificacion)
      this.inputs.get('confiabilidad.comunicacion')?.setValue(datos.inputs.confiabilidad.comunicacion)
      this.inputs.get('conclusion')?.setValue(datos.inputs.conclusion)



      this.loadTablas()
    }
  }

  saveOnLocalStorage() {
    let datos = {
      inputs: {
        fecha: this.inputs.get('fecha')?.value,
        usrs: {
          elaborado: this.inputs.get('usrs.elaborado')?.value,
          cargo1: this.inputs.get('usrs.cargo1')?.value,
          revisado: this.inputs.get('usrs.revisado')?.value,
          cargo2: this.inputs.get('usrs.cargo2')?.value,
          aprobado: this.inputs.get('usrs.aprobado')?.value,
          cargo3: this.inputs.get('usrs.cargo3')?.value,
        },
        disponibilidadComentario: {
          infraEMT: this.inputs.get('disponibilidadComentario.infraEMT')?.value,
          infraANT: this.inputs.get('disponibilidadComentario.infraANT')?.value,
          web: this.inputs.get('disponibilidadComentario.web')?.value,
          enlaceObs: this.inputs.get('disponibilidadComentario.enlaceObs')?.value,
          img: this.inputs.get('disponibilidadComentario.img')?.value,
          bd: this.inputs.get('disponibilidadComentario.bd')?.value,
          api: this.inputs.get('disponibilidadComentario.api')?.value,
          computo: this.inputs.get('disponibilidadComentario.computo')?.value,
          sistema: this.inputs.get('disponibilidadComentario.sistema')?.value,
          enlace: this.inputs.get('disponibilidadComentario.enlace')?.value,
        },
        confiabilidad: {
          identificacion: this.inputs.get('confiabilidad.identificacion')?.value,
          clasificacion: this.inputs.get('confiabilidad.clasificacion')?.value,
          comunicacion: this.inputs.get('confiabilidad.comunicacion')?.value
        },
        conclusion: this.inputs.get('conclusion')?.value
      },

      tablaDispo: this.tablaDispo,
      imgCriticidad: this.imgCriticidad,
      comentariosCriticidad: this.comentariosCriticidad,
      promedioTablaDispo: this.promedioTablaDispo,
      comentariosImagenes: this.comentariosImagenes,
      numTemplate: this.numTemplate,
      numImagen: this.numImagen
    }

    localStorage.setItem('data', JSON.stringify(datos))
  }

  loadTablas() {
    this.limpiarVariables()

    this.loadGrietasCriticidad()
    this.loadDisponibilidad()
    this.loadConfiabilidad()
    this.loadMatriz()
  }

  loadGrietasCriticidad() {
    let fecha = this.inputs.get('fecha')?.value.replaceAll("-", "/")
    let mes = new Date(fecha).getMonth() + 1

    this.dataCriticisadad = this.rq.getTablaAlertas(mes)
    this.imgCriticidad = new Array(this.dataCriticisadad.length)

  }

  loadConfiabilidad() {
    let fecha = this.inputs.get('fecha')?.value.replace("-", "/")
    let mes = new Date(fecha).toLocaleString('default', { month: 'long' })
    let ano = new Date(fecha).getFullYear()
    this.rq.getToken().subscribe(data => {
      let token = data.token
      this.rq.getConfiabilidad(mes, ano, token).subscribe(data => {
        this.inputs.get('confiabilidad.identificacion')?.setValue(data.objects[0].identification)
        this.inputs.get('confiabilidad.clasificacion')?.setValue(data.objects[0].classification)
        this.inputs.get('confiabilidad.comunicacion')?.setValue(data.objects[0].communication)
        this.calcularPromedioConfiabilidad()

      })
    })
  }

  loadDisponibilidad() {
    let fecha = this.inputs.get('fecha')?.value.replace("-", "/")
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

  loadMatriz() {
    let str: string = this.inputs.get('fecha')?.value
    str = str.replaceAll("-", "/")
    let fecha = new Date(str)
    let ano = fecha.getFullYear()
    let mes = ('0' + (fecha.getMonth() + 1)).slice(-2)
    this.rq.getTablaMatrix(mes, ano).subscribe((data) => {
      data.objects.forEach((elm: any) => {
        this.dataMatrix.push(elm)
      })

    })
  }

  loadMatrizComentario() {
    let num = this.numTemplateMatriz
    let template = `
      <div id="template-matriz-${num}">
        <mdb-form-control class="col-12 mt-5">
          <div class="my-2 d-flex justify-content-between">
            <label mdbLabel class="form-label"
                for="comentarioImagenes">Comentario</label>
            <button id="eliminarComentarioMatriz" type="button" class="btn btn-danger "  mdbRipple>
                <i class="fas fa-trash" size="sm"></i>
            </button>
         </div>
         <textarea mdbInput class="form-control"
            id="comentarioImagenesMatriz" rows="4" ></textarea>
        </mdb-form-control>
      
        <div class="mt-3">
          <div id="contenedorImg-matriz-${this.numTemplateMatriz}">
          </div>
          <button id="imagenMatriz" type="button" style="background-color: #00838F; color: #fbfbfb" class="btn btn-sm mt-2 mb-4" mdbRipple> Añadir Imagen
          </button>
        </div>
      </div>`

    let newElement = document.createElement('div')
    newElement.innerHTML = template
    let elemento: HTMLElement = this.matriz.nativeElement
    elemento.appendChild(newElement)
    newElement.querySelector('#imagenMatriz')?.addEventListener('click', () => this.loadTemplateImagenesMatriz(num))
    newElement.querySelector('#comentarioImagenesMatriz')?.addEventListener('change', (event) => this.saveComentarioMatriz(event, num))
    newElement.querySelector('#eliminarComentarioMatriz')?.addEventListener('click', (event) => this.eliminarComentarioMatriz(event, num))

    this.numTemplateMatriz++

  }

  loadTemplateComentarios() {
    let num = this.numTemplate
    let template = `
      <div id="template${num}">
        <mdb-form-control class="col-12 mt-5">
          <div class="my-2 d-flex justify-content-between">
            <label mdbLabel class="form-label"
                for="comentarioImagenes">Comentario</label>
            <button id="eliminarComentario" type="button" class="btn btn-danger "  mdbRipple>
                <i class="fas fa-trash" size="sm"></i>
            </button>
         </div>
         <textarea mdbInput class="form-control"
            id="comentarioImagenes" rows="4" ></textarea>
        </mdb-form-control>
      
        <div class="mt-3">
          <div id="contenedorImg${this.numTemplate}">
          </div>
          <button id="imagen" type="button" style="background-color: #00838F; color: #fbfbfb" class="btn btn-sm mt-2 mb-4" mdbRipple> Añadir Imagen
          </button>
        </div>
      </div>`
    let newElement = document.createElement('div')
    newElement.innerHTML = template
    let elemento: HTMLElement = this.templateComentario.nativeElement
    elemento.appendChild(newElement)
    newElement.querySelector('#imagen')?.addEventListener('click', () => this.loadTemplateImagenes(num))
    newElement.querySelector('textarea')?.addEventListener('change', (event) => this.saveComentario(event, num))
    newElement.querySelector('#eliminarComentario')?.addEventListener('click', (event) => this.eliminarComentario(event, num))
    this.numTemplate++

  }
  eliminarComentario(event: Event, num: number) {
    let element = document.querySelector('#template' + num)
    element?.remove()
    this.comentariosImagenes = this.comentariosImagenes.filter(dato => dato.num != num)
  }
  eliminarComentarioMatriz(event: Event, num: number) {
    let element = document.querySelector('#template-matriz-' + num)
    element?.remove()
    this.comentariosImagenesMatriz = this.comentariosImagenesMatriz.filter(dato => dato.num != num)
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

  saveComentarioMatriz(event: Event, num: number) {
    event.preventDefault()
    let elemento = event.target as HTMLInputElement
    let validator = this.comentariosImagenesMatriz.findIndex(dato => dato.num == num)
    if (validator == -1) {
      this.comentariosImagenesMatriz.push({
        num,
        comentario: elemento.value,
        imagenes: [] as any[],
      })
    } else {
      this.comentariosImagenesMatriz[validator].comentario = elemento.value
    }
  }

  loadTemplateImagenes(id: number) {
    let idImagen = this.numImagen
    let template = `<div class="mt-4" id="imagen${idImagen}">
                    <div class="d-flex justify-content-between my-2">
                      <div class="">
                      </div>
                      <button type="button" class="btn btn-danger ms-2"  mdbRipple>
                        <i class="fas fa-trash" size="sm"></i>
                      </button>
                    </div>
                    <input type="file" class="form-control" id="customFile" />
                    <div class="border col-12" style="height: 300px;">
                        <img src="#" height="300" class="col-12">
                    </div>
                    <div class="mt-2">
                      <label mdbLabel class="form-label" for="figura${idImagen}" >Nombre Figura</label>
                      <input mdbInput type="text" id="figura${idImagen}" class="form-control"/>
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
    newElement.querySelector('input')?.addEventListener('change', (event) => this.saveImagenes(event, id, img, idImg))
    newElement.querySelector('button')?.addEventListener('click', (event) => this.eliminarImagen(event, id, idImagen))

    this.numImagen++
  }


  loadTemplateImagenesMatriz(id: number) {
    let idImagen = this.numImagenMatriz
    let template = `<div class="mt-4" id="imagen-matriz-${idImagen}">
                    <div class="d-flex justify-content-between my-2">
                      <div class="">
                      </div>
                      <button id="btn-${idImagen}" type="button" class="btn btn-danger ms-2"  mdbRipple>
                        <i class="fas fa-trash" size="sm"></i>
                      </button>
                    </div>
                    <input type="file" class="form-control" id="customFile" />
                    <div class="border col-12" style="height: 400px;">
                        <img src="#" height="400" class="col-12">
                    </div>
                    <div class="mt-2">
                      <label mdbLabel class="form-label" for="figura-matriz-${idImagen}" >Nombre Figura</label>
                      <input mdbInput type="text" id="figura-matriz-${idImagen}" class="form-control"/>
                    </div>
                </div>`

    let newElement = document.createElement('div')
    newElement.innerHTML = template
    let serachId = "contenedorImg-matriz-" + id
    let elemento: HTMLElement = document.getElementById(serachId)!
    elemento.appendChild(newElement)


    let img = newElement.querySelector('img')!
    let idImg = this.numImagenMatriz
    let nomFigura = newElement.querySelector('#figura-matriz-' + this.numImagenMatriz)!

    nomFigura.addEventListener('change', (event) => { this.saveNomFigMatriz(event, id, idImg) })
    newElement.querySelector('input')?.addEventListener('change', (event) => this.saveImagenesMatriz(event, id, img, idImg))
    newElement.querySelector(`#btn-${idImagen}`)?.addEventListener('click', (event) => this.eliminarImagenMatriz(event, id, idImagen))

    this.numImagenMatriz++
  }

  eliminarImagen(event: Event, id: number, num: number) {
    let element = document.querySelector('#imagen' + num)!
    let index = this.comentariosImagenes.findIndex(data => data.num == id)
    if (index != -1) {
      let imagenes = this.comentariosImagenes[index].imagenes
      this.comentariosImagenes[index].imagenes = imagenes.filter((data: any) => data.id != num)
    }
    element?.remove()
  }

  eliminarImagenMatriz(event: Event, id: number, num: number) {


    let element = document.querySelector('#imagen-matriz-' + num)!

    let index = this.comentariosImagenesMatriz.findIndex(data => data.num == id)
    if (index != -1) {
      let imagenes = this.comentariosImagenesMatriz[index].imagenes
      this.comentariosImagenesMatriz[index].imagenes = imagenes.filter((data: any) => data.id != num)

    }
    element?.remove()

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

        let validador = this.comentariosImagenes[validator].imagenes.findIndex((dato: any) => dato.id == idImg)

        if (validador == -1) {
          this.comentariosImagenes[validator].imagenes.push({ id: idImg, img: reader.result, nomFigura: '' })
        } else {
          let elm = this.comentariosImagenes[validator].imagenes[validador]
          elm.img = reader.result
        }


      }
    }


  }

  saveImagenesMatriz(event: Event, index: number, imgElm: HTMLImageElement, idImg: number) {
    let element = (event.target as HTMLInputElement)
    imgElm.src = URL.createObjectURL(element.files![0]);
    imgElm.onload = function () {
      URL.revokeObjectURL(imgElm.src) // free memory
    }

    let file = element.files![0]
    var reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (_event) => {

      let validator = this.comentariosImagenesMatriz.findIndex(dato => dato.num == index)

      if (validator == -1) {
        this.comentariosImagenesMatriz.push({
          num: index,
          comentario: '',
          imagenes: [{ id: idImg, img: reader.result, nomFigura: '' }] as any[],
        })
      } else {

        let validador = this.comentariosImagenesMatriz[validator].imagenes.findIndex((dato: any) => dato.id == idImg)

        if (validador == -1) {
          this.comentariosImagenesMatriz[validator].imagenes.push({ id: idImg, img: reader.result, nomFigura: '' })
        } else {
          let elm = this.comentariosImagenesMatriz[validator].imagenes[validador]
          elm.img = reader.result
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
        imagenes: [{ id: idImg, img: '', nomFigura: nomFig }] as any[],
      })
    } else {
      let validador = this.comentariosImagenes[validator].imagenes.findIndex((dato: any) => dato.id == idImg)
      if (validador == -1) {
        this.comentariosImagenes[validator].imagenes.push({ id: idImg, img: '', nomFigura: nomFig })
      } else {
        this.comentariosImagenes[validator].imagenes[validador].nomFigura = nomFig
      }

    }

  }

  saveNomFigMatriz(event: Event, index: number, idImg: number) {
    let nomFig = (event.target as HTMLInputElement).value
    let validator = this.comentariosImagenesMatriz.findIndex(dato => dato.num == index)
    if (validator == -1) {
      this.comentariosImagenesMatriz.push({
        num: index,
        comentario: '',
        imagenes: [{ id: idImg, img: '', nomFigura: nomFig }] as any[],
      })
    } else {
      let validador = this.comentariosImagenesMatriz[validator].imagenes.findIndex((dato: any) => dato.id == idImg)
      if (validador == -1) {
        this.comentariosImagenesMatriz[validator].imagenes.push({ id: idImg, img: '', nomFigura: nomFig })
      } else {
        this.comentariosImagenesMatriz[validator].imagenes[validador].nomFigura = nomFig
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

  limpiarVariables() {
    this.dataMatrix = []

  }

  activarInforme() {
    this.informeService.onPrevizualizar(this.dataCriticisadad, this.dataMatrix, this.tablaDispo, this.imgCriticidad, this.comentariosCriticidad, this.inputs, this.comentariosImagenes, this.comentariosImagenesMatriz)
    this.saveOnLocalStorage()





  }

  descargaCliente() {
    this.informeService.descargaCliente(this.dataCriticisadad, this.dataMatrix, this.tablaDispo, this.imgCriticidad, this.comentariosCriticidad, this.inputs, this.comentariosImagenes, this.comentariosImagenesMatriz)
    this.saveOnLocalStorage()
  }



}


