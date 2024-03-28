import { FormGroup } from "@angular/forms"

export function loadLocalStorage(inputs: FormGroup) {
    let data = localStorage.getItem('data')
    if (data) {
        let datos = JSON.parse(data)
        inputs.get('fecha')?.setValue(datos.inputs.fecha)
        inputs.get('usrs.elaborado')?.setValue(datos.inputs.usrs.elaborado)
        inputs.get('usrs.cargo1')?.setValue(datos.inputs.usrs.cargo1)
        inputs.get('usrs.revisado')?.setValue(datos.inputs.usrs.revisado)
        inputs.get('usrs.cargo2')?.setValue(datos.inputs.usrs.cargo2)
        inputs.get('usrs.aprobado')?.setValue(datos.inputs.usrs.aprobado)
        inputs.get('usrs.cargo3')?.setValue(datos.inputs.usrs.cargo3)
        inputs.get('disponibilidadComentario.infraEMT')?.setValue(datos.inputs.disponibilidadComentario.infraEMT)
        inputs.get('disponibilidadComentario.web')?.setValue(datos.inputs.disponibilidadComentario.web)
        inputs.get('disponibilidadComentario.img')?.setValue(datos.inputs.disponibilidadComentario.img)
        inputs.get('disponibilidadComentario.bd')?.setValue(datos.inputs.disponibilidadComentario.bd)
        inputs.get('disponibilidadComentario.api')?.setValue(datos.inputs.disponibilidadComentario.api)
        inputs.get('disponibilidadComentario.computo')?.setValue(datos.inputs.disponibilidadComentario.computo)
        inputs.get('disponibilidadComentario.infraANT')?.setValue(datos.inputs.disponibilidadComentario.infraANT)
        inputs.get('disponibilidadComentario.sistema')?.setValue(datos.inputs.disponibilidadComentario.sistema)
        inputs.get('disponibilidadComentario.enlaceObs')?.setValue(datos.inputs.disponibilidadComentario.enlaceObs)
        inputs.get('disponibilidadComentario.enlace')?.setValue(datos.inputs.disponibilidadComentario.enalce)
        inputs.get('confiabilidad.identificacion')?.setValue(datos.inputs.confiabilidad.identificacion)
        inputs.get('confiabilidad.clasificacion')?.setValue(datos.inputs.confiabilidad.clasificacion)
        inputs.get('confiabilidad.comunicacion')?.setValue(datos.inputs.confiabilidad.comunicacion)
        inputs.get('conclusion')?.setValue(datos.inputs.conclusion)
    }
}

export function saveOnLocalStorage(inputs: FormGroup, tablas : any ) {
    let datos = {
        inputs: {
            fecha: inputs.get('fecha')?.value,
            usrs: {
                elaborado: inputs.get('usrs.elaborado')?.value,
                cargo1: inputs.get('usrs.cargo1')?.value,
                revisado: inputs.get('usrs.revisado')?.value,
                cargo2: inputs.get('usrs.cargo2')?.value,
                aprobado: inputs.get('usrs.aprobado')?.value,
                cargo3: inputs.get('usrs.cargo3')?.value,
            },
            disponibilidadComentario: {
                infraEMT: inputs.get('disponibilidadComentario.infraEMT')?.value,
                infraANT: inputs.get('disponibilidadComentario.infraANT')?.value,
                web: inputs.get('disponibilidadComentario.web')?.value,
                enlaceObs: inputs.get('disponibilidadComentario.enlaceObs')?.value,
                img: inputs.get('disponibilidadComentario.img')?.value,
                bd: inputs.get('disponibilidadComentario.bd')?.value,
                api: inputs.get('disponibilidadComentario.api')?.value,
                computo: inputs.get('disponibilidadComentario.computo')?.value,
                sistema: inputs.get('disponibilidadComentario.sistema')?.value,
                enlace: inputs.get('disponibilidadComentario.enlace')?.value,
            },
            confiabilidad: {
                identificacion: inputs.get('confiabilidad.identificacion')?.value,
                clasificacion: inputs.get('confiabilidad.clasificacion')?.value,
                comunicacion: inputs.get('confiabilidad.comunicacion')?.value
            },
            conclusion: inputs.get('conclusion')?.value
        },
        tablaDispo: tablas.tablaDispo,
        imgCriticidad: tablas.imgCriticidad,
        comentariosCriticidad: tablas.comentariosCriticidad,
        promedioTablaDispo: tablas.promedioTablaDispo,
        comentariosImagenes: tablas.comentariosImagenes,
        numTemplate: tablas.numTemplate,
        numImagen: tablas.numImagen
    }

    localStorage.setItem('data', JSON.stringify(datos))
}
