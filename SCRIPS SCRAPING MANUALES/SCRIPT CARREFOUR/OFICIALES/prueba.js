// URL que deseas abrir
var url = "https://diaonline.supermercadosdia.com.ar/desayuno/para-untar/miel";

// Código JavaScript que deseas ejecutar en la consola
var script = "console.log('¡Hola desde la consola PERRAS!');";

// Abre la URL en una nueva ventana o pestaña del navegador
var ventanaNueva = window.open(url);

// Espera a que la ventana se cargue completamente
ventanaNueva.onload = function() {
  // Ejecuta el script en la consola de la nueva ventana
  ventanaNueva.eval(script);
};