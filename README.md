
PIXEL FINDER

  Pixel Finder es una aplicación de búsqueda de juegos que utiliza la API de Rawg.io y Giant Bomb para proporcionar información sobre juegos y géneros.

Instalacion

  Clona el repositorio desde GitHub
    git clone https://github.com/Klain/pixelfinder.git
    
  o desde NPM:
    npm install pixelfinder


  Instala las dependencias:
    npm install

Uso

  Para iniciar la aplicación, ejecuta el siguiente comando en la terminal:
    npm start

  La aplicación te guiará a través de un menú interactivo donde podrás buscar juegos, géneros y configurar tus géneros favoritos.

Dependencias

  Axios: Para realizar solicitudes HTTP a la API.
  Inquirer: Para crear interfaces de línea de comandos interactivas.
  Cheerio: Para analizar y manipular el HTML obtenido de la API.

Configuración

  Antes de ejecutar la aplicación, asegúrate de tener las siguientes claves de API:
    Clave de API de Rawg.io
    Clave de API de Giant Bomb

Estructura del Proyecto

  inquirerUI.js: Contiene las funciones para los menús interactivos.
  apiRequests.js: Contiene las funciones para realizar solicitudes a las API.
  app.js: Punto de entrada de la aplicación.

Contribuciones
  
  ¡Contribuciones son bienvenidas! Si encuentras algún problema o tienes sugerencias, por favor crea un issue o envía un pull request.

Licencia
  
  Este proyecto está bajo la Licencia MIT - consulta el archivo LICENSE para más detalles.
