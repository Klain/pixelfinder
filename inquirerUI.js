import inquirer from 'inquirer';
import {
    mostrarGenerosFavoritos,
    mostrarDetallesGenero,
    mostrarFichaJuego

} from './apiRequests.js';

async function limpiarPantalla() {
    console.clear();
}

async function volver() {
    const respuesta = await inquirer.prompt([
        {
            type: 'list',
            name: 'opcion',
            message: 'Selecciona una opción:',
            choices: [{ name: 'Volver', value: 'inicio' }]
        },
    ]);
    return respuesta.opcion;
}

async function cabecera(titulo) {
    console.log('============================================');
    console.log(`          PIXEL FINDER - ${titulo}`);
    console.log('============================================\n');
}

async function uiMenuInicial() {
    await limpiarPantalla();
    await cabecera("Inicio");

    const opcionesMenu = [
        { name: '1.Buscar Juego', value: 'buscarJuego' },
        { name: '2.Buscar Genero', value: 'buscarGenero' },
        { name: '3.Configuracion', value: 'configuracion' },
        { name: '0.Salir', value: 'salir' }
    ];

    const respuesta = await inquirer.prompt({
        type: 'list',
        name: 'opcion',
        message: 'Selecciona una opción:',
        choices: opcionesMenu,
        default: 'salir'
    });

    return respuesta.opcion;
}

async function uiMenuBuscarJuego() {
    await limpiarPantalla();
    await cabecera("Buscar Juego");
    await mostrarFichaJuego();
    return volver();
}

async function uiMenuBuscarGenero() {
    await limpiarPantalla();
    await cabecera("Buscar Genero");

    await mostrarDetallesGenero();

    const opcionesMenu = [
        { name: 'Buscar nuevo genero', value: 'buscarGenero' },
        { name: 'Volver', value: 'inicio' }
    ];

    const respuesta = await inquirer.prompt({
        type: 'list',
        name: 'opcion',
        message: 'Selecciona una opción:',
        choices: opcionesMenu,
        default: 'inicio'
    });

    return respuesta.opcion;
}

async function uiMenuGenerosFavoritos() {
    await limpiarPantalla();
    await cabecera("Generos Favoritos");
    await mostrarGenerosFavoritos();

    const opcionesMenu = [
        { name: 'Volver', value: 'inicio' }
    ];

    const respuesta = await inquirer.prompt({
        type: 'list',
        name: 'opcion',
        message: 'Selecciona una opción:',
        choices: opcionesMenu,
        default: 'inicio'
    });

    return respuesta.opcion;
}

export { uiMenuInicial, uiMenuBuscarJuego, uiMenuBuscarGenero, uiMenuGenerosFavoritos };