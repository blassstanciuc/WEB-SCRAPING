//IMPORTAMOS LIBRERIAS
import puppeteer from 'puppeteer';
import ExcelJS from 'exceljs';
import chalk  from 'chalk';
import promptSync from 'prompt-sync';

// Crear la interfaz de lectura sincrónica de la terminal
const prompt = promptSync();

// Preguntar al usuario que ingrese los enlaces separados por comas
const enlaces = prompt('Por favor, ingrese los enlaces separados por comas, y coloca enlaces de categorias completas sin filtros : ');

// Dividir la cadena de enlaces en una matriz
const linksCategorias = enlaces.split(',').map(enlace => enlace.trim());

// Luego, puedes seguir con tu lógica de Puppeteer utilizando el array de enlaces
const scrapeData = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--start-fullscreen', '--no-sandbox', '--disable-setuid-sandbox'],
  }); //GENERAMOS UNA NUEVA INSTANCIA DE BUSCADOR
  const page = await browser.newPage(); //GENERAMOS UNA VENTANA

  await page.setDefaultNavigationTimeout(120000);
  let selectorFound = false;
  let attempts = 0;


  let selectorFoundtwo = false;
  let attemptstwo = 0;

  const maxAttempts = 10; // Número máximo de intentos
  let i =0;
  let x =1;
  const arrayProductos = [];
  const rows = [];

  try {
    console.log(" ");
    console.log(chalk.green.underline('                  [SUCURSAL CARREFOUR SAN MARTIN]                         '));
    console.log(" ");
    for(let link of linksCategorias){
      i++;
      console.log("["+i+"]"+" CATEGORIA DE "+"["+linksCategorias.length+"]");
      try{

        // NAVEGA AL ENLACE INDICADO
        await page.goto(link);
        
        // HAGO UNA BREVE ESPERA
        await page.evaluate(() => {
          return new Promise(resolve => {
            setTimeout(resolve, 30000);
          });
        });

        await page.setViewport({ width: 1366, height: 768 });

                // HAGO UNA BREVE ESPERA
                await page.evaluate(() => {
                  return new Promise(resolve => {
                    setTimeout(resolve, 20000);
                  });
                });
        
        //MODULO DE RECARGA
        while (!selectorFound && attempts < maxAttempts) {
          try {
            // Espera hasta que aparezca el selector en la página
            await page.waitForSelector('div.valtech-carrefourar-search-result-0-x-galleryItem', { timeout: 5000 });
            selectorFound = true; // Se encontró el selector
          } catch (error) {
            console.error('Selector no encontrado, recargando página...');
            attempts++;
            await page.reload();
            await page.evaluate(() => {
              return new Promise(resolve => {
                setTimeout(resolve, 5000);
              });
            });
          }
        }      
        //------------------------------------------------
        if (selectorFound) {
          console.log("Comenzando...");
          if(i==1){
            await selectSucursal(page);
            await page.goto(link);
            //SEGUNDO TESTEO
            while (!selectorFoundtwo && attemptstwo < maxAttempts) {
              try {
                // Espera hasta que aparezca el selector en la página
                await page.waitForSelector('div.valtech-carrefourar-search-result-0-x-galleryItem', { timeout: 5000 });
                selectorFoundtwo = true; // Se encontró el selector
              } catch (error) {
                console.error('Error en la pagina, recargando página...');
                attemptstwo++;
                await page.reload();
                await page.evaluate(() => {
                  return new Promise(resolve => {
                    setTimeout(resolve, 5000);
                  });
                });
              }
            }
          }
          //Selecciono los links 
          const enlacesProductos = await getLinks(page);
          //CONSULTO SI LA PAGINA A SCRAPEAR ES UNA UNICA PAGINA, ESTO ME DARA LA PAUTA SI HAY QUE RECORRERALA O NO.
          const isOnePage = await page.evaluate(() => {
            let elemento = document.querySelectorAll('div.valtech-carrefourar-search-result-0-x-paginationButtonPages');
            console.log(elemento.length);
                if (elemento.length == 1){
                  return elemento = true;
                } else {
                    return elemento = false;
                }
            })
            await openProducts(enlacesProductos,browser,arrayProductos,rows);//OBTENGO LOS PRODUCTOS DE LA PAGINA INICIAL
            selectorFound = false;
            attempts = 0;
            //SI NO ES UNA PAGINA UNICA, ABRO LA SIGUIENTE PAGINA 
            if (isOnePage === false){
              const paginasTotales = await page.evaluate(()=>{
                let totalPage = document.querySelectorAll("div.valtech-carrefourar-search-result-0-x-paginationButtonPages button");
                return (totalPage[totalPage.length -1])?.innerText;
              })
              
              console.log(chalk.red.underline("PAGINAS TOTALES DE ESTA CATEGORIA "+paginasTotales));
              await openNextPage(page,browser,arrayProductos,rows,paginasTotales,x,link);
              console.log(chalk.yellow("--------------------------------------"));    
              console.log("                   CATEGORIA FINALIZADA");
              console.log(chalk.yellow("--------------------------------------"));  
            }else{
              console.log(chalk.yellow("--------------------------------------"));    
              console.log("                   CATEGORIA FINALIZADA");
              console.log(chalk.yellow("--------------------------------------"));  
            }
        } else {
          console.error('Persiste el erroren la web, después de varios intentos.');
        }
      }
      catch(error){
        console.error('ERROR AL ABRIR LA CATEGORIA '+"["+i+"]",error);
      }
    }  
  } catch (error) {
    console.error('Error during scraping:', error);
  } finally {
    
    console.log("FIN DEL SCRAPEO by BLAS");
    await createExcel(rows);//EXTRAIGO EL ARCHIVO EXCEL
    await browser.close();// CIERRO LA VENTANA DEL NAVEGADOR
  }
}
async function getLinks(page){
//--------------------------------------------------- Esperar y Recorrer pagina 
  await page.waitForTimeout(10000); 
  //await page.waitForSelector('.valtech-carrefourar-search-result-0-x-gallery');
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
  
  await page.waitForTimeout(15000);
  
  // for (let i = 0; i < numSteps; i++) {
  //     await page.evaluate((scrollSpeed) => {
  //       window.scrollBy(0, -scrollSpeed);
  //     }, scrollSpeed);
  //     await page.waitForTimeout(20); 
  // }
  // await page.waitForTimeout(10000);
  try {
        const linksProductos = await page.$$eval('div.valtech-carrefourar-search-result-0-x-gallery div section a.vtex-product-summary-2-x-clearLink', links => {
          let enlaces = [];
          for(let producto of links){
              enlaces.push(producto.href);
          }
          return enlaces;
        });
        //console.log("ENLACES ANTES DE SALIR DE GETLINKS() "+linksProductos);
        return linksProductos;    
      } catch (error) {
        console.log("error al obtener links de productos");
        return false; 
      }

//-----------------------------------------------------------------------------  


}

async function openProducts(productos,browser,arrayProductos,rows) {
  console.log(chalk.red("                   OBTENIENDO DATOS..."));
  // Recorre los enlaces y obtén datos de cada página
  for (const enlace of productos) {
    //console.log("ENLACE DE PRODUCTO "+enlace);
    let nuevaPagina = false;
    try {
       // Abre una nueva página para cada enlace
      nuevaPagina = await browser.newPage();
      await nuevaPagina.setDefaultNavigationTimeout(120000);
      // Navega a la página correspondiente
      await nuevaPagina.goto(enlace);
      //console.log("ABRI UN PRODUCTO");
      await nuevaPagina.waitForTimeout(5000); 

      //MODULO DE RECARGA------------------------------------------------------------------------------
        let selectElement = false;
        let intentoOpen = 0;
        let maxIntentoOpen = 5;
        while (!selectElement && intentoOpen < maxIntentoOpen) {
          try {
            // Espera hasta que aparezca el selector en la página
            await nuevaPagina.waitForSelector('h1 span.vtex-store-components-3-x-productBrand', { timeout: 2000 });
            selectElement = true; // Se encontró el selector
          } catch (error) {
            console.log(chalk.green.underline('[Producto no encontrado, recargando página...]'));
            intentoOpen++;
            await nuevaPagina.reload();
            await nuevaPagina.evaluate(() => {
              return new Promise(resolve => {
                setTimeout(resolve, 2000);
              });
            });
          }
        }  
      //--------------------------------------------------- Esperar y Recorrer pagina  
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
          await nuevaPagina.waitForTimeout(10); 
      }
      //------------------------------------------------------------------------------
      //console.log(chalk.red("                   OBTENIENDO DATOS..."));
      // Con evaluate me permite interactuar con la web y aplicar js
      const resultado = await nuevaPagina.evaluate(() => {
        // obtengo la fecha-----------------------------------------------------------------------------------------
        const fechaActual = new Date();
        const dia = fechaActual.getDate().toString().padStart(2, '0');
        const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // Nota: getMonth() devuelve un valor entre 0 y 11, sumamos 1 para obtener el mes real
        const año = fechaActual.getFullYear();
        const fechaConSeparador = dia + '/' + mes + '/' + año;
        const arrayProductos = [];
        
        //OBTENGO LOS DATOS------------------------------------------------------------------------------------------
        const marcaProducto = document.querySelector('span.vtex-store-components-3-x-productBrandName')?.innerText;
        const eanElement = document.querySelector('td.vtex-store-components-3-x-specificationItemSpecifications')?.textContent;
        const descripcion = document.querySelector('span.vtex-store-components-3-x-productBrand')?.innerText;
        const priceProducto = document.querySelector('span.valtech-carrefourar-product-price-0-x-sellingPriceValue span')?.innerText.trim();
        let precioAntiguo = document.querySelector('span.valtech-carrefourar-product-price-0-x-listPriceValue span')?.innerText;
        const promoGeneral = document.querySelector('span.valtech-carrefourar-product-price-0-x-discountPercentage')?.innerText;
        let whatPromoGeneral = promoGeneral? promoGeneral.split(" "):"";
        console.log(whatPromoGeneral);
        const promoDescripcion = document.querySelector('span.tooltipText')?.innerText;
        let whatPromo = promoDescripcion? promoDescripcion.split(" "):"";
        console.log(whatPromo);
        let precioUnitarioPromocional = document.querySelector('#productInfoContainer div.product_discount div.first_price_discount_container span.price_discount')?.innerText;
        const precioXunidadMedida = document.querySelector('span.valtech-carrefourar-dynamic-weight-price-0-x-currencyContainer')?.innerText;
        console.log(precioXunidadMedida)
        const unidad = document.querySelector('span.valtech-carrefourar-dynamic-weight-price-0-x-unit')?.innerText.split(" ");
        //---------------------------------------------------------------------------------------------------------------
        
        //AGREGO LOS DATOS AL ARRAY
        
        //CADENA
        arrayProductos.push("Carrefour");
        
        //SUCURSAL
        arrayProductos.push("Hiper San Martin");
        
        //FECHA
        arrayProductos.push(fechaConSeparador?fechaConSeparador:"");
        
        //CATEGORIA
        arrayProductos.push("");
        
        //SUBCATEGORIA
        arrayProductos.push("")
        
        //MARCA
        arrayProductos.push(marcaProducto?marcaProducto:"");
        
        //DESCRIPCION
        arrayProductos.push(descripcion?descripcion:"");
        
        //EAN
        arrayProductos.push(eanElement?eanElement:"");
        
        //PRECIO REGULAR
        arrayProductos.push(precioAntiguo==null || precioAntiguo==undefined?priceProducto:precioAntiguo);
        
        //PRECIO PROMOCIONAL
        if(whatPromo){
          if(whatPromo[0] != "MI"){
            if(whatPromo[0] == "EXCLUSIVO"){
              let promoPrecio = promoDescripcion.replace("EXCLUSIVO","");
              arrayProductos.push(promoPrecio);
            }else{
              arrayProductos.push(promoDescripcion);
            }
          }else{
            if(whatPromo[0] != "-"){
              arrayProductos.push(promoGeneral);
            }else{
              promoDescripcion = false;
              arrayProductos.push("");
            }
          }
        }else{
          arrayProductos.push("");
        }
        //PRECIO UNITARIO PROMOCIONAL
        arrayProductos.push((precioAntiguo) && (whatPromoGeneral[0] != "-")?priceProducto:"");
        
        //PRECIO OFERTA
        if(whatPromoGeneral){
          if(whatPromoGeneral[0] == "-"){
            arrayProductos.push(priceProducto);
          }else{
            arrayProductos.push("");
          }
        }else{
          arrayProductos.push("");
        }       
        //PRECIO POR UNIDAD DE MEDIDA
        let precioXunidad = precioXunidadMedida?precioXunidadMedida.replace("$",""):"";
        console.log(precioXunidad);
        arrayProductos.push(precioXunidad.trim());
        
        //UNIDAD DE MEDIDA
        let unidadDeMedida = unidad?unidad[1].replace(".", ""):"";
        arrayProductos.push(unidadDeMedida);
        
        //PRECIO ANTIGUO
        arrayProductos.push("");


        return arrayProductos;  
      });
      rows.push(resultado?resultado:"ERROR");
      //console.log("TERMINE DE GUARDAR INFO DEL PRODUCTO");
      await nuevaPagina.close();
      await nuevaPagina.waitForTimeout(5000); 
    } catch (error) {
      if(nuevaPagina != false){
        await nuevaPagina.close();
        console.log('Se cerro la ventana con error');
        await nuevaPagina.waitForTimeout(5000); 
      }
      console.error('No se pudo abrir el producto', error);
    } 
  }
}

//Obtengo el enlace de la siguiente pagina para recorrer
async function getNextPage(page,totalPage,repeticiones,link,vueltasAll){
  //Esperar hasta que cargue el carrito -----------------------------------------
  let encontreElCarrito = false;
  let vueltas = vueltasAll + 1;
  let maximoVueltas = 5;
  let enlacePagina;
  while (!encontreElCarrito && vueltas < maximoVueltas) {
    try{
      vueltas = vueltas++;
      console.log(chalk.red.underline('Obteniendo siguiente pagina...'));
      // Seleccionar el botón
      //console.log("VALOR DE REPETICIONES "+repeticiones);

      if (repeticiones <= totalPage) {
      
      enlacePagina = link+'?page='+repeticiones;
      //console.log(chalk.red.underline('YENDO A LA SIGUIENTE PAGINA: '+enlacePagina));
      await page.waitForTimeout(5000);
      await page.goto(enlacePagina);
      await page.waitForTimeout(15000);
      await page.waitForSelector("#render-store\\.search\\#category > div > div.vtex-store__template.bg-base > div > div:nth-child(6) > div > div > section > div.relative.justify-center.flex > div > div:nth-child(3) > div > div:nth-child(2) > div > div:nth-child(3) > div > div > div > div.valtech-carrefourar-search-result-0-x-gallery.flex.flex-row.flex-wrap.items-stretch.bn.ph1.na4.pl9-l > div:nth-child(1) > section > a > article > div > div.vtex-flex-layout-0-x-flexRow.vtex-flex-layout-0-x-flexRow--rowBtn > div > div:nth-child(2) > div > div > div > div > div > button > div > svg", { timeout: 5000 });
      encontreElCarrito = true; // Se encontró el selector
      return repeticiones;
    } else {
      console.error('No se abrio correctamente la siguiente pagina');
      encontreElCarrito = true;
      return false;
    }
    }catch{
      console.log("NO SE ENCUENTRA EL CARRITO, VUELTA: "+vueltas);
      await page.goto(enlacePagina);
      await page.evaluate(() => {
        return new Promise(resolve => {
          setTimeout(resolve, 2000);
        });
      });
      if(vueltas < 3){
        await getNextPage(page,totalPage,repeticiones,link,vueltas);
      } 
      console.log("ERROR EN FUNCION getNextPage");
      return true;
    }
  }

}

//Abro la pagina sieguiente 
async function openNextPage(page,browser,arrayProductos,rows,totalPage,x,link){
    x++;
    let vueltas = 0;
    const nextPagina = await getNextPage(page,totalPage,x,link,vueltas); //Consulto si hay una pagina siguiente
    try{
        if(nextPagina !== false ){ //Mientras que haya una siguiente pagina 
            //await page.click(nextPagina);
            console.log("----------------------------------------");
            console.log("PAGINA "+nextPagina)
            console.log("----------------------------------------");
            const nuevosProductos = await getLinks(page);
            //console.log("OBTENER ENLACES "+nuevosProductos);
            await openProducts(nuevosProductos,browser,arrayProductos,rows); //Obtenemos la info de los productos
            //console.log("OPEN PRODUCTS ");
            await page.waitForTimeout(10000);
            await openNextPage(page,browser,arrayProductos,rows,totalPage,x,link)//VOLVEMOS A ejecutar, para que consulte con getNextPage, si hay mas paginas
            //console.log("ABRIR SIGUIENTE PAGINA");
        }else{ 
            //console.log('QUE TRAIGO DE NEXT PAGINA primero '+nextPagina);
            console.log('FIN DE LAS PAGINAS');
            //await browser.close();
        }
    }catch(error){
        console.log("ERROR AL ABRIR LA SIGUIENTE PAGINA "+error);
        console.log('QUE TRAIGO DE NEXT PAGINA '+nextPagina);
    }
}
//ACCEDER A SUCURSAL
async function selectSucursal(page,ix=0){


      console.log("INICIANDO SELECCION DE SURCURSAL");
      let intentos = ix;
        try {
          intentos++; 
          let seencontroSelector = false;
          let maxIntentos = 10; // Número máximo de intentos
          while (!seencontroSelector && intentos < maxIntentos) {
          console.log("INTENTOS "+intentos);
          console.log("SELECTOR "+seencontroSelector);
            if(intentos < 2){
              await page.waitForTimeout(30000);
              await page.waitForSelector('div.valtech-carrefourar-search-result-0-x-galleryItem', { timeout: 5000 });
              const btnHeaders = await page.$$("div.vtex-store-header-2-x-headerRowContainer div.valtech-carrefourar-content-visibility-0-x-contentShow");
              //let prueba = document.querySelectorAll('div.vtex-store-header-2-x-headerRowContainer div.valtech-carrefourar-content-visibility-0-x-contentShow');
              //console.log(prueba);
              const btnIngresar = btnHeaders[2];
              //console.log(btnIngresar);
              if (btnIngresar) {
              await btnIngresar.click();
              //console.log("APRETE EL BOTON DE INGRESO");
              } else {
              console.error('Elemento no encontrado, ingreso');
              }
              
              await page.waitForTimeout(50000);
              
              try{
                await page.click('#onetrust-accept-btn-handler');
              }catch{
                console.error('no esta el boton de cerrar pop up uno');
              }

              //cerrar pop up
              try{
                await page.click('div.dy-lb-close');
              }catch{
                console.error('no esta el boton de cerrar pop up');
              }

              await page.waitForTimeout(50000);

              const btnIngresarMail = await page.$("div.vtex-login-2-x-emailPasswordOptionBtn button");
              if (btnIngresarMail) {
                try{
                  await btnIngresarMail.click();
                }catch{
                  console.error('Elemento no encontrado ingreso con mail');
                }
                } else {
                console.error('Elemento no encontrado mail');
                }

              await page.waitForTimeout(20000);

              const selectorInputMail = await page.$('form div.vtex-login-2-x-inputContainer label div input');

             // console.log("SLECTOR "+selectorInputMail);
              if(selectorInputMail){
                await selectorInputMail.type('blasstanciuc@gmail.com');
                await page.waitForTimeout(5000);
              }else{console.log("NO SE ENCONTRO EL INPUT DEL MAIL")}

              const selectorInputPassword = await page.$('form div.vtex-login-2-x-inputContainerPassword label div input');

              if(selectorInputPassword){
                await selectorInputPassword.type('webSCRAPING1234');
                await page.waitForTimeout(5000);
              }else{console.log("NO SE ENCONTRO EL INPUT DEL MAIL")}

              await page.waitForTimeout(20000);

              //LOGIN DESPUES DE CREDENCIALES
              await page.click('div.vtex-login-2-x-sendButton button');
              await page.waitForTimeout(10000);
              await page.goto('https://www.carrefour.com.ar/');
              await page.waitForTimeout(30000);
              await page.setViewport({ width: 1400, height: 2000 });
              //await page.waitForSelector('div.vtex-store-header-2-x-headerRowContainer');
            }
            //cerrar pop up
            try{
              await page.click('div.dy-lb-close');
            }catch{
              console.error('no esta el boton de cerrar pop up');
            }
            //SELECCIONA SUCURSAL DE RETIRO
            try{
            await page.click('div.valtech-carrefourar-region-locator-0-x-openIconContainer div[role="button"]');
            await page.waitForTimeout(2000);
            //console.log("TOQUE EL BOTON");
            await page.click('div.valtech-carrefourar-region-locator-0-x-openIconContainer div[role="button"]');
            }catch{
            console.log("Toque mas veces o no esta el retiro de sucursal")
            }
      
            await page.waitForTimeout(40000);

            await page.click('div.valtech-carrefourar-region-locator-0-x-container div.justify-center div:nth-child(2)');

            await page.click('#rl-step2');
            await page.waitForTimeout(30000);

            //QUE VAS A COMPRAR
            await page.waitForTimeout(10000);

            //SELECCIONAMOS CON LAS TECLA
            await page.click('div.valtech-carrefourar-region-locator-0-x-childrenContainer div div.flex-wrap div');
            await page.waitForTimeout(5000);
            await page.keyboard.type('Buenos Aires');
            await page.waitForTimeout(5000);
            await page.keyboard.press('ArrowDown');
            await page.waitForTimeout(5000);
            await page.keyboard.press('Enter');
            await page.waitForTimeout(10000);

            await page.click('body > div.valtech-carrefourar-region-locator-0-x-drawer.valtech-carrefourar-region-locator-0-x-drawer--locator.valtech-carrefourar-region-locator-0-x-opened.valtech-carrefourar-region-locator-0-x-opened--locator.left-0.fixed.top-0.bottom-0.bg-base.z-999.flex.flex-column > div > div.valtech-carrefourar-region-locator-0-x-childrenContainer.valtech-carrefourar-region-locator-0-x-childrenContainer--locator.flex.flex-grow-1 > div > div.flex.flex-wrap.mb4 > div.fl.w-50.pl3');
            await page.keyboard.type('san martin');
            await page.waitForTimeout(5000);
            await page.keyboard.press('Enter');
            //-------------------------------
            await page.waitForTimeout(20000);
            await page.click('div.valtech-carrefourar-region-locator-0-x-drawerContent div.valtech-carrefourar-region-locator-0-x-childrenContainer div div.store-list div.store:nth-child(14)');
            await page.waitForTimeout(5000);
            await page.keyboard.press('Tab');
            await page.waitForTimeout(5000);
            await page.keyboard.press('Enter');
            await page.waitForTimeout(5000);
            console.log(".");
            console.log(".");
            console.log("INGRESO A SUCURSAL DE FORMA CORRECTA");
            seencontroSelector = true; // Se encontró el selector
            console.log(chalk.green("-------------------------------------------------------"));
          }
        } catch (error) {
          console.error('ERROR AL ELEGIR SUCURSAL, recargando página...' + error);
          intentos++;           //await page.reload();
          await page.goto('https://www.carrefour.com.ar/Desayuno-y-merienda/Galletitas-bizcochitos-y-tostadas');
          await page.waitForTimeout(5000);
          await selectSucursal(page,intentos);
          await page.evaluate(() => {
            return new Promise(resolve => {
              setTimeout(resolve, 5000);
            });
          });
        }
  }

//GENERO EL EXCEL
async function createExcel(rows) {
  const fechaActual = new Date();
  // Obtener el día, el mes y el año de la fecha actual
  const dia = fechaActual.getDate().toString().padStart(2, '0');
  const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // Nota: getMonth() devuelve un valor entre 0 y 11, sumamos 1 para obtener el mes real
  const año = fechaActual.getFullYear();
  // Crear una cadena de texto en formato "dd/mm/yyyy"
  const fechaConSeparador = dia + '_' + mes + '_' + año;
  const workbook = new ExcelJS.Workbook();
  const fileName= 'Carrefour_SanMartin'+fechaConSeparador+'.xlsx';
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
    {header: 'Unidad de Medida'}
  ]
  worksheet.columns = Columnas;
  for(let row of rows){
    worksheet.addRow(row);
  }
  const filePath = 'C:/Users/Klehr/Desktop/rockstarsolutions/WEB-SCRAPING/ARCHIVOS/CARREFOUR/' + fileName; // Cambia la ruta según tus necesidades
  //const filePath = '/home/blas/Descargas/' + fileName; // LINUX


  try {
    await workbook.xlsx.writeFile(filePath);
    console.log(`Archivo Excel creado en: ${filePath}`);
  } catch (error) {
    console.log("ERROR AL GUARDAR EL ARCHIVO EXCEL", error);
  }
}

// Llama a la función principal
scrapeData();
