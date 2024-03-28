import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from '../api/api.service';
import { calcularPromedioConfiabilidad } from '../helpers/calcularPromedioConfiabilidad';
import { Observable } from 'rxjs';
import { data } from 'src/app/informe-efe/helpers/data';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private rq: ApiService) { }

  loadGrietasCriticidad(inputs: FormGroup, comentariosImagenes: any[], imgCriticidad: any) {
    let fecha = inputs.get('fecha')?.value.replaceAll("-", "/");
    let mes = new Date(fecha).getMonth() + 1;
    let ano = new Date(fecha).getFullYear();
    this.rq.getAlerta(mes, ano).subscribe(data => {
      comentariosImagenes = data;
      imgCriticidad = new Array(comentariosImagenes.length);
    })
  }

  loadConfiabilidad(inputs: FormGroup) {
    let fecha = inputs.get('fecha')?.value.replace("-", "/")
    let mes = new Date(fecha).toLocaleString('default', { month: 'long' })
    let ano = new Date(fecha).getFullYear()
    this.rq.getToken().subscribe(data => {
      let token = data.token
      this.rq.getConfiabilidad(mes, ano, token).subscribe(data => {
        inputs.get('confiabilidad.identificacion')?.setValue(data.objects[0].identification)
        inputs.get('confiabilidad.clasificacion')?.setValue(data.objects[0].classification)
        inputs.get('confiabilidad.comunicacion')?.setValue(data.objects[0].communication)
        inputs.get('confiabilidad.promedioConfia')?.setValue(calcularPromedioConfiabilidad(inputs))
      })
    })
  }


  loadDisponibilidad(inputs: FormGroup, tablaDispo: {value: any}) {
    let fecha = inputs.get('fecha')?.value.replace("-", "/")
    let mes = new Date(fecha).toLocaleString('default', { month: 'long' })
    let ano = new Date(fecha).getFullYear()
    let buscar = ano + '/' + mes
    let tabla =this.rq.getDisponibilidad(buscar).subscribe(dato => {
      let prom = (dato.servicio_web + dato.servicio_imagenes + dato.servicio_db + dato.servicio_api + dato.servicio_computo) / 5
      let promRound = prom
      tablaDispo.value = {
        infraestructura: promRound?.toFixed(2),
        servicio_web: dato.servicio_web?.toFixed(2),
        servicio_imagenes: dato.servicio_imagenes?.toFixed(2),
        servicio_db: dato.servicio_db?.toFixed(2),
        servicio_api: dato.servicio_api?.toFixed(2),
        servicio_computo: dato.servicio_computo?.toFixed(2),
        sistema_adquisicion_imagenes: dato.sistema_adquisicion_imagenes?.toFixed(2),
        enlace_dedicado: dato.enlace_dedicado?.toFixed(2)
      }

    }).add(() => {return tablaDispo})
    
  }


  loadMatriz(inputs: FormGroup, dataMatrix: any[]) {
    let str: string = inputs.get('fecha')?.value
    let arr: any[] = []
    str = str.replaceAll("-", "/")
    let fecha = new Date(str)
    let ano = fecha.getFullYear()
    let mes = ('0' + (fecha.getMonth() + 1)).slice(-2)
    this.rq.getToken().subscribe(data => {
      this.rq.getTablaMatrix(mes, ano, data.token).subscribe((data) => {
        data.objects.forEach((elm: any) => {
          dataMatrix.push(elm)
        })

      })
    })
  }

}
