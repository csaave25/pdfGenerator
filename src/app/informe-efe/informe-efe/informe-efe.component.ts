import { Component, ElementRef, OnInit, QueryList, ViewChildren, AfterContentInit } from '@angular/core';
import { InformeService } from '../genInforme/informe.service';
import { FormControl, FormGroup } from '@angular/forms';
import Chart from 'chart.js/auto';
import { ApiService } from '../api/api.service';
import html2canvas from 'html2canvas';
import 'chartjs-adapter-moment';
import moment from 'moment';
import { prevenirSaltosDeLinea } from 'src/app/helpers';
import { getFechasFormatos } from '../helpers/data';
import { cargarLocalStorage, guardarEnLocalStorage } from '../helpers/localstorage';
import { DataInformeService } from '../services/data-informe.service';
import { loadScreenshots } from '../helpers/screenshots';

// ng build --output-path docs --base-href /pdfGenerator/

@Component({
  selector: 'app-informe-efe',
  templateUrl: './informe-efe.component.html',
  styleUrls: ['./informe-efe.component.scss']
})
export class InformeEfeComponent implements OnInit, AfterContentInit {

  constructor(private servicio: InformeService, private api: ApiService, private dataService: DataInformeService) { }

  @ViewChildren("geocentinela") geoElements!: QueryList<ElementRef>;
  @ViewChildren("GCD") gcdElements!: QueryList<ElementRef>;
  @ViewChildren("screenPrisma") prismasElements!: QueryList<ElementRef>;
  @ViewChildren("piezometro") piezometroElement!: QueryList<ElementRef>;



  geocentinelas: any[] = []
  geocentinelasDeformacion: any[] = []
  dataTablaPrismas: any[] = []
  chart: any
  arrGCC: any[] = []
  arrGCD: any[] = []
  arrPrismas: any[] = []
  arrPiezometro: any = []
  loadGeoC = false;
  loadGeoDeformacion = false;
  loadChartPrismas = false;
  service = this.servicio
  dataInputs = new FormGroup({
    textAreaTest: new FormControl()
  })
  imagenAgua1: any
  imagenAgua2: any
  imagenAgua3: any
  chartsPiezometro: any[] = []
  chartsGeoDeformacion: any[] = []
  loadingGCC = true
  loadingPrismas = true
  loaddingGCD = true
  loadingPiezometro = true



  inputs: FormGroup = new FormGroup({
    datos: new FormGroup({
      fechaInicio: new FormControl({ value: null, disabled: false }),
      fechaFinal: new FormControl({ value: null, disabled: false }),
      numeroInforme: new FormControl(0)
    }),
    gestores: new FormGroup({
      elaborado: new FormControl(''),
      revisado: new FormControl(''),
      aprobado: new FormControl(''),
      cargo1: new FormControl(''),
      cargo2: new FormControl(''),
      cargo3: new FormControl('')
    }),
    estaciones: new FormGroup({
      estados: new FormGroup({
        piezometro: new FormControl(false),
        gcd: new FormControl(false),
        gcc: new FormControl(false),
        prismas: new FormControl(false),
      }),
      estadoGeneral: new FormControl(''),
      observaciones: new FormGroup({
        piezometro: new FormControl(''),
        gcd: new FormControl(''),
        gcc: new FormControl(''),
        prismas: new FormControl(''),
      }),
      monitoreo: new FormGroup({
        alarmas: new FormControl(0),
        alertas: new FormControl(0),
        vigilancia: new FormControl(0),
        sismo: new FormControl(0),

      }),
      estacion6: new FormGroup({
        obsGenerales: new FormControl(''),
        obsGCC: new FormControl(''),
        obsGCD: new FormControl(''),
        obsEspecificas: new FormControl(''),
        piezometro: new FormGroup({
          imgAguaAcumulada: new FormControl(''),
          observaciones: new FormControl('')
        })
      }),
      estacion7: new FormGroup({
        obsGenerales: new FormControl(''),
        obsGCC: new FormControl(''),
        obsGCD: new FormControl(''),
        obsEspecificas: new FormControl(''),
        piezometro: new FormGroup({
          imgAguaAcumulada: new FormControl(''),
          observaciones: new FormControl('')
        })
      }),
      estacion8: new FormGroup({
        obsGenerales: new FormControl(''),
        obsGCC: new FormControl(''),
        obsGCD: new FormControl(''),
        obsEspecificas: new FormControl(''),
        piezometro: new FormGroup({
          imgAguaAcumulada: new FormControl(''),
          observaciones: new FormControl('')
        })
      })
    }),
    prismas: new FormGroup({
      imagenGeneral: new FormControl(''),
      obsGeneral: new FormControl(''),
      prismas1: new FormGroup({
        imagen: new FormControl(''),
        obsGeneral: new FormControl('')
      }),
      prismas2: new FormGroup({
        imagen: new FormControl(''),
        obsGeneral: new FormControl('')
      })
    }),
    conclusion: new FormControl('')
  })


  ngOnInit() {
    this.reloadData()
    this.api.getPrecipitaciones('2024/02').subscribe((res) => {
      console.log(res);
    })
  }

  ngAfterContentInit(): void {
    cargarLocalStorage(this.inputs)
  }


  prevenir(numSaltosPermitidos: number, evt: Event) {
    prevenirSaltosDeLinea(numSaltosPermitidos, evt)
  }


  reloadData() {
    if (this.inputs.get('datos.fechaInicio')?.value && this.inputs.get('datos.fechaFinal')?.value) {
      this.dataService.loadGCC(this.geocentinelas)
      this.dataService.loadPrismas(this.dataTablaPrismas, this.loadChartPrismas)
      this.dataService.loadGCCDeformacion(this.inputs, this.geocentinelasDeformacion, this.chartsGeoDeformacion, this.loadGeoDeformacion)
      this.dataService.LoadPiezometro(this.inputs, this.chartsPiezometro)
    }
  }

  LoadUploadImage(inputs: FormGroup, id: number, event: any) {
    this.dataService.LoadUploadImage(inputs, id, event)
  }


  async loadAllScreenshots() {
    await loadScreenshots(this.geoElements, this.arrGCC)
    await loadScreenshots(this.gcdElements, this.arrGCD)
    await loadScreenshots(this.piezometroElement, this.arrPiezometro)
    await loadScreenshots(this.prismasElements, this.arrPrismas)

  }

  async crearInforme() {
    await this.loadAllScreenshots()
    this.service.generarInforme(this.inputs, this.arrGCC, this.arrGCD, this.gcdElements, this.arrPrismas, this.arrPiezometro)
    let body = { ...this.inputs.value, gcc: this.arrGCC, gcd: this.arrGCD, prismas: this.arrPrismas, piezometro: this.arrPiezometro }
    console.log(body);
    guardarEnLocalStorage(this.inputs)

  }

  subirInforme() {
    this.service.subirInforme(this.inputs, this.arrGCC, this.arrGCD, this.gcdElements, this.arrPrismas, this.arrPiezometro)
  }





}
