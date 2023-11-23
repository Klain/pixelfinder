import {
    uiMenuInicial,
    uiMenuBuscarJuego,
    uiMenuBuscarGenero,
    uiMenuGenerosFavoritos
} from './inquirerUI.js';

async function iniciarAplicacion() {
    let posicionUsuario = 'inicio';

    do {
        switch (posicionUsuario) {
            case 'inicio':
                posicionUsuario = await uiMenuInicial();
                break;
            case 'buscarJuego':
                posicionUsuario = await uiMenuBuscarJuego();
                break;
            case 'buscarGenero':
                posicionUsuario = await uiMenuBuscarGenero();
                break;
            case 'configuracion':
                posicionUsuario = await uiMenuGenerosFavoritos();
                break;
            case 'salir':
                console.log('Saliendo de la aplicación. ¡Hasta luego!');
                break;
            default:
                console.log('Opción no válida. Inténtalo de nuevo.');
        }

    } while (posicionUsuario !== 'salir');
}
iniciarAplicacion();

