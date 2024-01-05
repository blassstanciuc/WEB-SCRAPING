let urlsCategorias = [
    "https://www.disco.com.ar/bebidas/aguas/aguas-sin-gas",
    "https://www.disco.com.ar/almacen/aderezos/mayonesas"
];
var nuevaVentana;
comienzo();

async function comienzo() {
   // for (let x = 0; x < urlsCategorias.length; x++) {
        nuevaVentana = window.open(urlsCategorias[0]);
        nuevaVentana.addEventListener('load',()=>{
           
        })
            cerrarVentana(nuevaVentana);     
            nuevaVentana.close();
   //}

    console.log("Todas las ventanas han sido procesadas");
}

function cargaVentana(){
    return new Promise((resolve) => { 
        setTimeout(()=>{
            console.log("HOLA EN EL TIMER");
            resolve();
    },10000);
    })
}

function cerrarVentana(nuevaVentana){
        nuevaVentana.close();
}
function abrirVentana(url) {
        console.log("Abriendo ventana: " + url);
        return window.open(url);
}

