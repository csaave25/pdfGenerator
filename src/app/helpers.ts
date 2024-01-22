const puntosCardinales = ['N', "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSO", "SO", "OSO", "O", "ONO", "NO", "NNO"]



export function traduccionPuntosCardinales(punto: string) {
    punto = punto.replace('of', 'de')
    let arr = punto.split(' ')
    let puntoEspanol = arr[2]

    switch (puntoEspanol) {
        case 'SSW':
            puntoEspanol = 'SSO'
            break;
        case 'SW':
            puntoEspanol = 'SO'
            break;
        case 'WSW':
            puntoEspanol = 'OSO'
            break;
        case 'W':
            puntoEspanol = 'O'
            break;
        case 'WNW':
            puntoEspanol = 'ONO'
            break;
        case 'NW':
            puntoEspanol = 'NO'
            break;
        case 'NNW':
            puntoEspanol = 'NNO'
            break;
    }

    let newString = ''
    arr.forEach((str, index) => {
        if (newString.length == 0) {
            newString = str
        } else {
            if (index == 2) {
                newString += ' ' + puntoEspanol
            } else {
                newString += ' ' + str
            }
        }

    })

    return newString
}
