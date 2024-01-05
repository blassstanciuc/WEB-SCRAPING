//process.env.PUPPETEER_EXECUTABLE_PATH = path.join(__dirname, '.local-chromium', 'chrome-linux', 'chrome');
import puppeteer from 'puppeteer';
import ExcelJS from 'exceljs';
import  writeFileSync from 'fs';
import  saveAs  from 'file-saver';

async function scrapeData() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--start-fullscreen', '--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  let i =0;
  const linksCategorias = [
// 'https://www.disco.com.ar/Almacen/Desayuno-y-Merienda',
// 'https://www.disco.com.ar/Almacen/Golosinas-y-Chocolates',
// 'https://www.disco.com.ar/Almacen/Para-Preparar',
// 'https://www.disco.com.ar/Almacen/Pastas-Secas-y-Salsas',
// 'https://www.disco.com.ar/Almacen/Snacks',
// 'https://www.disco.com.ar/Almacen/Panificados',
// 'https://www.disco.com.ar/Almacen/Aceites-y-Vinagres?initialMap=c,c&initialQuery=almacen/aceites-y-vinagres&map=category-1,category-2,category-3,category-3&query=/almacen/aceites-y-vinagres/aceites-comunes/aceites-especiales&searchState',
// 'https://www.disco.com.ar/Almacen/Arroz-y-Legumbres?initialMap=c,c&initialQuery=almacen/arroz-y-legumbres&map=category-1,category-2,category-3,category-3&query=/almacen/arroz-y-legumbres/arroz/arroz-listos&searchState',
// 'https://www.disco.com.ar/Lacteos/Yogures',
// 'https://www.disco.com.ar/perfumeria/cuidado-personal/jabones',
// 'https://www.disco.com.ar/limpieza/papeles/papel-higienico',
// 'https://www.disco.com.ar/Bebidas/Cervezas',
// 'https://www.disco.com.ar/bebidas/aguas/aguas-saborizadas',
// 'https://www.disco.com.ar/Bebidas/Gaseosas',
  'https://www.disco.com.ar/bebidas/jugos/en-polvo'
  ]
  const rows = [];
  try {
    for(let link of linksCategorias){
      i++;
      console.log("["+i+"]"+" CATEGORIA DE "+"["+linksCategorias.length+"]");
      try{
        // Navega a la página principal
        await page.goto(link);
        await page.waitForSelector('section.vtex-store-components-3-x-container');

        await loadMoreProducts(page,browser,rows);//CARGAMOS TODOS LOS PRODUCTOS DE LA PAGINA

            //await openNextPage(page,browser,arrayProductos,rows,i)
            //await createExcel(rows);
            console.log("CATEGORIA FINALIZADA");
      }
      catch(error){
        console.error('ERROR AL ABRIR LA CATEGORIA '+"["+i+"]",error);
      }
    }  
  } catch (error) {
    console.error('Error during scraping:', error);
  } finally {
    // Cierra el navegador al finalizar
    console.log("FIN DEL SCRAPEO by BLAS");
    await createExcel(rows);
    await browser.close();
  }
}

async function openProducts(productos,browser,rows) {
  // Recorre los enlaces y obtén datos de cada página

  for (const enlace of productos) {
    // Abre una nueva página para cada enlace
    const nuevaPagina = await browser.newPage();

    try {
      // Navega a la página correspondiente
      await nuevaPagina.goto(enlace);
      await nuevaPagina.waitForSelector('h1.vtex-store-components-3-x-productNameContainer');
      await nuevaPagina.waitForTimeout(10000);
      await nuevaPagina.waitForSelector('div.contenedor-precio-pdp');
      await nuevaPagina.waitForSelector('span.discoargentina-store-theme-2b7aTxwaRuuRkUnoQbwL9w');
      const bodyHandle = await nuevaPagina.$('body');
      const { height } = await bodyHandle.boundingBox();
      await bodyHandle.dispose();
      // Definir la velocidad de scroll y el número de pasos
      const scrollSpeed = 10;
      const numSteps = height / scrollSpeed;

      //HAGO SCROLL DESDE ARRIBA PARA BAJO
      for (let i = 0; i < numSteps; i++) {
        await nuevaPagina.evaluate((scrollSpeed) => {
          window.scrollBy(0, scrollSpeed);
        }, scrollSpeed);
        await nuevaPagina.waitForTimeout(20); 
      }
      //HAGO ESCROLL DE ABAJO PARA ARRIBA
      for (let i = 0; i < numSteps; i++) {
        await nuevaPagina.evaluate((scrollSpeed) => {
          window.scrollBy(0, -scrollSpeed);//lE RESTAMOS  PARA QUE BAJE
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
        const categoriaProducto = document.querySelector('div.view-conditions_especificaciones_table_rows div.view-new_div ul:first-child > li:last-child')?.innerText;
        const marcaProducto = document.querySelector('div.vtex-flex-layout-0-x-flexRow span.vtex-store-components-3-x-productBrandName')?.innerText;
        const eanElement ="";
        const descripcion = document.querySelector('h1.vtex-store-components-3-x-productNameContainer')?.innerText;
        const priceProducto = document.querySelector('div.contenedor-precio-pdp')?.innerText;
        const precioPromocional = document.querySelector('div.discoargentina-store-theme-117zoY_fK4ueW_76D9Ukmb span.discoargentina-store-theme-1fq_v5Ru2hmjMCzmx6XC_E')?document.querySelector('div.discoargentina-store-theme-117zoY_fK4ueW_76D9Ukmb span.discoargentina-store-theme-1fq_v5Ru2hmjMCzmx6XC_E').innerText:document.querySelector('div.discoargentina-store-theme-117zoY_fK4ueW_76D9Ukmb span.discoargentina-store-theme-1vId-Z5l1K6K82ho-1PHy6')?.innerText;
        const precioOferta = document.querySelector('div.discoargentina-store-theme-117zoY_fK4ueW_76D9Ukmb span.discoargentina-store-theme-2tHhEXdEDr-Nq08rzYO7i2')?.innerText;
        let precioUnitarioPromocional = document.querySelector('div.vtex-promotionDisclaimer p.vtex-promotionDisclaimerText')?.innerText.split(":");
        console.log(precioUnitarioPromocional)
        let unidad = document.querySelector('span.discoargentina-store-theme-2b7aTxwaRuuRkUnoQbwL9w')?.innerText.split(" ");
        let finUnidad = unidad.length;
        let unidadCompleta = unidad[finUnidad-1].split(":");
        
        //CADENA
        arrayProductos.push("Disco");
        //SUCURSAL
        arrayProductos.push("");
        //FECHA
        arrayProductos.push(fechaConSeparador?fechaConSeparador:"");
        //CATEGORIA
        arrayProductos.push(categoriaProducto?categoriaProducto:"");
        //SUBCATEGORIA
        arrayProductos.push("");
        //MARCA
        arrayProductos.push(marcaProducto?marcaProducto:"");
        //DESCRIPCION
        arrayProductos.push(descripcion?descripcion:"");
        //EAN
        arrayProductos.push(eanElement?eanElement:"");
        //PRECIO REGULAR
        arrayProductos.push(priceProducto?priceProducto:"");
        //PRECIO PROMOCIONAL
        arrayProductos.push(precioPromocional?precioPromocional:"");
        //PRECIO UNITARIO PROMOCIONAL
        arrayProductos.push(precioUnitarioPromocional?precioUnitarioPromocional[1]:"");
        //PRECIO OFERTA
        arrayProductos.push(precioOferta);
        //PRECIO POR UNIDAD DE MEDIDA
        arrayProductos.push(unidadCompleta?unidadCompleta[1]:"");
        //UNIDAD DE MEDIDA
        arrayProductos.push(unidadCompleta?unidadCompleta[0]:"");
        //PRECIO ANTIGUO
        arrayProductos.push("");
        return arrayProductos;  
      });

      // Imprime los resultados
      //console.log("Categoria: "+resultado.categoriaProducto+" | "+resultado.descripcion+" | "+resultado.eanElement+" | "+resultado.priceProducto);
      rows.push(resultado?resultado:"ERROR");
      
      //console.log(rows);
    } catch (error) {
      console.error('Error during scraping individual page:', error);
    } finally {
      // Cierra la página actual
      await nuevaPagina.close();
    }
  }
}
async function loadMoreProducts(page, browser, rows) {
    await page.waitForSelector('div.vtex-rich-text-0-x-container--sucursal');
    await page.waitForTimeout(5000);
    const bodyHandle = await page.$('body');
    const { height } = await bodyHandle.boundingBox();
    await bodyHandle.dispose();
    // Definir la velocidad de scroll y el número de pasos
    const scrollSpeed = 10;
    const numSteps = height / scrollSpeed;

    const isOnePage = await page.evaluate(() => {
        let buttonMoreProducts = document.querySelector('section.vtex-store-components-3-x-container div.container p.text-content strong')?.innerText.split(" ");
        return buttonMoreProducts;
    });

    await page.waitForSelector('section.vtex-store-components-3-x-container div.container p.text-content strong');
    console.log(isOnePage[0]+" - "+isOnePage[2]);
    if (isOnePage[0]!=isOnePage[2]) {
        console.log("HAY BOTON");
        console.log(isOnePage[0]+" - "+isOnePage[2]);
        await page.waitForSelector('div.vtex-search-result-3-x-buttonShowMore');
        await page.click('section.vtex-store-components-3-x-container div.vtex-search-result-3-x-buttonShowMore button.vtex-button');
        await page.waitForTimeout(10000);
        await loadMoreProducts(page, browser, rows);
    } else {
            //YA COMPLETO DE DESPLEGAR TODA LA CATEGORIA
            await page.evaluate(()=>{
              window.scrollTo(0,0);
            })
            console.log("NO HAY BOTON");

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

            const expectedElementCount = Number(isOnePage[0]);
            console.log("TIENEN QUE CARGAR "+expectedElementCount);
            await page.waitForFunction((expectedCount) => {
                const elements = document.querySelectorAll('div.vtex-search-result-3-x-galleryItem section a.vtex-product-summary-2-x-clearLink');
                return elements.length <= expectedCount;
            }, { visible: true }, expectedElementCount);

            const linksProductos = await page.evaluate(() => {
                const links = document.querySelectorAll('#gallery-layout-container div.vtex-search-result-3-x-galleryItem section a.vtex-product-summary-2-x-clearLink');
                let enlaces = [];
                for (let producto of links) {
                    enlaces.push(producto.href);
                }
                return enlaces;
            });
            console.log("CANTIDAD DE LINKS QUE TOMA "+linksProductos.length);
            await openProducts(linksProductos, browser, rows);
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
  const fileName= 'Disco_'+fechaConSeparador+'.xlsx';
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
  //const filePath = '/home/blas/Descargas/' + fileName; // WINDOWS

  try {
    await workbook.xlsx.writeFile(filePath);
    console.log(`Archivo Excel creado en: ${filePath}`);
  } catch (error) {
    console.log("ERROR AL GUARDAR EL ARCHIVO EXCEL", error);
  }
}

// Llama a la función principal
scrapeData();
