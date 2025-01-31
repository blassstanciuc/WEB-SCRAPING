//process.env.PUPPETEER_EXECUTABLE_PATH = path.join(__dirname, '.local-chromium', 'chrome-linux', 'chrome');
import puppeteer from 'puppeteer';
import ExcelJS from 'exceljs';
import chalk  from 'chalk';
import  writeFileSync from 'fs';
import  saveAs  from 'file-saver';

async function scrapeData() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--start-fullscreen', '--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setDefaultTimeout(120000);
  let i =1;
  let selectorFound = false;
  let attempts = 0;
  const maxAttempts = 10;
  const linksCategorias = [
    "https://www.masonline.com.ar/aceites-vinagres-y-aderezos/aceites",
    "https://www.masonline.com.ar/arroz-legumbres-y-pastas/arroz",
    "https://www.masonline.com.ar/arroz-legumbres-y-pastas/pastas-secas",
    "https://www.masonline.com.ar/desayunos-y-meriendas?initialMap=c&initialQuery=desayunos-y-meriendas&map=category-1,category-2&query=/desayunos-y-meriendas/galletitas-dulces&searchState",
    "https://www.masonline.com.ar/desayunos-y-meriendas?initialMap=c&initialQuery=desayunos-y-meriendas&map=category-1,category-2&query=/desayunos-y-meriendas/yerbas&searchState",
    "https://www.masonline.com.ar/desayunos-y-meriendas?initialMap=c&initialQuery=desayunos-y-meriendas&map=category-1,category-2&query=/desayunos-y-meriendas/te&searchState",
    "https://www.masonline.com.ar/desayunos-y-meriendas?initialMap=c&initialQuery=desayunos-y-meriendas&map=category-1,category-2&query=/desayunos-y-meriendas/cereales&searchState",
    "https://www.masonline.com.ar/desayunos-y-meriendas?initialMap=c&initialQuery=desayunos-y-meriendas&map=category-1,category-2&query=/desayunos-y-meriendas/cafe&searchState",
    "https://www.masonline.com.ar/desayunos-y-meriendas?initialMap=c&initialQuery=desayunos-y-meriendas&map=category-1,category-2&query=/desayunos-y-meriendas/galletitas-saladas&searchState",
    "https://www.masonline.com.ar/desayunos-y-meriendas?initialMap=c&initialQuery=desayunos-y-meriendas&map=category-1,category-2&query=/desayunos-y-meriendas/endulzantes&searchState",
    "https://www.masonline.com.ar/desayunos-y-meriendas?initialMap=c&initialQuery=desayunos-y-meriendas&map=category-1,category-2&query=/desayunos-y-meriendas/tostadas-grisines-y-marineras&searchState",
    "https://www.masonline.com.ar/desayunos-y-meriendas?initialMap=c&initialQuery=desayunos-y-meriendas&map=category-1,category-2&query=/desayunos-y-meriendas/galletas-de-arroz&searchState",
    "https://www.masonline.com.ar/desayunos-y-meriendas?initialMap=c&initialQuery=desayunos-y-meriendas&map=category-1,category-2&query=/desayunos-y-meriendas/budines-magdalenas-y-otros&searchState",
    "https://www.masonline.com.ar/desayunos-y-meriendas?initialMap=c&initialQuery=desayunos-y-meriendas&map=category-1,category-2&query=/desayunos-y-meriendas/bizcochos&searchState",
    "https://www.masonline.com.ar/kiosco?initialMap=c&initialQuery=kiosco&map=category-1,category-2&query=/kiosco/chocolates&searchState","https://www.masonline.com.ar/kiosco?initialMap=c&initialQuery=kiosco&map=category-1,category-2&query=/kiosco/golosinas&searchState","https://www.masonline.com.ar/kiosco?initialMap=c&initialQuery=kiosco&map=category-1,category-2&query=/kiosco/alfajores&searchState",
    "https://www.masonline.com.ar/panificados?initialMap=c&initialQuery=panificados&map=category-1,category-2,category-2,category-2&query=/panificados/pan-arabe-tortillas-y-otros/pan-lactal/pan-para-hamburguesas-y-panchos&searchState",
    "https://www.masonline.com.ar/reposteria",
    "https://www.masonline.com.ar/snacks",
    "https://www.masonline.com.ar/cervezas",
    "https://www.masonline.com.ar/gaseosas?order=pricePerUnit:asc",
    "https://www.masonline.com.ar/aguas/agua-saborizada",
    "https://www.masonline.com.ar/jugos/en-polvo",
    "https://www.masonline.com.ar/cuidado-del-cabello/shampoo",
    "https://www.masonline.com.ar/cuidado-del-cabello?initialMap=c&initialQuery=cuidado-del-cabello&map=category-1,category-2&query=/cuidado-del-cabello/acondicionador&searchState",
    "https://www.masonline.com.ar/cuidado-personal/desodorantes-y-antitranspirantes",
    "https://www.masonline.com.ar/cocina/detergentes-y-lavavajillas",
    "https://www.masonline.com.ar/papeles-bolsas-y-films?initialMap=c&initialQuery=papeles-bolsas-y-films&map=category-1,category-2,category-2,category-2,category-2&query=/papeles-bolsas-y-films/panuelos-descartables/papel-higienico/rollos-de-cocina/servilletas-descartables&searchState"]
  const rows = [];
  try {
    console.log(" ");
    console.log(chalk.green.underline('                         [SUCURSAL MAS ONLINE]                         '));
    console.log(" ");
    console.log("               TOTAL DE CATEGORIAS A ESCRAPEAR "+"["+linksCategorias.length+"]");
    for(let link of linksCategorias){
      console.log("               -> ["+i+"]"+" CATEGORIA DE "+"["+linksCategorias.length+"]");
      i++;
      try{
        // Navega a la página principal
        await page.goto(link);
        //await page.waitForNavigation();
        //Eperamos 10S antes de iniciar----------------------------------
        let tiempoDeEsperaInicio = 10000;
        await page.evaluate(async (waitTime) => {
        // Utiliza la función setTimeout para esperar el tiempo especificado
        await new Promise(resolve => setTimeout(resolve, waitTime));
        }, tiempoDeEsperaInicio);
        //---------------------------------------------------------------
        //MODULO DE RECARGA
        while (!selectorFound && attempts < maxAttempts) {
        try {
          // Espera hasta que aparezca el selector en la página
          await page.waitForSelector('section.vtex-product-summary-2-x-container', { timeout: 2000 });
          selectorFound = true; // Se encontró el selector
          console.log("SELECTOR DE CATEGORIA ENCONTRADO");
            } catch (error) {
            console.error('Selector no encontrado, recargando página...');
            attempts++;
            await page.reload();
            await page.evaluate(() => {
            return new Promise(resolve => {
              setTimeout(resolve, 2000);
            });
          });
        }
        }  
        await loadMoreProducts(page,browser,rows);//CARGAMOS TODOS LOS PRODUCTOS DE LA PAGINA
        selectorFound = false;
        console.log(chalk.yellow("--------------------------------------"));    
        console.log("                   CATEGORIA FINALIZADA");
        console.log(chalk.yellow("--------------------------------------"));   
      }
      catch(error){
        console.error('ERROR AL ABRIR LA CATEGORIA '+"["+i+"]",error);
      }
    }  
  } catch (error) {
    console.error('Error during scraping:', error);
  } finally {
    // Cierra el navegador al finalizar
    console.log(chalk.red("FIN DEL SCRAPEO by BLAS :)"));
    await createExcel(rows);
    await browser.close();
  }
}

async function loadMoreProducts(page, browser, rows) {
    //await page.waitForSelector('div.hiperlibertad-category-page-custom-1-x-customBanner--container');
    await page.waitForTimeout(5000);
    
    //Selecionamos el largo del sitio
    const bodyHandle = await page.$('body');
    const { height } = await bodyHandle.boundingBox();
    await bodyHandle.dispose();
    // Definir la velocidad de scroll y el número de pasos
    const scrollSpeed = 20;
    const numSteps = height / scrollSpeed;

    //HAGO SCROLL DESDE ARRIBA PARA BAJO
    for (let i = 0; i < numSteps; i++) {
      await page.evaluate((scrollSpeed) => {
        window.scrollBy(0, scrollSpeed);
      }, scrollSpeed);
      await page.waitForTimeout(20); 
    }
    await page.waitForTimeout(2000);
    //Debemos seleccionar el boton de ver mas productos para saber si hay que cargar mas productos...
    const btnMoreProducts = await page.$("div.vtex-search-result-3-x-buttonShowMore a div");
    console.log("EL BOTON ES "+btnMoreProducts);
    await page.waitForTimeout(2000);
    if (btnMoreProducts!=undefined ||btnMoreProducts!=null ) {
        console.log("HAY BOTON");
        await page.click("div.vtex-search-result-3-x-buttonShowMore a div");
        //await page.waitForNavigation();
        await page.waitForTimeout(10000);
        await loadMoreProducts(page, browser, rows);
    } else {
            //YA COMPLETO DE DESPLEGAR TODA LA CATEGORIA
            console.log("NO HAY BOTON");
            await page.evaluate(()=>{
              window.scrollTo(0,0);
            })

            //HAGO SCROLL DESDE ARRIBA PARA BAJO
            for (let i = 0; i < numSteps; i++) {
              await page.evaluate((scrollSpeed) => {
                window.scrollBy(0, scrollSpeed);
              }, scrollSpeed);
              await page.waitForTimeout(20); 
            }

            //HAGO ESCROLL DE ABAJO PARA ARRIBA
            for (let i = 0; i < numSteps; i++) {
              await page.evaluate((scrollSpeed) => {
                window.scrollBy(0, -scrollSpeed);//lE RESTAMOS  PARA QUE BAJE
              }, scrollSpeed);
              await page.waitForTimeout(20); 
            } 
            const linksProductos = await page.evaluate(() => {
                const links = document.querySelectorAll('div.vtex-search-result-3-x-galleryItem section.vtex-product-summary-2-x-container a');
                let enlaces = [];
                for (let producto of links) {
                    enlaces.push(producto.href);
                }
                return enlaces;
            });
            console.log("["+linksProductos.length+"]"+" PRODUCTOS");
            await openProducts(linksProductos, browser, rows);
      }
}

async function cargarPaginaConReintentos(url,nuevaPagina) {
  for (let i = 0; i < 3; i++) {
    try {
      await nuevaPagina.goto(url);
      await nuevaPagina.waitForSelector('h1.vtex-store-components-3-x-productNameContainer span'); // Esperar a que aparezca el selector
      console.log('Página cargada correctamente');
      return true; // Salir del bucle si la página se carga correctamente
    } catch (error) {
      console.error('Error durante el cargado de la web:', error);
      console.log(`Intento ${i + 1}/${i}. Reintentando...`);
      await nuevaPagina.waitForTimeout(5000);
    }
  }
  console.error(`No se pudo cargar la página después de ${i} intentos.`);
  return false;
}


async function openProducts(productos,browser,rows) {
  // Recorre los enlaces y obtén datos de cada página
  console.log(chalk.red("                   OBTENIENDO DATOS..."));
  const nuevaPagina = await browser.newPage();

    try { 
       for (const enlace of productos) {
    // Abre una nueva página para cada enlace
    await nuevaPagina.setDefaultTimeout(120000);
      //console.log("Abriendo producto "+"["+indice+"]");
      // Navega a la página correspondiente
     // await nuevaPagina.goto(enlace);
     const paginaCargada = await cargarPaginaConReintentos(enlace, nuevaPagina);
     if (!paginaCargada) {
      console.error('No se pudo cargar la página.');
      } else {
           //await nuevaPagina.waitForSelector('h1.vtex-store-components-3-x-productNameContainer span');
           await nuevaPagina.waitForTimeout(5000);
           //await nuevaPagina.waitForNavigation();
           const bodyHandle = await nuevaPagina.$('body');
           const { height } = await bodyHandle.boundingBox();
           await bodyHandle.dispose();
           // Definir la velocidad de scroll y el número de pasos
           const scrollSpeed = 20;
           const numSteps = height / scrollSpeed;
     
           //HAGO SCROLL DESDE ARRIBA PARA BAJO
           for (let i = 0; i < numSteps; i++) {
             await nuevaPagina.evaluate((scrollSpeed) => {
               window.scrollBy(0, scrollSpeed);
             }, scrollSpeed);
             await nuevaPagina.waitForTimeout(20); 
           }
             // Realiza acciones para obtener datos de la página, por ejemplo:
             const resultado = await nuevaPagina.evaluate(() => {
             // optionals values
             const fechaActual = new Date();
             // Obtener el día, el mes y el año de la fecha actual
             const dia = fechaActual.getDate().toString().padStart(2, '0');
             const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // Nota: getMonth() devuelve un valor entre 0 y 11, sumamos 1 para obtener el mes real
             const año = fechaActual.getFullYear();
             // Crear una cadena de texto en formato "dd/mm/yyyy"
             const fechaConSeparador = dia + '/' + mes + '/' + año;
             const arrayProductos = [];
             const marcaProducto = document.querySelector('div.vtex-store-components-3-x-productBrandContainer span.vtex-store-components-3-x-productBrandName')?.innerText;
             //const eanElement =document.querySelector('script[data-flix-ean]');
             //const eanNumber = eanElement?eanElement.getAttribute('data-flix-ean'):"";
             const descripcion = document.querySelector('h1.vtex-store-components-3-x-productNameContainer span')?.innerText;
             const priceProducto = document.querySelector('div.valtech-gdn-dynamic-product-0-x-dynamicProductPrice')?.innerText;
             console.log(priceProducto);
             const precioAntiguo = document.querySelector('span.valtech-gdn-dynamic-product-0-x-weighableListPrice')?.innerText;
             const precioUnidadDeMedida = document.querySelector('span.valtech-gdn-dynamic-weight-price-0-x-currencyContainer')?.innerText;
             const UnidadDeMedida = document.querySelector('span.valtech-gdn-dynamic-weight-price-0-x-unit')?.innerText;
             console.log(UnidadDeMedida);
             let promoEj2X1;
             let promoSegundoAlPorcentaje;
             let promoMenosPorcentaje;
             //LUEGO ANALIZARE LA PROMO QUE TRAE PARA DETERMINAR QUE ES
             const promo = document.querySelector('div.valtech-gdn-custom-highlights-0-x-customHighlightTextContainer span')?.innerText;
             //const descuento = document.querySelector('div.valtech-gdn-dynamic-product-0-x-weighableSavingsContainer span.valtech-gdn-dynamic-product-0-x-weighableSavingsPercentage')?.innerText;
             //console.log(descuento);
             
             //CADENA
             arrayProductos.push("Mas Online");
             //SUCURSAL
             arrayProductos.push("");
             //FECHA
             arrayProductos.push(fechaConSeparador?fechaConSeparador:"");
             //CATEGORIA
             arrayProductos.push("");
             //SUBCATEGORIA
             arrayProductos.push("");
             //MARCA
             arrayProductos.push(marcaProducto?marcaProducto:"");
             //DESCRIPCION
             arrayProductos.push(descripcion?descripcion:"");
             //EAN
             arrayProductos.push("");
             //PRECIO REGULAR
             arrayProductos.push(precioAntiguo==null || precioAntiguo==undefined?priceProducto:precioAntiguo);
             //PRECIO PROMOCIONAL
             arrayProductos.push(promo);       
             //PRECIO UNITARIO PROMOCIONAL
             arrayProductos.push("");
             //PRECIO OFERTA
             arrayProductos.push(precioAntiguo!=null || precioAntiguo!=undefined?priceProducto:"");
             //PRECIO POR UNIDAD DE MEDIDA
             arrayProductos.push(precioUnidadDeMedida);
             //UNIDAD DE MEDIDA
             arrayProductos.push(UnidadDeMedida);
             //PRECIO ANTIGUO
             arrayProductos.push("");
             return arrayProductos;  
           });
     
           // Imprime los resultados
           //console.log("Categoria: "+resultado.categoriaProducto+" | "+resultado.descripcion+" | "+resultado.eanElement+" | "+resultado.priceProducto);
           rows.push(resultado?resultado:"ERROR");
           
           //console.log("TERMINE DE RECORRER EL PRODUCTO");
      } 
    }
    } catch (error) {
      console.error('Error during scraping individual page:', error);
    } finally {
      // Cierra la página actual
      console.log("FINALIZANDO CAT");
      await nuevaPagina.close();
    }
  }




async function createExcel(rows) {
  const fechaActual = new Date();
  // Obtener el día, el mes y el año de la fecha actual
  const dia = fechaActual.getDate().toString().padStart(2, '0');
  const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // Nota: getMonth() devuelve un valor entre 0 y 11, sumamos 1 para obtener el mes real
  const año = fechaActual.getFullYear();
  // Crear una cadena de texto en formato "dd/mm/yyyy"
  const fechaConSeparador = dia + '_' + mes + '_' + año;
  const workbook = new ExcelJS.Workbook();
  const fileName= 'masOnlineGenerica'+fechaConSeparador+'.xlsx';
  const worksheet = workbook.addWorksheet('Productos');

  const Columnas = [
    {header: 'Cadena'},
    {header: 'Sucursal'},
    {header: 'Fecha Scraping'},
    {header: 'Categoria'},
    {header: 'Subcategoria'},
    {header: 'Marca Cadena'},
    {header: 'Descripcion Cadena'},
    {header: 'EAN'},
    {header: 'Precio Regular'},
    {header: 'Precio Promocional'},
    {header: 'Precio Unitario Promocional'},
    {header: 'Precio Oferta'},
    {header: 'Precio Por Unidad de Medida'},
    {header: 'Unidad de Medida'},
    {header: 'Precio Antiguo'}

  ]
  worksheet.columns = Columnas;
  for(let row of rows){
    worksheet.addRow(row);
  }
  const filePath = '/home/blas/Descargas/' + fileName; // Cambia la ruta según tus necesidades
  //const filePath = 'C:/Users/Administrator/Desktop/WEB_SCRAPING/ARCHIVOS/MASONLINE/' + fileName; // WINDOWS

  try {
    await workbook.xlsx.writeFile(filePath);
    console.log(`Archivo Excel creado en: ${filePath}`);
  } catch (error) {
    console.log("ERROR AL GUARDAR EL ARCHIVO EXCEL", error);
  }
}

// Llama a la función principal
scrapeData();
