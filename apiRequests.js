import axios from 'axios';
import { promises as fsPromises } from 'fs';
import inquirer from 'inquirer';
import { load } from 'cheerio';

const RAWG_KEY = "a0d4303da60246e9866d5ef307f382e1";
const GIGANTBOMB_KEY = '1168e05012492139f98c3f3ae54404a7969ba5e0';
const FAVORITOS_FILE = 'favoritos.json';


// Realizar la solicitud a la API de rawg.io para obtener el listado de géneros ordenados por popularidad
async function obtenerGenerosDesdeAPI() {
    try {
        const RAWG_URL = `https://api.rawg.io/api/genres?key=${RAWG_KEY}`;
        const respuesta = await axios.get(RAWG_URL, { params: { ordering: 'popularity' } });
        return respuesta.data.results.map(genero => ({ name: genero.name, value: genero.id }));

    } catch (error) {
        throw new Error('Error al obtener los géneros:', error.message);
    }
}
// Obtener los géneros favoritos almacenados en el archivo 'favoritos.json'
async function obtenerGenerosFavoritos() {
    try {
        const contenidoFavoritos = await fsPromises.readFile(FAVORITOS_FILE, 'utf-8');
        const favoritos = JSON.parse(contenidoFavoritos);
        return favoritos.map((genero) => ({ name: genero.name, value: genero.value }));
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fsPromises.writeFile(FAVORITOS_FILE, '[]', 'utf-8');
            return [];
        } else {
            console.error('Error al obtener los géneros favoritos:', error.message);
            return [];
        }
    }
}
//Lee los géneros favoritos desde 'favoritos.json', filtra los géneros principales para eliminar duplicados y ordena los géneros poniendo los favoritos primero.
async function obtenerGenerosOrdenados() {
    try {
        const generos = await obtenerGenerosDesdeAPI();
        const favoritos = await obtenerGenerosFavoritos();
        if (favoritos.length !== 0) {
            const generosFiltrados = generos.filter(genero => !favoritos.find(favorito => favorito.value === genero.value));
            const opcionesFavoritos = favoritos.map((genero) => ({ name: genero.name, value: genero.value }));
            const generosOrdenados = [...opcionesFavoritos, ...generosFiltrados];
            return generosOrdenados;
        } else {
            return generos;
        }

    } catch (error) {
        console.error('Error al ordenar los géneros favoritos:', error.message);
        return generos;
    }
}
// Mostrar el listado de géneros y permitir al usuario seleccionar sus favoritos. Guarda los géneros favoritos en 'favoritos.json'.
async function mostrarGenerosFavoritos() {
    try {
        const generosOrdenados = await obtenerGenerosOrdenados();
        const favoritos = await obtenerGenerosFavoritos();//todo intentar ahorrarnos esta variable

        let opciones;
        if (favoritos.length === 0) {
            opciones = generosOrdenados.map((genero) => ({
                name: genero.name,
                value: genero.value,
            }));
        } else {
            opciones = generosOrdenados.map((genero) => ({
                name: genero.name,
                value: genero.value,
                checked: favoritos.map(favorito => favorito.value).includes(genero.value)
            }));
        }
        const respuestasUsuario = await inquirer.prompt([
            {
                type: 'checkbox',
                name: 'favoritos',
                message: 'Selecciona tus géneros favoritos:',
                choices: opciones,
                default: opciones[0].value
            },
        ]);

        const favoritosSeleccionados = respuestasUsuario.favoritos.map(favorito => {
            const genero = generosOrdenados.find(genero => genero.value === favorito);
            return { name: genero.name, value: genero.value };
        });
        await guardarGenerosFavoritos(favoritosSeleccionados);
    } catch (error) {
        throw new Error('Error al mostrar los géneros(option):', error.message);
    }
}
//Guarda un listado de generos favoritos en el fichero favoritos.json
async function guardarGenerosFavoritos(favoritos) {
    try {
        await fsPromises.writeFile(FAVORITOS_FILE, JSON.stringify(favoritos, null, 2));
    } catch (error) {
        throw new Error('Error al guardar los géneros:', error.message);
    }
}
//Crea opciones para Inquirer con nombres y valores, muestra los géneros y permite al usuario seleccionar uno.
async function mostrarRadioGenerosOrdenados() {
    try {

        const opcionesOrdenadas = await obtenerGenerosOrdenados();
        const respuestasUsuario = await inquirer.prompt([
            {
                type: 'list',
                name: 'generoSeleccionado',
                message: 'Selecciona un género:',
                choices: opcionesOrdenadas
            },
        ]);

        return respuestasUsuario.generoSeleccionado;
    } catch (error) {
        throw new Error('Error al seleccionar el género:', error.message);
    }
}
//Obtiene los detalles del genero y los muestra en pantalla
async function mostrarDetallesGenero() {
    try {
        const idGenero = await mostrarRadioGenerosOrdenados();
        const respuesta = await axios.get(`https://api.rawg.io/api/genres/${idGenero}?key=${RAWG_KEY}`);
        const genero = respuesta.data;
        const descripcionFormateada = wordwrap(load(genero.description).text() || 'No disponible', 80, '\n', false);
        console.log(`Nombre del Género: ${genero.name}\nCantidad: ${genero.games_count || 'No disponible'}\nDescripcion: ${descripcionFormateada || 'No disponible'}
        `);
    } catch (error) {
        console.error('Error al obtener detalles del género:', error.message);
    }
}
//Realiza la solicitud a la API para obtener el listado de juegos de un género especificado ordenados por popularidad.
async function obtenerListadoDeJuegosDesdeAPI(idGenero) {
    try {
        const respuesta = await axios.get(`https://api.rawg.io/api/games?key=${RAWG_KEY}`, {
            params: {
                genres: idGenero,
                ordering: 'popularity',
            },
        });
        return respuesta.data.results.map(juego => ({ name: juego.name, value: juego.name }));
    } catch (error) {
        throw new Error('Error al obtener el listado de juegos por género:', error.message);
    }
}
//Crea opciones para Inquirer con nombres y valores, muestra los juegos y permite al usuario seleccionar uno.
async function mostrarRadioJuegoPorGenero(idGenero) {
    try {
        const juegos = await obtenerListadoDeJuegosDesdeAPI(idGenero);
        const respuestasUsuario = await inquirer.prompt([
            {
                type: 'list',
                name: 'juegoSeleccionado',
                message: 'Selecciona un juego:',
                choices: juegos,
                default: juegos[0].name
            },
        ]);

        return respuestasUsuario.juegoSeleccionado;
    } catch (error) {
        throw new Error('Error al seleccionar el juego:', error.message);
    }
}
async function obtenerJuegoGigantBomb(nombreJuego) {
    try {
        const url = `https://www.giantbomb.com/api/search/?api_key=${GIGANTBOMB_KEY}&format=json&query=${nombreJuego}&resources=game`;
        const respuesta = await axios.get(url);
        const juego = respuesta.data.results[0];
        if (!juego) {
            throw new Error('Juego no encontrado');
        }
        return juego;
    } catch (error) {
        throw new Error(`Error al buscar el juego por nombre: ${error.message}`);
    }
}
// Utilizar la función para obtener detalles de un juego específico
async function mostrarFichaJuego() {
    try {
        const juego = await obtenerJuegoGigantBomb(await mostrarRadioJuegoPorGenero(await mostrarRadioGenerosOrdenados()));
        const descripcionFormateada = wordwrap(load(juego.deck).text() || 'No disponible', 80, '\n', false);
        console.log(`Nombre: ${juego.name}\nFecha de Lanzamiento: ${juego.original_release_date || 'Desconocida'}\nDescripción: ${descripcionFormateada || 'No Disponible'}`);

    } catch (error) {
        console.error('Error al mostrar la ficha del juego:', error.message);
    }
}

function wordwrap(str, width, brk, cut) {
    brk = brk || '\n';
    width = width || 80;
    cut = cut || false;

    if (!str) {
        return str;
    }

    const regex = new RegExp('.{1,' + width + '}(\\s|$)|\\S+?(\\s|$)', 'g');
    const lines = str.match(regex) || [];

    if (cut) {
        for (let i = 0; i < lines.length; i++) {
            lines[i] = lines[i].substring(0, width);
        }
    }

    return lines.join(brk);
}

export { mostrarGenerosFavoritos, mostrarDetallesGenero, mostrarFichaJuego };