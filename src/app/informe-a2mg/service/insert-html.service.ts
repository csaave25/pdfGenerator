import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InsertHTMLService {

  constructor() { }

  private numTemplateImagenes: number = 0
  private numTemplateMatriz: number = 0
  private numImagenMatriz: number = 0
  private numTemplate: number = 0
  private numImagen: number = 0

  loadMatrizComentario(htmlElement: HTMLElement, comentariosImagenesMatriz: any[]) {
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
    let elemento: HTMLElement = htmlElement
    elemento.appendChild(newElement)
    newElement.querySelector('#imagenMatriz')?.addEventListener('click', () => this.loadTemplateImagenesMatriz(num, comentariosImagenesMatriz))
    newElement.querySelector('#comentarioImagenesMatriz')?.addEventListener('change', (event) => this.saveComentarioMatriz(event, num, comentariosImagenesMatriz))
    newElement.querySelector('#eliminarComentarioMatriz')?.addEventListener('click', (event) => this.eliminarComentarioMatriz(event, num, comentariosImagenesMatriz))

    this.numTemplateMatriz++

  }

  eliminarComentarioMatriz(event: Event, num: number, comentariosImagenesMatriz: any[]) {
    let element = document.querySelector('#template-matriz-' + num)
    element?.remove()
    comentariosImagenesMatriz = comentariosImagenesMatriz.filter(dato => dato.num != num)
  }

  saveComentarioMatriz(event: Event, num: number, comentariosImagenesMatriz: any[]) {
    event.preventDefault()
    let elemento = event.target as HTMLInputElement
    let validator = comentariosImagenesMatriz.findIndex(dato => dato.num == num)
    if (validator == -1) {
      comentariosImagenesMatriz.push({
        num,
        comentario: elemento.value,
        imagenes: [] as any[],
      })
    } else {
      comentariosImagenesMatriz[validator].comentario = elemento.value
    }
  }


  loadTemplateImagenesMatriz(id: number, comentariosImagenesMatriz: any[]) {
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

    nomFigura.addEventListener('change', (event) => { this.saveNomFigMatriz(event, id, idImg, comentariosImagenesMatriz) })
    newElement.querySelector('input')?.addEventListener('change', (event) => this.saveImagenesMatriz(event, id, img, idImg, comentariosImagenesMatriz))
    newElement.querySelector(`#btn-${idImagen}`)?.addEventListener('click', (event) => this.eliminarImagenMatriz(event, id, idImagen, comentariosImagenesMatriz))

    this.numImagenMatriz++
  }


  eliminarImagenMatriz(event: Event, id: number, num: number, comentariosImagenesMatriz: any[]) {
    let element = document.querySelector('#imagen-matriz-' + num)!

    let index = comentariosImagenesMatriz.findIndex(data => data.num == id)
    if (index != -1) {
      let imagenes = comentariosImagenesMatriz[index].imagenes
      comentariosImagenesMatriz[index].imagenes = imagenes.filter((data: any) => data.id != num)

    }
    element?.remove()

  }

  saveNomFigMatriz(event: Event, index: number, idImg: number, comentariosImagenesMatriz: any[]) {
    let nomFig = (event.target as HTMLInputElement).value
    let validator = comentariosImagenesMatriz.findIndex(dato => dato.num == index)
    if (validator == -1) {
      comentariosImagenesMatriz.push({
        num: index,
        comentario: '',
        imagenes: [{ id: idImg, img: '', nomFigura: nomFig }] as any[],
      })
    } else {
      let validador = comentariosImagenesMatriz[validator].imagenes.findIndex((dato: any) => dato.id == idImg)
      if (validador == -1) {
        comentariosImagenesMatriz[validator].imagenes.push({ id: idImg, img: '', nomFigura: nomFig })
      } else {
        comentariosImagenesMatriz[validator].imagenes[validador].nomFigura = nomFig
      }
    }
  }


  saveImagenesMatriz(event: Event, index: number, imgElm: HTMLImageElement, idImg: number, comentariosImagenesMatriz: any[]) {
    let element = (event.target as HTMLInputElement)
    imgElm.src = URL.createObjectURL(element.files![0]);
    imgElm.onload = function () {
      URL.revokeObjectURL(imgElm.src) // free memory
    }

    let file = element.files![0]
    var reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (_event) => {

      let validator = comentariosImagenesMatriz.findIndex(dato => dato.num == index)

      if (validator == -1) {
        comentariosImagenesMatriz.push({
          num: index,
          comentario: '',
          imagenes: [{ id: idImg, img: reader.result, nomFigura: '' }] as any[],
        })
      } else {

        let validador = comentariosImagenesMatriz[validator].imagenes.findIndex((dato: any) => dato.id == idImg)

        if (validador == -1) {
          comentariosImagenesMatriz[validator].imagenes.push({ id: idImg, img: reader.result, nomFigura: '' })
        } else {
          let elm = comentariosImagenesMatriz[validator].imagenes[validador]
          elm.img = reader.result
        }

      }
    }
  }



  loadTemplateComentarios(templateComentario: HTMLElement, comentariosImagenes: any[]) {
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
    let elemento: HTMLElement = templateComentario
    elemento.appendChild(newElement)
    newElement.querySelector('#imagen')?.addEventListener('click', () => this.loadTemplateImagenes(num,comentariosImagenes))
    newElement.querySelector('textarea')?.addEventListener('change', (event) => this.saveComentario(event, num, comentariosImagenes))
    newElement.querySelector('#eliminarComentario')?.addEventListener('click', (event) => this.eliminarComentario(event, num, comentariosImagenes))
    this.numTemplate++

  }


  loadTemplateImagenes(id: number, comentariosImagenes: any[]) {
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

    nomFigura.addEventListener('change', (event) => { this.saveNomFig(event, id, idImg,comentariosImagenes) })
    newElement.querySelector('input')?.addEventListener('change', (event) => this.saveImagenes(event, id, img, idImg ,comentariosImagenes))
    newElement.querySelector('button')?.addEventListener('click', (event) => this.eliminarImagen(event, id, idImagen,comentariosImagenes))

    this.numImagen++
  }


  eliminarComentario(event: Event, num: number, comentariosImagenes: any[]) {
    let element = document.querySelector('#template' + num)
    element?.remove()
    comentariosImagenes = comentariosImagenes.filter(dato => dato.num != num)
  }


  saveComentario(event: Event, num: number, comentariosImagenes: any[]) {
    event.preventDefault()
    let elemento = event.target as HTMLInputElement
    let validator = comentariosImagenes.findIndex(dato => dato.num == num)
    if (validator == -1) {
      comentariosImagenes.push({
        num,
        comentario: elemento.value,
        imagenes: [] as any[],
      })
    } else {
      comentariosImagenes[validator].comentario = elemento.value
    }

  }

  

  eliminarImagen(event: Event, id: number, num: number, comentariosImagenes : any[]) {
    let element = document.querySelector('#imagen' + num)!
    let index = comentariosImagenes.findIndex(data => data.num == id)
    if (index != -1) {
      let imagenes = comentariosImagenes[index].imagenes
      comentariosImagenes[index].imagenes = imagenes.filter((data: any) => data.id != num)
    }
    element?.remove()
  }



  saveImagenes(event: Event, index: number, imgElm: HTMLImageElement, idImg: number, comentariosImagenes : any[]) {
    let element = (event.target as HTMLInputElement)
    imgElm.src = URL.createObjectURL(element.files![0]);
    imgElm.onload = function () {
      URL.revokeObjectURL(imgElm.src) // free memory
    }

    let file = element.files![0]
    var reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (_event) => {

      let validator = comentariosImagenes.findIndex(dato => dato.num == index)

      if (validator == -1) {
        comentariosImagenes.push({
          num: index,
          comentario: '',
          imagenes: [{ id: idImg, img: reader.result, nomFigura: '' }] as any[],
        })
      } else {

        let validador = comentariosImagenes[validator].imagenes.findIndex((dato: any) => dato.id == idImg)

        if (validador == -1) {
          comentariosImagenes[validator].imagenes.push({ id: idImg, img: reader.result, nomFigura: '' })
        } else {
          let elm = comentariosImagenes[validator].imagenes[validador]
          elm.img = reader.result
        }


      }
    }


  }

  

  saveNomFig(event: Event, index: number, idImg: number, comentariosImagenes : any[]) {
    let nomFig = (event.target as HTMLInputElement).value
    let validator = comentariosImagenes.findIndex(dato => dato.num == index)
    if (validator == -1) {
      comentariosImagenes.push({
        num: index,
        comentario: '',
        imagenes: [{ id: idImg, img: '', nomFigura: nomFig }] as any[],
      })
    } else {
      let validador = comentariosImagenes[validator].imagenes.findIndex((dato: any) => dato.id == idImg)
      if (validador == -1) {
        comentariosImagenes[validator].imagenes.push({ id: idImg, img: '', nomFigura: nomFig })
      } else {
        comentariosImagenes[validator].imagenes[validador].nomFigura = nomFig
      }

    }

  }



}
