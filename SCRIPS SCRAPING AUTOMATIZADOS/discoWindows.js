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
  let enlaces = [];
  const linksCategorias = [
    'https://www.disco.com.ar/almacen/aderezos/mayonesas',
    'https://www.disco.com.ar/Lacteos/Dulce-de-Leche'
  ]
  const rows = [];
  try {
    for(let link of linksCategorias){
      i++;
      console.log("["+i+"]"+" CATEGORIA DE "+"["+linksCategorias.length+"]");
      try{
        // Navega a la página principal
        await page.goto(link);
        // Calcular la altura total de la página
        const bodyHandle = await page.$('body');
        const { height } = await bodyHandle.boundingBox();
        await bodyHandle.dispose();

        // Hacer scroll hasta el final de la página
        await page.evaluate((height) => {
            window.scrollTo(0, height);
        }, height);
        await loadMoreProducts(page);//CARGAMOS TODOS LOS PRODUCTOS DE LA PAGINA
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
        const priceProducto = document.querySelector('div.contenedor-precio-pdp')?.innerText.trim();

       // const precioPromocional = document.querySelector('#productInfoContainer div.product_discount_container div.image_discount_container span.text_price_discount')?.innerText.split('D');
        //let precioUnitarioPromocional = document.querySelector('#productInfoContainer div.product_discount div.first_price_discount_container span.price_discount')?.innerText;
        //const unidad = document.querySelector('#productInfoContainer #atg_store_productMoreInfo span.unit')?.innerText.split(" ");
        
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
       // arrayProductos.push(precioPromocional?precioPromocional[0]:"");
        //PRECIO UNITARIO PROMOCIONAL
        //if(precioPromocional && !precioUnitarioPromocional){
         // precioUnitarioPromocional = document.querySelector('#productInfoContainer div.product_discount div.first_price_discount_container span.price_discount_gde')?.innerText;
       // }
       // arrayProductos.push(precioUnitarioPromocional?precioUnitarioPromocional:"");
        //PRECIO OFERTA
        arrayProductos.push("");
        //PRECIO POR UNIDAD DE MEDIDA
        //arrayProductos.push(unidad?unidad[5]:"");
        //UNIDAD DE MEDIDA
        //arrayProductos.push(unidad?unidad[3]:"");
        //PRECIO ANTIGUO
        arrayProductos.push("");
        return arrayProductos;  
        // return{
        //   categoriaProducto,
        //   eanElement,
        //   descripcion,
        //   priceProducto
        // }
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
async function loadMoreProducts(page) {
    await page.waitForSelector('section.vtex-slider-layout-0-x-sliderLayoutContainer', { visible: true });
    await page.waitForSelector('div.vtex-search-result-3-x-galleryItem', { visible: true });
    const isOnePage = await page.evaluate(() => {
        let buttonMoreProducts = document.querySelector('section.vtex-store-components-3-x-container div.container p.text-content strong')?.innerText.split(" ");
        return buttonMoreProducts;
    });

    await page.waitForSelector('section.vtex-store-components-3-x-container div.container p.text-content strong');
    console.log(isOnePage[0]+" - "+isOnePage[2]);
    if (isOnePage[0]!=isOnePage[2]) {
        console.log("HAY BOTON");
        console.log(isOnePage[0]+" - "+isOnePage[2]);
       
        const expectedElementCount = Number(isOnePage[0]); // Ajusta esto al número esperado de elementos
        console.log("El numero que se espera es "+expectedElementCount)

        await page.waitForFunction((expectedCount) => {
            const elements = document.querySelectorAll('div.vtex-search-result-3-x-galleryItem section a.vtex-product-summary-2-x-clearLink');
            return elements.length <= expectedCount;
        }, {}, expectedElementCount);

        await page.click('section.vtex-store-components-3-x-container div.vtex-search-result-3-x-buttonShowMore button.vtex-button');
        console.log("PASE EL CLICK");
        await loadMoreProducts(page);
    } else {
        // const expectedElementCount = Number(isOnePage[0]);
        // await page.waitForFunction((expectedCount) => {
        //     const elements = document.querySelectorAll('div.vtex-search-result-3-x-galleryItem section a.vtex-product-summary-2-x-clearLink');
        //     return elements.length <= expectedCount;
        // }, {}, expectedElementCount);

        await page.waitForSelector('section.vtex-slider-layout-0-x-sliderLayoutContainer', { visible: true });
        await page.waitForSelector('div.vtex-search-result-3-x-galleryItem', { visible: true });
        // Esperar un breve momento para permitir que la página cargue completamente
        const linksProductos = await page.evaluate(() => {
            const links = document.querySelectorAll('div.vtex-search-result-3-x-galleryItem section a.vtex-product-summary-2-x-clearLink');
            console.log(links);
            enlaces = [];
            
            for (let producto of links) {
                enlaces.push(producto);
            }
            return enlaces;
        });
        console.log("CANTIDAD DE LINKS QUE TOMA "+linksProductos.length);
        //await openProducts(linksProductos, browser, rows);
        console.log("NO HAY BOTON");
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
  //const filePath = 'C:/Users/Blas/Desktop/' + fileName; // Cambia la ruta según tus necesidades WINDOWS
  const filePath = '/home/blas/Descargas/' + fileName; // Cambia la ruta según tus necesidades

  try {
    await workbook.xlsx.writeFile(filePath);
    console.log(`Archivo Excel creado en: ${filePath}`);
  } catch (error) {
    console.log("ERROR AL GUARDAR EL ARCHIVO EXCEL", error);
  }
}

// Llama a la función principal
scrapeData();