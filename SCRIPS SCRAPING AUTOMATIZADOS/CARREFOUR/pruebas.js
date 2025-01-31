

//IMPORTAMOS LIBRERIAS
import puppeteer from 'puppeteer';
import ExcelJS from 'exceljs';


async function scrapeData() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--start-fullscreen', '--no-sandbox', '--disable-setuid-sandbox'],
  }); //GENERAMOS UNA NUEVA INSTANCIA DE BUSCADOR
  const page = await browser.newPage(); //GENERAMOS UNA VENTANA

  await page.setViewport({
    width: 1400, // Ancho deseado en píxeles
    height: 1080, // Altura opcional en píxeles
    deviceScaleFactor: 1,
  });
  let selectorFound = false;
  let attempts = 0;
  const maxAttempts = 10; // Número máximo de intentos
  let i =0;
  let x =1;
  const arrayProductos = [];
  const rows = [];
  //LINKS DE LAS CATEGORIAS QUE VISITAREMOS
  const linksCategorias = [ 
    // "https://www.carrefour.com.ar/Desayuno-y-merienda/Galletitas-bizcochitos-y-tostadas",
    // "https://www.carrefour.com.ar/Desayuno-y-merienda/Budines-y-magdalenas",
    // "https://www.carrefour.com.ar/Desayuno-y-merienda/Cereales-y-barritas",
    // "https://www.carrefour.com.ar/Desayuno-y-merienda/Golosinas-y-chocolates",
    // "https://www.carrefour.com.ar/Desayuno-y-merienda/Infusiones",
    // "https://www.carrefour.com.ar/Desayuno-y-merienda/Yerba",
    // "https://www.carrefour.com.ar/Almacen/Aceites-y-vinagres",
    // "https://www.carrefour.com.ar/Almacen/Snacks",
    // "https://www.carrefour.com.ar/Almacen/Arroz-y-legumbres",
    // "https://www.carrefour.com.ar/Almacen/Reposteria-y-postres",
    // "https://www.carrefour.com.ar/Bebidas/Cervezas",
    // "https://www.carrefour.com.ar/Bebidas/Gaseosas",
    // "https://www.carrefour.com.ar/Bebidas/Aguas/Aguas-saborizadas",
    // "https://www.carrefour.com.ar/Bebidas/Jugos/Jugos-en-polvo",
    // "https://www.carrefour.com.ar/Panaderia/Panificados",
     //"https://www.carrefour.com.ar/Lacteos-y-productos-frescos/Yogures",
   //"https://www.carrefour.com.ar/Limpieza/Papeles-higienicos"
   //PRUEBA----------------
   "https://www.carrefour.com.ar/Bebidas/Cervezas?initialMap=c,c&initialQuery=bebidas/cervezas&map=category-1,category-2,brand,brand,brand&page=1&query=/bebidas/cervezas/andes/corona/penon-del-aguila&searchState"
  ]
  
  try {
    for(let link of linksCategorias){
      i++;
      console.log("["+i+"]"+" CATEGORIA DE "+"["+linksCategorias.length+"]");
      try{
        // NAVEGA AL ENLACE INDICADO
        await page.goto(link);
        }catch{
            console.log("ERROR AL ABRIR")
        }
    }
  }catch{

  }
}

await scrapeData();