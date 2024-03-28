import { Component, ViewChild, ElementRef, Renderer2, OnInit, ViewChildren } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { InformeService } from '../generator/informe.service';
import { ApiService } from '../api/api.service';
import { loadLocalStorage, saveOnLocalStorage } from '../helpers/localstorage';
import { calcularPromedioConfiabilidad } from '../helpers/calcularPromedioConfiabilidad';
import { DataService } from '../service/data.service';
import { InsertHTMLService } from '../service/insert-html.service';

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


  constructor(private informeService: InformeService, private render: Renderer2, private rq: ApiService, private data: DataService, private html: InsertHTMLService) { }


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

  dataCriticisadad: any[] = []

  tablaDispo = { value : {} as any }
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
    this.inputs.get('confiabilidad.promedioConfia')?.disable()
    loadLocalStorage(this.inputs)
    this.loadTablas()
    let date = new Date()
    this.hoy = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2)
  }

  calcularPromedio() {
    calcularPromedioConfiabilidad(this.inputs)
  }


  async loadTablas() {
    this.limpiarVariables()
    this.data.loadGrietasCriticidad(this.inputs, this.dataCriticisadad, this.imgCriticidad)
    this.data.loadConfiabilidad(this.inputs)
    this.data.loadDisponibilidad(this.inputs, this.tablaDispo)
    this.data.loadMatriz(this.inputs, this.dataMatrix)
  }




  loadMatrizComentario() {
    this.html.loadMatrizComentario(this.matriz.nativeElement, this.comentariosImagenesMatriz)
  }

  loadTemplateComentarios() {
    this.html.loadTemplateComentarios(this.templateComentario.nativeElement, this.comentariosImagenes)
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

    let tablas = {
      tablaDispo: this.tablaDispo,
      imgCriticidad: this.imgCriticidad,
      comentariosCriticidad: this.comentariosCriticidad,
      promedioTablaDispo: this.promedioTablaDispo,
      comentariosImagenes: this.comentariosImagenes,
      numTemplate: this.numTemplate,
      numImagen: this.numImagen
    }
    saveOnLocalStorage(this.inputs, tablas)





  }

  descargaCliente() {
    let tablas = {
      tablaDispo: this.tablaDispo,
      imgCriticidad: this.imgCriticidad,
      comentariosCriticidad: this.comentariosCriticidad,
      promedioTablaDispo: this.promedioTablaDispo,
      comentariosImagenes: this.comentariosImagenes,
      numTemplate: this.numTemplate,
      numImagen: this.numImagen
    }

    console.log(tablas);

    this.informeService.descargaCliente(this.dataCriticisadad, this.dataMatrix, this.tablaDispo.value, this.imgCriticidad, this.comentariosCriticidad, this.inputs, this.comentariosImagenes, this.comentariosImagenesMatriz)

    saveOnLocalStorage(this.inputs, tablas)
  }



}


