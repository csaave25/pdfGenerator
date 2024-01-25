import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-reporte-tronadura',
  templateUrl: './reporte-tronadura.component.html',
  styleUrls: ['./reporte-tronadura.component.scss']
})
export class ReporteTronaduraComponent {

  @ViewChild('punto') puntoElemento!: ElementRef


  contadorPunto = 0
  contadorRadar = 0

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
        <input type="file" class="form-control form-control-sm" id="customFile" />
    </div>
    <div class="mt-2" style="width: 330px; height: 220px;">
        <img *ngIf="false" src="#" alt="Gráfico de desplazamientos Vs. tiempo">
    </div>
    <div class="d-flex justify-content-between ">
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
    elemento.querySelector("#eliminarPunto-" + id)?.addEventListener('click', () => this.eliminarElemento(newElement))
    this.contadorPunto++

  }


  agregarRadar(idPunto : number) {

    let id = this.contadorRadar
    let elemento = document.querySelector("#radares-" + idPunto)
    let template = `<div id="radar-${id}" style="background-color: #f9f9f9;" class="mt-2 p-2 rounded-2">
      <div class="d-flex flex-column">
          <div class="d-flex justify-content-between">
              <label>Radar</label>
              <button id="eliminarRadar-${id}" type="button" class="btn btn-warning btn-floating btn-sm" mdbRipple>
                  <i class="fas fa-trash"></i>
              </button>
          </div>
          <select id="select1" style="width: 174px; height: 30px;" class="rounded-2">
              <option value="" hidden=""></option>
              <option value="1">Radar IBIS-2</option>
              <option value="2">Radar IBIS-3</option>
              <option value="3">Radar IBIS-4</option>
              <option value="4">Radar IBIS-5</option>
              <option value="5">Radar IBIS-6</option>
              <option value="6">Radar IBIS-7</option>
              <option value="7">Radar IBIS-8</option>
              <option value="8">Radar IBIS-9</option>
          </select>
      </div>
      <div class="d-flex gap-4 mt-2">
          <div class="d-flex flex-column">
              <label mdbLabel id="Este">Este</label>
              <mdb-form-control>
                  <input mdbInput type="number" id="Este" class="form-control-sm"
                      style="background-color: #ffffff;" />
              </mdb-form-control>
          </div>
          <div class="d-flex flex-column">
              <label mdbLabel id="norte">Norte</label>
              <mdb-form-control>
                  <input mdbInput type="number" id="norte" class="form-control-sm"
                      style="background-color: #ffffff;" />
              </mdb-form-control>
          </div>
          <div class="d-flex flex-column">
              <label mdbLabel id="cota">Cota</label>
              <mdb-form-control>
                  <input mdbInput type="number" id="cota" class="form-control-sm"
                      style="background-color: #ffffff;" />
              </mdb-form-control>
          </div>
      </div>
      <div class="d-flex gap-4 mt-2">
          <div style="width: 276px;">
              <label mdbLabel id="desplazamiento">Desplazamiento Últimas 12 hrs.</label>
              <mdb-form-control>
                  <input mdbInput type="number" id="desplazamiento"
                      class="form-control-sm col-12" style="background-color: #ffffff;" />
              </mdb-form-control>
          </div>
          <div style="width: 276px;">
              <label mdbLabel id="velocidad">Velocidad Promedio Últimas 12 hrs.</label>
              <mdb-form-control>
                  <input mdbInput type="number" id="velocidad" class="form-control-sm  col-12"
                      style="background-color: #ffffff;" />
              </mdb-form-control>
          </div>
      </div>
    </div>`

    let newElement = document.createElement('div')
    newElement.innerHTML = template
    elemento?.appendChild(newElement)
    elemento?.querySelector("#eliminarRadar-" + id)?.addEventListener('click', () => this.eliminarElemento(newElement))

    this.contadorRadar++
  }

  eliminarElemento(elemento: HTMLElement){
    elemento.remove()
  }

}
