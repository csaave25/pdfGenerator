import { Component, ElementRef, ViewChild } from '@angular/core';
import { GeneradorService } from '../generador.service';
import { FormControl, FormGroup } from '@angular/forms';


@Component({
    selector: 'app-reporte-tronadura',
    templateUrl: './reporte-tronadura.component.html',
    styleUrls: ['./reporte-tronadura.component.scss']
})
export class ReporteTronaduraComponent {

    @ViewChild('punto') puntoElemento!: ElementRef

    constructor(private servicio: GeneradorService) {

    }

    contadorPunto = 1
    contadorRadar = 1

    inputs = new FormGroup({
        fecha: new FormControl(''),
        hora:  new FormControl(''),
        comentarios: new FormControl(''),
        zonaMonitoreo: new FormControl(''),
        pared: new FormControl(''),
        este: new FormControl(0),
        norte: new FormControl(0),
        cota: new FormControl(0),
        produccion: new FormControl(false),
        precorte: new FormControl(false),
        destape: new FormControl(false),
        bolones: new FormControl(false),
        desquinche: new FormControl(false),
        contorno: new FormControl(false),
        pozosProduccion: new FormControl(0),
        pozosPrecorte: new FormControl(0),
        volumen: new FormControl(0),
        factorCarga: new FormControl(0),
        graficosDVT: new FormControl(),
        aPanoramica: new FormControl(''),
        dPanoramica: new FormControl(''),
        aZoom: new FormControl(''),
        dZoom: new FormControl(''),
        aSuperior: new FormControl(''),
        dSuperior: new FormControl(''),
        aInferior: new FormControl(''),
        dInferior: new FormControl(''),
    })

    imagenesDVT: any[] = []


    visualizarImagenCargada(name: string, event: Event) {
        let element = (event.target as HTMLInputElement)
        let reader = new FileReader();

        if (element.files) {
            reader.readAsDataURL(element.files[0]);
            reader.onload = (_event) => {
                if (typeof (reader.result) == 'string') {
                    (element.nextElementSibling?.children[0] as HTMLImageElement).classList.remove('d-none');
                    (element.nextElementSibling?.children[0] as HTMLImageElement).classList.add('d-inline');
                    (element.nextElementSibling?.children[0] as HTMLImageElement).src = reader.result
                }
                this.inputs.get(name)?.setValue(reader.result);

            }
        }

    }

    agregarPuntoDeControl() {

        let id = this.contadorPunto
        let template = `<div id="punto-${id}" style="background-color: #e0e3e3cf;" class="px-2 pt-2 my-4">
    <div class="d-flex justify-content-between ">
        <h5>Imagen</h5>
        <button id="eliminarPunto-${id}" type="button" class="btn btn-danger btn-floating btn-sm" mdbRipple>
            <i class="fas fa-trash"></i>
        </button>
    </div>
    <div class="col-5">
        <label class="form-label" for="customFile">Gráfico de desplazamientos Vs. tiempo</label>
        <input id="inputImg-${id}" type="file" class="form-control form-control-sm " id="customFile" />
        <div class="mt-2" style="width: 330px; height: 220px;">
            <img class="d-none" id="img-${id}" style="width: 330px; height: 220px;" src="#" alt="Gráfico de desplazamientos Vs. tiempo">
        </div>
    </div>
    <div class="d-flex justify-content-between mt-2">
        <h5>Lecturas Radares</h5>
    </div>
    <div id="radares-${id}"></div>
    
    <div class="d-flex justify-content-end">
        <button id="btn-${id}" type="button" class="btn btn-sm mt-3 mb-2"
            style="background-color: #00838F; color: #eeefef" mdbRipple>Agregar Lectura
            Radar</button>
    </div>
    </div>`

        let elemento: HTMLElement = this.puntoElemento.nativeElement
        let newElement = document.createElement('div')
        newElement.innerHTML = template
        elemento.appendChild(newElement)
        elemento.querySelector("#btn-" + id)?.addEventListener('click', () => this.agregarRadar(id))
        elemento.querySelector("#eliminarPunto-" + id)?.addEventListener('click', () => this.eliminarElemento(newElement, true, id))
        elemento.querySelector(`#inputImg-${id}`)?.addEventListener('change', (event) => this.visualizarImganesArr(event, id))
        this.contadorPunto++

    }

    visualizarImganesArr(event: Event, id: number) {
        let element = (event.target as HTMLInputElement)
        let imgElement = (element.nextElementSibling?.children[0] as HTMLImageElement)
        imgElement.classList.remove('d-none')
        imgElement.classList.remove('d-inline')
        let reader = new FileReader();
        let file = element.files![0]

        if (file) {
            reader.readAsDataURL(file);
            reader.onload = (_event) => {
                if (typeof (reader.result) == 'string')
                    imgElement.src = reader.result
                let valGrafico = this.imagenesDVT.findIndex(dato => dato.id == id)

                if (valGrafico == -1) {
                    this.imagenesDVT.push({
                        id,
                        img: reader.result,
                        radares: [] as any[],
                    })
                } else {
                    this.imagenesDVT[valGrafico].img = reader.result
                }
            }
        }

    }


    agregarRadar(idPunto: number) {
        let idP = idPunto
        let id = this.contadorRadar
        let elemento = document.querySelector("#radares-" + idP)
        let template = `<div id="radar-${id}" style="background-color: #f9f9f9;" class="mt-2 p-2 rounded-2">
      <div class="d-flex flex-column">
          <div class="d-flex justify-content-between">
              <label>Radar</label>
              <button id="eliminarRadar-${id}" type="button" class="btn btn-warning btn-floating btn-sm" mdbRipple>
                  <i class="fas fa-trash"></i>
              </button>
          </div>
          <select id="radarOption-${id}" style="width: 174px; height: 30px;" class="rounded-2">
              <option value="" hidden=""></option>
              <option value="Radar IBIS-2">Radar IBIS-2</option>
              <option value="Radar IBIS-3">Radar IBIS-3</option>
              <option value="Radar IBIS-4">Radar IBIS-4</option>
              <option value="Radar IBIS-5">Radar IBIS-5</option>
              <option value="Radar IBIS-6">Radar IBIS-6</option>
              <option value="Radar IBIS-7">Radar IBIS-7</option>
              <option value="Radar IBIS-8">Radar IBIS-8</option>
              <option value="Radar IBIS-9">Radar IBIS-9</option>
          </select>
      </div>
      <div class="d-flex gap-4 mt-2">
          <div class="d-flex flex-column">
              <label mdbLabel id="Este">Este</label>
              <mdb-form-control>
                  <input  mdbInput type="number" id="este-${id}" class="form-control-sm"
                      style="background-color: #ffffff;" />
              </mdb-form-control>
          </div>
          <div class="d-flex flex-column">
              <label mdbLabel id="norte">Norte</label>
              <mdb-form-control>
                  <input mdbInput type="number" id="norte-${id}" class="form-control-sm"
                      style="background-color: #ffffff;" />
              </mdb-form-control>
          </div>
          <div class="d-flex flex-column">
              <label mdbLabel id="cota">Cota</label>
              <mdb-form-control>
                  <input mdbInput type="number" id="cota-${id}" class="form-control-sm"
                      style="background-color: #ffffff;" />
              </mdb-form-control>
          </div>
      </div>
      <div class="d-flex gap-4 mt-2">
          <div style="width: 276px;">
              <label mdbLabel >Desplazamiento Últimas 12 hrs.</label>
              <mdb-form-control>
                  <input mdbInput type="number" id="desplazamiento-${id}"
                      class="form-control-sm col-12" style="background-color: #ffffff;" />
              </mdb-form-control>
          </div>
          <div style="width: 276px;">
              <label mdbLabel >Velocidad Promedio Últimas 12 hrs.</label>
              <mdb-form-control>
                  <input mdbInput type="number" id="velocidad-${id}"class="form-control-sm  col-12"
                      style="background-color: #ffffff;" />
              </mdb-form-control>
          </div>
      </div>
    </div>`

        let newElement = document.createElement('div')
        newElement.innerHTML = template
        elemento?.appendChild(newElement)
        elemento?.querySelector("#eliminarRadar-" + id)?.addEventListener('click', () => this.eliminarElemento(newElement, false, idP, id))
        elemento?.querySelector("#radarOption-" + id)?.addEventListener('change', (e) => this.guardarRadar(idP, id, 1, e))
        elemento?.querySelector("#este-" + id)?.addEventListener('change', (e) => this.guardarRadar(idP, id, 2, e))
        elemento?.querySelector("#norte-" + id)?.addEventListener('change', (e) => this.guardarRadar(idP, id, 3, e))
        elemento?.querySelector("#cota-" + id)?.addEventListener('change', (e) => this.guardarRadar(idP, id, 4, e))
        elemento?.querySelector("#desplazamiento-" + id)?.addEventListener('change', (e) => this.guardarRadar(idP, id, 5, e))
        elemento?.querySelector("#velocidad-" + id)?.addEventListener('change', (e) => this.guardarRadar(idP, id, 6, e))

        this.contadorRadar++
    }

    guardarRadar(id: number, idRadar: number, n: number, evt: Event) {

        let valor = (evt.target as HTMLInputElement).value
        let valGrafico = this.imagenesDVT.findIndex(dato => dato.id == id)

        if (valGrafico == -1) {
            switch (n) {
                case 1: this.imagenesDVT.push({
                    id,
                    img: '',
                    radares: [{ id: idRadar, radar: valor }] as any[],
                })
                    break;
                case 2: this.imagenesDVT.push({
                    id,
                    img: '',
                    radares: [{ id: idRadar, este: valor }] as any[],
                })
                    break;
                case 3: this.imagenesDVT.push({
                    id,
                    img: '',
                    radares: [{ id: idRadar, norte: valor }] as any[],
                })
                    break;
                case 4: this.imagenesDVT.push({
                    id,
                    img: '',
                    radares: [{ id: idRadar, cota: valor }] as any[],
                })
                    break;
                case 5: this.imagenesDVT.push({
                    id,
                    img: '',
                    radares: [{ id: idRadar, desplazamiento: valor }] as any[],
                })
                    break;
                case 6: this.imagenesDVT.push({
                    id,
                    img: '',
                    radares: [{ id: idRadar, velocidad: valor }] as any[],
                })
                    break;
            }

        } else {

            let valRadar = this.imagenesDVT[valGrafico].radares.findIndex((dato: any) => dato.id == idRadar)


            if (valRadar == -1) {

                switch (n) {
                    case 1: this.imagenesDVT[valGrafico].radares.push({ id: idRadar, radar: valor })
                        break;
                    case 2: this.imagenesDVT[valGrafico].radares.push({ id: idRadar, este: valor })
                        break;
                    case 3: this.imagenesDVT[valGrafico].radares.push({ id: idRadar, norte: valor })
                        break;
                    case 4: this.imagenesDVT[valGrafico].radares.push({ id: idRadar, cota: valor })
                        break;
                    case 5: this.imagenesDVT[valGrafico].radares.push({ id: idRadar, desplazamiento: valor })
                        break;
                    case 6: this.imagenesDVT[valGrafico].radares.push({ id: idRadar, velocidad: valor })
                        break;
                }
            } else {

                switch (n) {
                    case 1: this.imagenesDVT[valGrafico].radares[valRadar] = { ...this.imagenesDVT[valGrafico].radares[valRadar], radar: valor }
                        break;
                    case 2: this.imagenesDVT[valGrafico].radares[valRadar] = { ...this.imagenesDVT[valGrafico].radares[valRadar], este: valor }
                        break;
                    case 3: this.imagenesDVT[valGrafico].radares[valRadar] = { ...this.imagenesDVT[valGrafico].radares[valRadar], norte: valor }
                        break;
                    case 4: this.imagenesDVT[valGrafico].radares[valRadar] = { ...this.imagenesDVT[valGrafico].radares[valRadar], cota: valor }
                        break;
                    case 5: this.imagenesDVT[valGrafico].radares[valRadar] = { ...this.imagenesDVT[valGrafico].radares[valRadar], desplazamiento: valor }
                        break;
                    case 6: this.imagenesDVT[valGrafico].radares[valRadar] = { ...this.imagenesDVT[valGrafico].radares[valRadar], velocidad: valor }
                        break;
                }
            }
        }

    }

    eliminarElemento(elemento: HTMLElement, operacion: boolean, idGrafo: number, idRadar?: number) {
        if (operacion) {
            this.imagenesDVT = this.imagenesDVT.filter(dato => dato.id != idGrafo)
        } else {
            let valGrafico = this.imagenesDVT.findIndex(dato => dato.id == idGrafo)
            if (this.imagenesDVT[valGrafico]) {
                let valRadar = this.imagenesDVT[valGrafico].radares.findIndex((dato: any) => dato.id == idRadar)
                if (valRadar != -1) {
                    this.imagenesDVT[valGrafico].radares = this.imagenesDVT[valGrafico].radares.filter((dato: any) => dato.id != idRadar)
                }
            }

        }

        elemento.remove()
    }

    previsualizar() {
        this.inputs.get('graficosDVT')?.setValue(this.imagenesDVT)
        this.servicio.previsualizarPDF(this.inputs)
    }

}
