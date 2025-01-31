//process.env.PUPPETEER_EXECUTABLE_PATH = path.join(__dirname, '.local-chromium', 'chrome-linux', 'chrome');

import puppeteer from 'puppeteer';
import ExcelJS from 'exceljs';
import chalk  from 'chalk';
import  writeFileSync from 'fs';
import  saveAs  from 'file-saver';

async function scrapeData() {
  const browser = await puppeteer.launch({
    //  headless: false,
    args: ['--start-fullscreen', '--no-sandbox', '--disable-setuid-sandbox'],
  });

  let i =1;
  let selectorFound = false;
  let attempts = 0;
  const maxAttempts = 10;
  const linksCategorias = [
 "https://diaonline.supermercadosdia.com.ar/almacen/golosinas-y-alfajores?O=&PS=15&page=2"
  ]
  const rows = [];
  try {
    console.log(" ");
    console.log(chalk.green.underline('                         [SUCURSAL DIA GENERICO]                         '));
    console.log(" ");
    console.log("               TOTAL DE CATEGORIAS A ESCRAPEAR "+"["+linksCategorias.length+"]");
    for(let link of linksCategorias){
      selectorFound = false;
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
          
          console.log(chalk.yellow("--------------------------------------"));    
          console.log("                   CATEGORIA FINALIZADA");
          console.log(chalk.yellow("--------------------------------------"));  
        }else{
          console.log(chalk.red('SELECTORES NO ENCONTRADOS PERO SE SCRAPEA '+"["+i+"]: "+ link ));
          await loadMoreProducts(page,browser,rows);//CARGAMOS TODOS LOS PRODUCTOS DE LA PAGINA
          console.log(chalk.yellow("--------------------------------------"));    
          console.log("                   CATEGORIA FINALIZADA");
          console.log(chalk.yellow("--------------------------------------"));  
        }
      }
      catch(error){
        console.error('ERROR AL ABRIR LA CATEGORIA '+"["+i+"] : "+ link );
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
    await page.waitForTimeout(5000);
    //Selecionamos el largo del sitio
    const bodyHandle = await page.$('body');
    const { height } = await bodyHandle.boundingBox();
    await bodyHandle.dispose();
    // Definir la velocidad de scroll y el número de pasos
    const scrollSpeed = 10;
    const numSteps = height / scrollSpeed;
    let bandera = true;
    let pageAltura;
    let pageAlturaPosterior;

      //HAGO SCROLL DESDE ARRIBA PARA BAJO
    for (let i = 0; i < numSteps; i++) {
      await page.evaluate((scrollSpeed) => {
        window.scrollBy(0, scrollSpeed);
      }, scrollSpeed);
      await page.waitForTimeout(20); 
    }
    //VUELVO UN POCO PARA ARRIBA.
    await page.evaluate((scrollAmount) => {
      window.scrollBy(0, -scrollAmount);
    }, 800);

    await page.waitForTimeout(5000);
    //Debemos seleccionar el boton de ver mas productos para saber si hay que cargar mas productos...
    const btnMoreProducts = await page.$("div.diaio-search-result-0-x-buttonShowMore button");
    console.log("EL BOTON ES "+btnMoreProducts);

    await page.waitForTimeout(5000);
    if (btnMoreProducts!=undefined ||btnMoreProducts!=null ) {
        console.log("HAY BOTON");
        await page.click("div.diaio-search-result-0-x-buttonShowMore button");
        //await page.waitForNavigation();
        await page.waitForTimeout(5000);
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

      await page.waitForTimeout(20000);
      //OBTENGO TODOS LOS LINKS DE PRODUCTOS
        const linksProductos = await page.evaluate(() => {
          const links = document.querySelectorAll('div.diaio-search-result-0-x-galleryItem section a');
          let enlaces = [];
          for (let producto of links) {
              enlaces.push(producto.href);
          }
          return enlaces;
      });
      //------------------------------------------------------
      console.log("cantindad de productos: "+linksProductos.length);
      await saveProducts(linksProductos,page,rows,browser);
    }
}

async function saveProducts(productos,page,rows, browser) {
  console.log(chalk.red("                   OBTENIENDO DATOS..."));

    const allProductos = productos;
    const nuevaPagina = await browser.newPage();
    for (const enlaceProducto of allProductos) {  
      try {
          // Navega a la página correspondiente
          await nuevaPagina.goto(enlaceProducto);
          try{
              await nuevaPagina.waitForSelector('h1.vtex-store-components-3-x-productNameContainer span');
          }catch{
              await nuevaPagina.waitForTimeout(5000);
          }
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

   
          const eanElement ="";

          const descripcion = document.querySelector('h1.vtex-store-components-3-x-productNameContainer span')?.innerText;

          const priceProducto = document.querySelector('span.diaio-store-5-x-sellingPrice span.diaio-store-5-x-sellingPriceValue')?.innerText;
          const ean = document.querySelector('span.vtex-product-identifier-0-x-product-identifier__value')?.innerText;
          const precioAntiguo = document.querySelector('span.diaio-store-5-x-listPrice span.diaio-store-5-x-listPriceValue.strike')?.innerText;
          const precioUnidadDeMedida = document.querySelector('span[data-specification-name="PrecioPorUnd"]')?.innerText;
          const UnidadDeMedida = document.querySelector('span[data-specification-name="UnidaddeMedida"]')?.innerText;
          const promo = document.querySelector('span.vtex-product-price-1-x-savings span')?.innerText;       
          const promo2do = document.querySelector('span.vtex-product-highlights-2-x-productHighlightText.vtex-product-highlights-2-x-productHighlightText--promotions')?.innerText; 

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
          arrayProductos.push(ean?ean:"");
          //PRECIO REGULAR
          arrayProductos.push(precioAntiguo==null || precioAntiguo==undefined?priceProducto:precioAntiguo);
          //PRECIO PROMOCIONAL
          if(promo || promo2do){
            arrayProductos.push(promo?promo:promo2do);
          }else{
            arrayProductos.push("");
          }
          //PRECIO UNITARIO PROMOCIONAL
          arrayProductos.push(promo2do && precioAntiguo?priceProducto:"");
          //PRECIO OFERTA
          arrayProductos.push((precioAntiguo!=null || precioAntiguo!=undefined) && promo?priceProducto:"");
           //PRECIO POR UNIDAD DE MEDIDA
           arrayProductos.push(precioUnidadDeMedida);
           //UNIDAD DE MEDIDA
          arrayProductos.push(UnidadDeMedida);
          //PRECIO ANTIGUO
          arrayProductos.push("");
          return arrayProductos;  
          
      });
      
      rows.push(resultado?resultado:"ERROR");
        //console.log(rows);
    } catch (error) {
      console.error('error obteniendo datos del producto individual, url: '+enlaceProducto);
    }     
  }
    // Cierra la página actual
   await nuevaPagina.close();
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
  const fileName= 'diaGenericoTEST'+fechaConSeparador+'.xlsx';
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