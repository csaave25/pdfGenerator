import { FormGroup } from "@angular/forms"

export function calcularPromedioConfiabilidad(inputs : FormGroup) {
    let uno = inputs.get('confiabilidad.identificacion')?.value!
    let dos = inputs.get('confiabilidad.clasificacion')?.value!
    let tres = inputs.get('confiabilidad.comunicacion')?.value!
    let promedio = (uno + dos + tres) / 3
    return promedio
}