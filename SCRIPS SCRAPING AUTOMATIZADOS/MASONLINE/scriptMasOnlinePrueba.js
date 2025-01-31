
//HACER QUE EL SCROLL DE RECORRIDA DE CPAGE BAJE HASTA EL BOTON DE MAS, LO SACAREMOS CON GRADOS




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
  let vueltas = 0;
  let i =1;
  let selectorFound = false;
  let attempts = 0;
  const maxAttempts = 10;
  const linksCategorias = [
  "https://www.masonline.com.ar/aceites-vinagres-y-aderezos/aceites",
  //   "https://www.masonline.com.ar/arroz-legumbres-y-pastas/arroz",
  //   "https://www.masonline.com.ar/arroz-legumbres-y-pastas/pastas-secas",
  //   "https://www.masonline.com.ar/desayunos-y-meriendas?initialMap=c&initialQuery=desayunos-y-meriendas&map=category-1,category-2&query=/desayunos-y-meriendas/galletitas-dulces&searchState",
  //   "https://www.masonline.com.ar/desayunos-y-meriendas?initialMap=c&initialQuery=desayunos-y-meriendas&map=category-1,category-2&query=/desayunos-y-meriendas/yerbas&searchState",
  //   "https://www.masonline.com.ar/desayunos-y-meriendas?initialMap=c&initialQuery=desayunos-y-meriendas&map=category-1,category-2&query=/desayunos-y-meriendas/te&searchState",
  //   "https://www.masonline.com.ar/desayunos-y-meriendas?initialMap=c&initialQuery=desayunos-y-meriendas&map=category-1,category-2&query=/desayunos-y-meriendas/cereales&searchState",
  //   "https://www.masonline.com.ar/desayunos-y-meriendas?initialMap=c&initialQuery=desayunos-y-meriendas&map=category-1,category-2&query=/desayunos-y-meriendas/cafe&searchState",
  //   "https://www.masonline.com.ar/desayunos-y-meriendas?initialMap=c&initialQuery=desayunos-y-meriendas&map=category-1,category-2&query=/desayunos-y-meriendas/galletitas-saladas&searchState",
  //   "https://www.masonline.com.ar/desayunos-y-meriendas?initialMap=c&initialQuery=desayunos-y-meriendas&map=category-1,category-2&query=/desayunos-y-meriendas/endulzantes&searchState",
  //   "https://www.masonline.com.ar/desayunos-y-meriendas?initialMap=c&initialQuery=desayunos-y-meriendas&map=category-1,category-2&query=/desayunos-y-meriendas/tostadas-grisines-y-marineras&searchState",
  //   "https://www.masonline.com.ar/desayunos-y-meriendas?initialMap=c&initialQuery=desayunos-y-meriendas&map=category-1,category-2&query=/desayunos-y-meriendas/galletas-de-arroz&searchState",
  //   "https://www.masonline.com.ar/desayunos-y-meriendas?initialMap=c&initialQuery=desayunos-y-meriendas&map=category-1,category-2&query=/desayunos-y-meriendas/budines-magdalenas-y-otros&searchState",
  //   "https://www.masonline.com.ar/desayunos-y-meriendas?initialMap=c&initialQuery=desayunos-y-meriendas&map=category-1,category-2&query=/desayunos-y-meriendas/bizcochos&searchState",
  //   "https://www.masonline.com.ar/kiosco?initialMap=c&initialQuery=kiosco&map=category-1,category-2&query=/kiosco/chocolates&searchState","https://www.masonline.com.ar/kiosco?initialMap=c&initialQuery=kiosco&map=category-1,category-2&query=/kiosco/golosinas&searchState","https://www.masonline.com.ar/kiosco?initialMap=c&initialQuery=kiosco&map=category-1,category-2&query=/kiosco/alfajores&searchState",
  //   "https://www.masonline.com.ar/panificados?initialMap=c&initialQuery=panificados&map=category-1,category-2,category-2,category-2&query=/panificados/pan-arabe-tortillas-y-otros/pan-lactal/pan-para-hamburguesas-y-panchos&searchState",
  //   "https://www.masonline.com.ar/reposteria",
    "https://www.masonline.com.ar/snacks",
     "https://www.masonline.com.ar/cervezas",
  //   "https://www.masonline.com.ar/gaseosas?order=pricePerUnit:asc",
  //   "https://www.masonline.com.ar/aguas/agua-saborizada",
     "https://www.masonline.com.ar/jugos/en-polvo",
  //   "https://www.masonline.com.ar/cuidado-del-cabello/shampoo",
  //   "https://www.masonline.com.ar/cuidado-del-cabello?initialMap=c&initialQuery=cuidado-del-cabello&map=category-1,category-2&query=/cuidado-del-cabello/acondicionador&searchState",
  //   "https://www.masonline.com.ar/cuidado-personal/desodorantes-y-antitranspirantes",
  //  "https://www.masonline.com.ar/cocina/detergentes-y-lavavajillas",
  //  "https://www.masonline.com.ar/papeles-bolsas-y-films?initialMap=c&initialQuery=papeles-bolsas-y-films&map=category-1,category-2,category-2,category-2,category-2&query=/papeles-bolsas-y-films/panuelos-descartables/papel-higienico/rollos-de-cocina/servilletas-descartables&searchState"
  ]
  const rows = [];
  try {
    console.log(" ");
    console.log(chalk.green.underline('                         [SUCURSAL MAS ONLINE]                         '));
    console.log(" ");
    console.log("               TOTAL DE CATEGORIAS A ESCRAPEAR "+"["+linksCategorias.length+"]");
    
    
    for(let link of linksCategorias){
      const page = await browser.newPage();
      if (vueltas === 0){
        await page.goto("https://www.masonline.com.ar/");
        await selectSucursal(page);
      }
      vueltas++;
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
    await page.waitForTimeout(5000);
    //Debemos seleccionar el boton de ver mas productos para saber si hay que cargar mas productos...
    const btnMoreProducts = await page.$("div.vtex-search-result-3-x-buttonShowMore a div");
    console.log("EL BOTON ES "+btnMoreProducts);
    await page.waitForTimeout(2000);
    if (btnMoreProducts!=undefined ||btnMoreProducts!=null ) {
        console.log("HAY BOTON");
        await page.click("div.vtex-search-result-3-x-buttonShowMore a div");
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
            // const linksProductos = await page.evaluate(() => {
            //     const links = document.querySelectorAll('div.vtex-search-result-3-x-galleryItem section.vtex-product-summary-2-x-container a');
            //     let enlaces = [];
            //     for (let producto of links) {
            //         enlaces.push(producto.href);
            //     }
            //     return enlaces;
            // });
            //------------------------------------------------------
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
           // console.log("["+linksProductos.length+"]"+" PRODUCTOS");
            //await openProducts(linksProductos, browser, rows, page);
            await saveProducts(htmlProductos,page,rows);
      }
}

  async function saveProducts(productos,page,rows) {
    console.log(chalk.red("                   OBTENIENDO DATOS..."));
    // Recorre los enlaces y obtén datos de cada página
    // Recorre los enlaces y obtén datos de cada página
    
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
  
            const descripcion = tempDiv.querySelector('h3.vtex-product-summary-2-x-productNameContainer span')?.innerText;
  
            const priceProducto = tempDiv.querySelector('div.valtech-gdn-dynamic-product-0-x-dynamicProductPrice')?.innerText;
            console.log(priceProducto);
            const precioAntiguo = tempDiv.querySelector('span.valtech-gdn-dynamic-product-0-x-weighableListPrice')?.innerText;
            const precioUnidadDeMedida = tempDiv.querySelector('span.valtech-gdn-dynamic-weight-price-0-x-currencyContainer')?.innerText;
            const UnidadDeMedida = tempDiv.querySelector('span.valtech-gdn-dynamic-weight-price-0-x-unit')?.innerText;
            const promo = tempDiv.querySelector('div.valtech-gdn-custom-highlights-0-x-customHighlightTextContainer span')?.innerText;

  
         

            //CADENA
            arrayProductos.push("Masonline");
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
  async function selectSucursal(page){
    try{
        console.log("INICIANDO SELECCION DE SURCURSAL");
        await page.waitForSelector('body > div.render-container.render-route-store-home > div > div.vtex-store__template.bg-base > div > div.vtex-store-header-2-x-headerStickyRow.vtex-store-header-2-x-headerStickyRow--mobile-wrapper-current-store.sticky.z-999 > div.vtex-store-header-2-x-headerRow.vtex-store-header-2-x-headerRow--mobile-wrapper-current-store > div > section > div > div.valtech-gdn-region-login-0-x-triggerWrapper.flex.items-center > p > span');
        const btnIngresarPerfil = await page.$("body > div.render-container.render-route-store-home > div > div.vtex-store__template.bg-base > div > div.vtex-store-header-2-x-headerStickyRow.vtex-store-header-2-x-headerStickyRow--mobile-wrapper-current-store.sticky.z-999 > div.vtex-store-header-2-x-headerRow.vtex-store-header-2-x-headerRow--mobile-wrapper-current-store > div > section > div > div.valtech-gdn-region-login-0-x-triggerWrapper.flex.items-center > p > span");
        await btnIngresarPerfil.click();

        await page.waitForSelector('body > div.valtech-gdn-region-login-0-x-drawer.valtech-gdn-region-login-0-x-opened.left-0.fixed.top-0.bottom-0.bg-base.z-999.flex.flex-column > div > div.valtech-gdn-region-login-0-x-childrenContainer.flex.flex-grow-1 > div > div > div > div > div.vtex-login-2-x-options > ul > li:nth-child(2) > div > button > div > span');
        const btnIngresarConMail = await page.$("body > div.valtech-gdn-region-login-0-x-drawer.valtech-gdn-region-login-0-x-opened.left-0.fixed.top-0.bottom-0.bg-base.z-999.flex.flex-column > div > div.valtech-gdn-region-login-0-x-childrenContainer.flex.flex-grow-1 > div > div > div > div > div.vtex-login-2-x-options > ul > li:nth-child(2) > div > button > div > span");
        await btnIngresarConMail.click();


        await page.waitForSelector('body > div.valtech-gdn-region-login-0-x-drawer.valtech-gdn-region-login-0-x-opened.left-0.fixed.top-0.bottom-0.bg-base.z-999.flex.flex-column > div > div.valtech-gdn-region-login-0-x-childrenContainer.flex.flex-grow-1 > div > div > div > div > div > form > div.vtex-login-2-x-inputContainer.vtex-login-2-x-inputContainerEmail > label > div > input');
        const selectorImputAdress = await page.$("body > div.valtech-gdn-region-login-0-x-drawer.valtech-gdn-region-login-0-x-opened.left-0.fixed.top-0.bottom-0.bg-base.z-999.flex.flex-column > div > div.valtech-gdn-region-login-0-x-childrenContainer.flex.flex-grow-1 > div > div > div > div > div > form > div.vtex-login-2-x-inputContainer.vtex-login-2-x-inputContainerEmail > label > div > input")
        const selectorImputPass = await page.$("body > div.valtech-gdn-region-login-0-x-drawer.valtech-gdn-region-login-0-x-opened.left-0.fixed.top-0.bottom-0.bg-base.z-999.flex.flex-column > div > div.valtech-gdn-region-login-0-x-childrenContainer.flex.flex-grow-1 > div > div > div > div > div > form > div.vtex-login-2-x-inputContainer.vtex-login-2-x-inputContainerPassword.pv3.flex.flex-column > div > label > div > input")

        if(selectorImputAdress && selectorImputPass){
            await selectorImputAdress.type('blasstanciuc@gmail.com');
            await selectorImputPass.type('LOLAmora00$');
            const btnIngresar = await page.$("div.vtex-login-2-x-sendButton button");
            await btnIngresar.click();


            await page.waitForTimeout(10000);
            await page.waitForSelector("body > div.render-container.render-route-store-home > div > div.vtex-store__template.bg-base > div > div.vtex-store-header-2-x-headerStickyRow.vtex-store-header-2-x-headerStickyRow--mobile-wrapper-current-store.sticky.z-999 > div.vtex-store-header-2-x-headerRow.vtex-store-header-2-x-headerRow--mobile-wrapper-current-store > div > section > div > div.valtech-gdn-region-login-0-x-triggerWrapper.flex.items-center > p > span");
            
            const btnRetiroEnSucursal = await page.$("body > div.render-container.render-route-store-home > div > div.vtex-store__template.bg-base > div > div.vtex-store-header-2-x-headerStickyRow.vtex-store-header-2-x-headerStickyRow--mobile-wrapper-current-store.sticky.z-999 > div.vtex-store-header-2-x-headerRow.vtex-store-header-2-x-headerRow--mobile-wrapper-current-store > div > section > div > div.valtech-gdn-region-login-0-x-triggerWrapper.flex.items-center > p > span");
            await btnRetiroEnSucursal.click();

            await page.waitForTimeout(10000);
            await page.waitForSelector("div.valtech-gdn-region-login-0-x-deliveryMethodButton:nth-child(4) button")
            const btnRetiroEnTienda = await page.$("div.valtech-gdn-region-login-0-x-deliveryMethodButton:nth-child(4) button")
            await btnRetiroEnTienda.click();

            await page.waitForTimeout(10000);
            
            
            await page.waitForSelector("div.valtech-gdn-region-login-0-x-provinceSelect div div div div div div");
            console.log("seleccione la prov");
            const inputProvincia = await page.$("div.valtech-gdn-region-login-0-x-provinceSelect div div div div div div");
            await inputProvincia.click();

            await page.waitForTimeout(3000);
            for (let i = 0; i < 13; i++) {
              await page.keyboard.press('ArrowDown');
              await page.waitForTimeout(100); // Espera un pequeño intervalo entre pulsaciones para asegurar que se registran correctamente
            }
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
            
            await page.waitForSelector("div.valtech-gdn-region-login-0-x-departmentSelect div div div div div div");
            const inputCiudad = await page.$("div.valtech-gdn-region-login-0-x-departmentSelect div div div div div div");
            await inputCiudad.click();

            await page.waitForTimeout(3000);
            for (let i = 0; i < 1; i++) {
              await page.keyboard.press('ArrowDown');
              await page.waitForTimeout(100); // Espera un pequeño intervalo entre pulsaciones para asegurar que se registran correctamente
            }
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');

            console.log('SELECCIONO CON EXITO LA SUCURSAL');
            await page.waitForTimeout(10000);
          }else{
            console.error('NO SE ENCONTRO EL SELECTOR DEL INPUT');
          }


    }catch(error){
        console.log("ERROR SELECCIONAR SUCURSAL"+error);
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