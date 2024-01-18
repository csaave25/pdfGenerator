const puntosCardinales = ['N', "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSO", "SO", "OSO", "O", "ONO", "NO", "NNO"]



export function traduccionPuntosCardinales(punto: string) {
    let puntoEspanol
    switch (punto) {
        case 'SSW':
            punto = 'SSO'
            break;
        case 'SW':
            punto = 'SO'
            break;
        case 'WSW':
            punto = 'OSO'
            break;
        case 'W':
            punto = 'O'
            break;
        case 'WNW':
            punto = 'ONO'
            break;
        case 'NW':
            punto = 'NO'
            break;
        case 'NNW':
            punto = 'NNO'
            break;

        default:
            puntoEspanol = punto
            break;
    }
}
