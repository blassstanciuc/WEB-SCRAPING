
//HACER QUE EL SCROLL DE RECORRIDA DE CPAGE BAJE HASTA EL BOTON DE MAS, LO SACAREMOS CON GRADOS
//process.env.PUPPETEER_EXECUTABLE_PATH = path.join(__dirname, '.local-chromium', 'chrome-linux', 'chrome');

import puppeteer from 'puppeteer';
import ExcelJS from 'exceljs';
import chalk  from 'chalk';
import  writeFileSync from 'fs';
import  saveAs  from 'file-saver';

async function scrapeData() {
  const browser = await puppeteer.launch({
   // headless: false,
    args: ['--start-fullscreen', '--no-sandbox', '--disable-setuid-sandbox'],
  });

  let i =1;
  let selectorFound = false;
  let attempts = 0;
  const maxAttempts = 10;
  const linksCategorias = [
   "https://diaonline.supermercadosdia.com.ar/bebidas/gaseosas"
  ]
  const rows = [];
  try {
    console.log(" ");
    console.log(chalk.green.underline('                         [SUCURSAL DIA GENERICO]                         '));
    console.log(" ");
    console.log("               TOTAL DE CATEGORIAS A ESCRAPEAR "+"["+linksCategorias.length+"]");
    for(let link of linksCategorias){
      const page = await browser.newPage();
      await page.setDefaultTimeout(120000);
      console.log("               -> ["+i+"]"+" CATEGORIA DE "+"["+linksCategorias.length+"]");
      i++;
      try{
        //MODULO DE RECARGA
        while (!selectorFound && attempts < maxAttempts) {
            try {
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
                // Espera hasta que aparezca el selector en la página
                await page.waitForSelector('#gallery-layout-container', { timeout: 2000 });
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
        if(selectorFound){
          await loadMoreProducts(page,browser,rows);//CARGAMOS TODOS LOS PRODUCTOS DE LA PAGINA
          selectorFound = false;
          console.log(chalk.yellow("--------------------------------------"));    
          console.log("                   CATEGORIA FINALIZADA");
          console.log(chalk.yellow("--------------------------------------"));  
        }else{
          console.error('ERROR AL ABRIR LA CATEGORIA '+"["+i+"]",error);
        }
 
      }
      catch(error){
        console.error('ERROR AL ABRIR LA CATEGORIA '+"["+i+"]",error);
      }
      await page.close();
    }  
  } catch (error) {
    console.error('Error during scraping:', error);
    await page.close();
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
    //await page.waitForSelector('div.vtex-flex-layout-0-x-flexRow--container-footer');
    //const footer = page.$('div.vtex-flex-layout-0-x-flexRow--container-footer');
    //Selecionamos el largo del sitio
    const bodyHandle = await page.$('body');
    const { height } = await bodyHandle.boundingBox();
    await bodyHandle.dispose();
    // Definir la velocidad de scroll y el número de pasos
    const scrollSpeed = 20;
    const numSteps = height / scrollSpeed;
    let bandera = true;
    let pageAltura;
    let pageAlturaPosterior;

    while (bandera) {
        pageAltura = await page.evaluate(() => {
            return document.body.scrollHeight;
        });
        console.log('Altura de la página:', pageAltura);

        for (let i = 0; i < numSteps; i++) {
            await page.evaluate((scrollSpeed) => {
                window.scrollBy(0, scrollSpeed);
            }, scrollSpeed);
            await page.waitForTimeout(20); 
        }
        // Esperar un poco más para asegurarse de que los productos se carguen
        await page.waitForTimeout(2000);
        pageAlturaPosterior = await page.evaluate(() => {
            return document.body.scrollHeight;
        });
        console.log('Altura de la página posterior:', pageAlturaPosterior);
        if (pageAltura === pageAlturaPosterior) {
            console.log("Se cargaron todos los productos");
            bandera = false;
        }
    }

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

    //OBTENGO TODOS LOS PRODUCTOS DE LA PAGINA
    const htmlProductos = await page.evaluate(() => {
      const itemsProductos = document.querySelectorAll('div.vtex-search-result-3-x-galleryItem');
      console.log(itemsProductos);
      let itemsProducts = [];
      for (let itemProducto of itemsProductos) {
        itemsProducts.push(itemProducto.innerHTML);
      }
      return itemsProducts;
      });
    //------------------------------------------------------
    await saveProducts(htmlProductos,page,rows);
      
}

async function saveProducts(productos,page,rows) {
    console.log(chalk.red("                   OBTENIENDO DATOS..."));

      const allProductos = productos;
      for (const producto of allProductos) {  
        try {
          const resultado = await page.evaluate((Productos) => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = Productos;
            // optionals values
            const fechaActual = new Date();
            // Obtener el día, el mes y el año de la fecha actual
            const dia = fechaActual.getDate().toString().padStart(2, '0');
            const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // Nota: getMonth() devuelve un valor entre 0 y 11, sumamos 1 para obtener el mes real
            const año = fechaActual.getFullYear();
            // Crear una cadena de texto en formato "dd/mm/yyyy"
            const fechaConSeparador = dia + '/' + mes + '/' + año;
            const arrayProductos = [];
    
            const marcaProducto = "";
     
            const eanElement ="";
  
            const descripcion = tempDiv.querySelector('span.vtex-product-summary-2-x-productBrand')?.innerText;
  
            const priceProducto = tempDiv.querySelector('span.vtex-product-price-1-x-currencyContainer')?.innerText;
            console.log(priceProducto);
            const precioAntiguo = tempDiv.querySelector('span.vtex-product-price-1-x-listPrice span.vtex-product-price-1-x-listPriceValue span.vtex-product-price-1-x-currencyContainer')?.innerText;
            const precioUnidadDeMedida = tempDiv.querySelector('span[data-specification-name="PrecioPorUnd"]')?.innerText;
            const UnidadDeMedida = tempDiv.querySelector('span[data-specification-name="UnidaddeMedida"]')?.innerText;
            const promo = tempDiv.querySelector('span.vtex-product-price-1-x-savings span')?.innerText;         

            //CADENA
            arrayProductos.push("Dia");
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
            arrayProductos.push(promo?promo:"");
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
            
          },producto);
        
        rows.push(resultado?resultado:"ERROR");
          //console.log(rows);
      } catch (error) {
        console.error('error obteniendo datos del producto individual', error);
      } 
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
  const fileName= 'diaGenerico'+fechaConSeparador+'.xlsx';
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
  // const filePath = '/home/blas/Descargas/' + fileName; // Cambia la ruta según tus necesidades
  const filePath = 'C:/Users/blass/OneDrive/Desktop/' + fileName; // WINDOWS

  try {
    await workbook.xlsx.writeFile(filePath);
    console.log(`Archivo Excel creado en: ${filePath}`);
  } catch (error) {
    console.log("ERROR AL GUARDAR EL ARCHIVO EXCEL", error);
  }
}

// Llama a la función principal
scrapeData();