import { FormGroup } from "@angular/forms"

export function cargarLocalStorage(inputs : FormGroup) {

    let data = localStorage.getItem('dataEFE')
    if (data) {
        let datos = JSON.parse(data)

        inputs.get('fechaInicio')?.setValue(datos.fechaInicio)
        inputs.get('fechaFinal')?.setValue(datos.fechaFinal)
        inputs.get('numeroInforme')?.setValue(datos.numeroInforme)
        inputs.get('gestores.elaborado')?.setValue(datos.gestores.elaborado)
        inputs.get('gestores.revisado')?.setValue(datos.gestores.revisado)
        inputs.get('gestores.aprobado')?.setValue(datos.gestores.aprobado)
        inputs.get('gestores.cargo1')?.setValue(datos.gestores.cargo1)
        inputs.get('gestores.cargo2')?.setValue(datos.gestores.cargo2)
        inputs.get('gestores.cargo3')?.setValue(datos.gestores.cargo3)
        inputs.get('estaciones.estados.piezometro')?.setValue(datos.estaciones.estados.piezometro)
        inputs.get('estaciones.estados.gcd')?.setValue(datos.estaciones.estados.gcd)
        inputs.get('estaciones.estados.gcc')?.setValue(datos.estaciones.estados.gcc)
        inputs.get('estaciones.estados.prismas')?.setValue(datos.estaciones.estados.prismas)
        inputs.get('estaciones.estadoGeneral')?.setValue(datos.estaciones.estadoGeneral)
        inputs.get('estaciones.observaciones.piezometro')?.setValue(datos.estaciones.observaciones.piezometro)
        inputs.get('estaciones.observaciones.gcd')?.setValue(datos.estaciones.observaciones.gcd)
        inputs.get('estaciones.observaciones.gcc')?.setValue(datos.estaciones.observaciones.gcc)
        inputs.get('estaciones.observaciones.prismas')?.setValue(datos.estaciones.observaciones.prismas)
        inputs.get('estaciones.monitoreo.alarmas')?.setValue(datos.estaciones.monitoreo.alarmas)
        inputs.get('estaciones.monitoreo.alertas')?.setValue(datos.estaciones.monitoreo.alertas)
        inputs.get('estaciones.monitoreo.vigilancia')?.setValue(datos.estaciones.monitoreo.vigilancia)
        inputs.get('estaciones.monitoreo.sismo')?.setValue(datos.estaciones.monitoreo.sismo)
        inputs.get('estaciones.estacion6.obsGenerales')?.setValue(datos.estaciones.estacion6.obsGenerales)
        inputs.get('estaciones.estacion6.obsGCC')?.setValue(datos.estaciones.estacion6.obsGCC)
        inputs.get('estaciones.estacion6.obsGCD')?.setValue(datos.estaciones.estacion6.obsGCD)
        inputs.get('estaciones.estacion6.obsEspecificas')?.setValue(datos.estaciones.estacion6.obsEspecificas)
        inputs.get('estaciones.estacion6.piezometro.observaciones')?.setValue(datos.estaciones.estacion6.piezometro.observaciones)
        inputs.get('estaciones.estacion7.obsGenerales')?.setValue(datos.estaciones.estacion7.obsGenerales)
        inputs.get('estaciones.estacion7.obsGCC')?.setValue(datos.estaciones.estacion7.obsGCC)
        inputs.get('estaciones.estacion7.obsGCD')?.setValue(datos.estaciones.estacion7.obsGCD)
        inputs.get('estaciones.estacion7.obsEspecificas')?.setValue(datos.estaciones.estacion7.obsEspecificas)
        inputs.get('estaciones.estacion7.piezometro.observaciones')?.setValue(datos.estaciones.estacion7.piezometro.observaciones)
        inputs.get('estaciones.estacion8.obsGenerales')?.setValue(datos.estaciones.estacion8.obsGenerales)
        inputs.get('estaciones.estacion8.obsGCC')?.setValue(datos.estaciones.estacion8.obsGCC)
        inputs.get('estaciones.estacion8.obsGCD')?.setValue(datos.estaciones.estacion8.obsGCD)
        inputs.get('estaciones.estacion8.obsEspecificas')?.setValue(datos.estaciones.estacion8.obsEspecificas)
        inputs.get('estaciones.estacion8.piezometro.observaciones')?.setValue(datos.estaciones.estacion8.piezometro.observaciones)
        inputs.get('prismas.obsGeneral')?.setValue(datos.prismas.obsGeneral)
        inputs.get('prismas.prismas1.obsGeneral')?.setValue(datos.prismas.prismas1.obsGeneral)
        inputs.get('prismas.prismas2.obsGeneral')?.setValue(datos.prismas.prismas2.obsGeneral)
        inputs.get('conclusion')?.setValue(datos.conclusion)
    }

    
}


export function guardarEnLocalStorage(inputs : FormGroup) {
    let datos = {
      fechaInicio: inputs.get('fechaInicio')?.value,
      fechaFinal: inputs.get('fechaFinal')?.value,
      numeroInforme: inputs.get('numeroInforme')?.value,
      gestores: {
        elaborado: inputs.get('gestores.elaborado')?.value,
        revisado: inputs.get('gestores.revisado')?.value,
        aprobado: inputs.get('gestores.aprobado')?.value,
        cargo1: inputs.get('gestores.cargo1')?.value,
        cargo2: inputs.get('gestores.cargo2')?.value,
        cargo3: inputs.get('gestores.cargo3')?.value
      },
      estaciones: {
        estados: {
          piezometro: inputs.get('estaciones.estados.piezometro')?.value,
          gcd: inputs.get('estaciones.estados.gcd')?.value,
          gcc: inputs.get('estaciones.estados.gcc')?.value,
          prismas: inputs.get('estaciones.estados.prismas')?.value
        },
        estadoGeneral: inputs.get('estaciones.estadoGeneral')?.value,
        observaciones: {
          piezometro: inputs.get('estaciones.observaciones.piezometro')?.value,
          gcd: inputs.get('estaciones.observaciones.gcd')?.value,
          gcc: inputs.get('estaciones.observaciones.gcc')?.value,
          prismas: inputs.get('estaciones.observaciones.prismas')?.value
        },
        monitoreo: {
          alarmas: inputs.get('estaciones.monitoreo.alarmas')?.value,
          alertas: inputs.get('estaciones.monitoreo.alertas')?.value,
          vigilancia: inputs.get('estaciones.monitoreo.vigilancia')?.value,
          sismo: inputs.get('estaciones.monitoreo.sismo')?.value

        },
        estacion6: {
          obsGenerales: inputs.get('estaciones.estacion6.obsGenerales')?.value,
          obsGCC: inputs.get('estaciones.estacion6.obsGCC')?.value,
          obsGCD: inputs.get('estaciones.estacion6.obsGCD')?.value,
          obsEspecificas: inputs.get('estaciones.estacion6.obsEspecificas')?.value,
          piezometro: {
            imgAguaAcumulada: null,
            observaciones: inputs.get('estaciones.estacion6.piezometro.observaciones')?.value
          }
        },
        estacion7: {
          obsGenerales: inputs.get('estaciones.estacion7.obsGenerales')?.value,
          obsGCC: inputs.get('estaciones.estacion7.obsGCC')?.value,
          obsGCD: inputs.get('estaciones.estacion7.obsGCD')?.value,
          obsEspecificas: inputs.get('estaciones.estacion7.obsEspecificas')?.value,
          piezometro: {
            imgAguaAcumulada: null,
            observaciones: inputs.get('estaciones.estacion7.piezometro.observaciones')?.value
          }
        },
        estacion8: {
          obsGenerales: inputs.get('estaciones.estacion8.obsGenerales')?.value,
          obsGCC: inputs.get('estaciones.estacion8.obsGCC')?.value,
          obsGCD: inputs.get('estaciones.estacion8.obsGCD')?.value,
          obsEspecificas: inputs.get('estaciones.estacion8.obsEspecificas')?.value,
          piezometro: {
            imgAguaAcumulada: null,
            observaciones: inputs.get('estaciones.estacion8.piezometro.observaciones')?.value
          }
        },

      },
      prismas: {
        imagenGeneral: null,
        obsGeneral: inputs.get('prismas.obsGeneral')?.value,
        prismas1: {
          imagen: null,
          obsGeneral: inputs.get('prismas.prismas1.obsGeneral')?.value
        },
        prismas2: {
          imagen: null,
          obsGeneral: inputs.get('prismas.prismas2.obsGeneral')?.value
        },
      },
      conclusion: inputs.get('conclusion')?.value
    }


    let data = JSON.stringify(datos)
    localStorage.setItem('dataEFE', data)

  }