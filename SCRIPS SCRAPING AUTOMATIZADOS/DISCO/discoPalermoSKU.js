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
  
  let i =0;
  let x =1;
  const linksCategorias = [
    // 'https://www.disco.com.ar/leche?_q=leche&fuzzy=0&initialMap=ft&initialQuery=leche&map=category-2,brand,ft&operator=and&page=1&query=/leches/la-serenisima/leche&searchState',
    // 'https://www.disco.com.ar/Almacen/Desayuno-y-Merienda?initialMap=c,c&initialQuery=almacen/desayuno-y-merienda&map=category-1,category-2,category-3,category-3,category-3,category-3,category-3,category-3,category-3,category-3&query=/almacen/desayuno-y-merienda/azucar-y-edulcorantes/bizcochuelos-budines-y-magdalenas/cafes/cereales/galletitas-dulces/galletitas-saladas/tes/yerbas&searchState',
    // 'https://www.disco.com.ar/Almacen/Golosinas-y-Chocolates',
    // 'https://www.disco.com.ar/Almacen/Para-Preparar',
    // 'https://www.disco.com.ar/Almacen/Pastas-Secas-y-Salsas?initialMap=c,c&initialQuery=almacen/pastas-secas-y-salsas&map=category-1,category-2,category-3,category-3,category-3&query=/almacen/pastas-secas-y-salsas/pastas-listas/pastas-secas-guiseras/pastas-secas-largas&searchState',
    //  'https://www.disco.com.ar/Almacen/Snacks',
    // 'https://www.disco.com.ar/Almacen/Panificados',
    // 'https://www.disco.com.ar/Almacen/Aceites-y-Vinagres?initialMap=c,c&initialQuery=almacen/aceites-y-vinagres&map=category-1,category-2,category-3,category-3&query=/almacen/aceites-y-vinagres/aceites-comunes/aceites-especiales&searchState',
    // 'https://www.disco.com.ar/Almacen/Arroz-y-Legumbres?initialMap=c,c&initialQuery=almacen/arroz-y-legumbres&map=category-1,category-2,category-3,category-3&query=/almacen/arroz-y-legumbres/arroz/arroz-listos&searchState',
    // 'https://www.disco.com.ar/Lacteos/Yogures',
    //  'https://www.disco.com.ar/perfumeria/cuidado-personal/jabones',
    // 'https://www.disco.com.ar/limpieza/papeles/papel-higienico',
    // 'https://www.disco.com.ar/Bebidas/Cervezas',
    // 'https://www.disco.com.ar/bebidas/aguas/aguas-saborizadas',
    // 'https://www.disco.com.ar/Bebidas/Gaseosas',
    'https://www.disco.com.ar/bebidas/jugos/en-polvo',
    "https://www.disco.com.ar/almacen/aderezos/mayonesas",
    // "https://www.disco.com.ar/almacen/caldos-sopas-pure-y-bolsas-para-horno/pure?initialMap=c,c,c&initialQuery=almacen/caldos-sopas-pure-y-bolsas-para-horno/pure&map=category-1,category-2,category-3,brand&query=/almacen/caldos-sopas-pure-y-bolsas-para-horno/pure/knorr&searchState",
    // "https://www.disco.com.ar/Bebidas/Aperitivos?initialMap=c,c&initialQuery=bebidas/aperitivos&map=category-1,category-2,brand&query=/bebidas/aperitivos/branca&searchState",
    // "https://www.disco.com.ar/perfumeria/cuidado-capilar/shampoo?initialMap=c,c,c&initialQuery=perfumeria/cuidado-capilar/shampoo&map=category-1,category-2,category-3,brand,brand&query=/perfumeria/cuidado-capilar/shampoo/pantene/sedal&searchState",
    // "https://www.disco.com.ar/limpieza/cuidado-para-la-ropa/detergente-para-ropa?initialMap=c,c,c&initialQuery=limpieza/cuidado-para-la-ropa/detergente-para-ropa&map=category-1,category-2,category-3,brand,brand&query=/limpieza/cuidado-para-la-ropa/detergente-para-ropa/ariel/skip&searchState",
    // "https://www.disco.com.ar/limpieza/limpieza-de-cocina/detergentes?initialMap=c,c,c&initialQuery=limpieza/limpieza-de-cocina/detergentes&map=category-1,category-2,category-3,brand,brand&query=/limpieza/limpieza-de-cocina/detergentes/cif/magistral&searchState",
    // "https://www.disco.com.ar/bebes-y-ninos/panales?initialMap=c,c&initialQuery=bebes-y-ninos/panales&map=category-1,category-2,brand,brand&query=/bebes-y-ninos/panales/babysec/pampers&searchState",
    // "https://www.disco.com.ar/42769?initialMap=productClusterIds&initialQuery=42769&map=category-1,category-2,productclusternames&query=/lacteos/leches/hasta-2do-al-50--en-frescos-seleccionados&searchState"
    ]
  const rows = [];
  const internalPages = [];

  try {
    console.log(" ");
    console.log(chalk.red.underline('                         [SUCURSAL DISCO PALERMO SKU]                         '));
    console.log(" ");
    console.log("               TOTAL DE CATEGORIAS A ESCRAPEAR "+"["+linksCategorias.length+"]");
    for(let link of linksCategorias){
      i++;
     
      



      try{
            // Navega a la página principal
            await page.goto(link); 
            if(i==1){
              try{
                
              let tiempoDeEsperaEnMilisegundos = 15000;
  
              await page.evaluate(async (waitTime) => {
              // Utiliza la función setTimeout para esperar el tiempo especificado
              await new Promise(resolve => setTimeout(resolve, waitTime));
              }, tiempoDeEsperaEnMilisegundos);
  
       
  
              // ------------------------------------------------------------------------------------------------------------------------------------------
              //INGRESAR A MI CUENTA  
  
               // INICIAR SESIÓN
                console.log("Ingresar a la cuenta");
  
                // Hacer clic en el botón de login
                await page.click('div.vtex-modal-layout-0-x-triggerContainer--trigger-login-mobile');
  
                await page.evaluate(async (waitTime) => {
                  // Utiliza la función setTimeout para esperar el tiempo especificado
                  await new Promise(resolve => setTimeout(resolve, waitTime));
                  }, tiempoDeEsperaEnMilisegundos);
  
                // Hacer clic en la opción de login con email y contraseña
                await page.click('div.vtex-login-2-x-button.vtex-login-2-x-emailPasswordOptionBtn button');
  
                // Esperar a que los campos de email y contraseña estén disponibles
                await page.waitForSelector('div.vtex-login-2-x-inputContainerEmail input');
                await page.waitForSelector('div.vtex-login-2-x-inputContainerPassword input');
  
                // Ingresar email y contraseña
                const selectorImputNombre = await page.$('div.vtex-login-2-x-inputContainerEmail input');
                const selectorImputPassword = await page.$('div.vtex-login-2-x-inputContainerPassword input');
                if (selectorImputNombre && selectorImputPassword) {
                  await selectorImputNombre.type('blasstanciuc@gmail.com');
                  await selectorImputPassword.type('LOLAmora00$$');
                }
  
                await page.evaluate(async (waitTime) => {
                  // Utiliza la función setTimeout para esperar el tiempo especificado
                  await new Promise(resolve => setTimeout(resolve, waitTime));
                  }, tiempoDeEsperaEnMilisegundos);
  
                // Hacer clic en el botón de enviar
                await page.click('div.vtex-login-2-x-sendButton button');
                
                  // Esperar a que la navegación se complete
                await page.waitForNavigation({ waitUntil: 'networkidle0' });
                await page.waitForSelector("#btnNoIdWpnPush");
                await page.click('#btnNoIdWpnPush');
  
              // ------------------------------------------------------------------------------------------------------------------------------------------
              //SELECCIONAR METODO DE ENTREGA
              const selectorSucursal = await page.$('span.vtex-rich-text-0-x-strong--sucursal');
              if (selectorSucursal) {
                await page.click('span.vtex-rich-text-0-x-strong--sucursal');
               
                console.log("PASE EL CLICK");
                await page.evaluate(async (waitTime) => {
  
                // Utiliza la función setTimeout para esperar el tiempo especificado
                  await new Promise(resolve => setTimeout(resolve, waitTime));
              }, tiempoDeEsperaEnMilisegundos);
  
              await page.click('div.discoargentina-delivery-modal-1-x-pickUpSelectionContainer button');
             
              await page.evaluate(async (waitTime) => {
                  // Utiliza la función setTimeout para esperar el tiempo especificado
                  await new Promise(resolve => setTimeout(resolve, waitTime));
              }, tiempoDeEsperaEnMilisegundos);
  
  
              const SelectorSelectRegion = 'div.discoargentina-delivery-modal-1-x-dropdownStoreForm.pr5 div label div.vtex-styleguide-9-x-container select'; 
              const opcionASeleccionar = 'LA PLATA';
              await page.select(SelectorSelectRegion, opcionASeleccionar);
              await page.evaluate(async (waitTime) => {
                  // Utiliza la función setTimeout para esperar el tiempo especificado
                  await new Promise(resolve => setTimeout(resolve, waitTime));
              }, tiempoDeEsperaEnMilisegundos);
              const SelectorSelectTienda = 'div.discoargentina-delivery-modal-1-x-dropdownStoreForm.pl5 div label div.vtex-styleguide-9-x-container select'; 
              const opcionASeleccionarTienda = 'Disco City Bell Camino Belgrano 167';
              await page.evaluate(async (waitTime) => {
                  // Utiliza la función setTimeout para esperar el tiempo especificado
                  await new Promise(resolve => setTimeout(resolve, waitTime));
              }, tiempoDeEsperaEnMilisegundos);
              await page.select(SelectorSelectTienda, opcionASeleccionarTienda);
              await page.evaluate(async (waitTime) => {
                  // Utiliza la función setTimeout para esperar el tiempo especificado
                  await new Promise(resolve => setTimeout(resolve, waitTime));
              }, tiempoDeEsperaEnMilisegundos);
  
              await Promise.all([
                page.waitForNavigation(),
                page.click('div.discoargentina-delivery-modal-1-x-buttonStyle button')
              ]);
             
              }else{
              console.error('NO SE ENCONTRO EL SELECTOR DEL INPUT');
              }
              }catch(error){
                console.log("No se pudo ingresar al selector de sucursal "+error)
              }
            }  
   

            console.log("               -> ["+i+"]"+" CATEGORIA DE "+"["+linksCategorias.length+"]"); 
            // HAGO UNA BREVE ESPERA
            // await page.evaluate(() => {
            //   return new Promise(resolve => {
            //     setTimeout(resolve, 15000);
            //   });
            // });        
            await page.waitForSelector('div.flagsContainer');
            if(i==1){ await page.goto(link); }
           
            await loadMoreProducts(page,rows,x,browser);//CARGAMOS TODOS LOS PRODUCTOS DE LA PAGINA
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

async function getProducts(rows,linksProductos,browser) {
  // Recorre los enlaces y obtén datos de cada página
  console.log(chalk.red("                   OBTENIENDO DATOS..."));
  try {
     const pageProducto = await browser.newPage();
      for (const producto of linksProductos) {
        try{
          await pageProducto.goto(producto); 
          await pageProducto.waitForTimeout(2000); 

          const bodyHandle = await pageProducto.$('body');
          const { height } = await bodyHandle.boundingBox();
          await bodyHandle.dispose();
          const scrollSpeed = 10;
          const numSteps = height / scrollSpeed;

          //HAGO SCROLL DESDE ARRIBA PARA BAJO
          for (let i = 0; i < numSteps; i++) {
              await pageProducto.evaluate((scrollSpeed) => {
                window.scrollBy(0, scrollSpeed);
              }, scrollSpeed);
              await pageProducto.waitForTimeout(20); 
            }
            
          const resultado = await pageProducto.evaluate(() => {
            // optionals values
            const fechaActual = new Date();
            // Obtener el día, el mes y el año de la fecha actual
            const dia = fechaActual.getDate().toString().padStart(2, '0');
            const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // Nota: getMonth() devuelve un valor entre 0 y 11, sumamos 1 para obtener el mes real
            const año = fechaActual.getFullYear();
            // Crear una cadena de texto en formato "dd/mm/yyyy"
            const fechaConSeparador = dia + '/' + mes + '/' + año;
            const arrayProductos = [];
            const categoriaProducto = document.querySelector('div.vtex-store-components-3-x-productBrandContainer span.vtex-store-components-3-x-productBrandName')?.innerText;
            const marcaProducto = document.querySelector('div.vtex-store-components-3-x-productBrandContainer span.vtex-store-components-3-x-productBrandName')?.innerText;
            const skuElement =document.querySelector('span.vtex-product-identifier-0-x-product-identifier span.vtex-product-identifier-0-x-product-identifier__value')?.innerText;
            const descripcion = document.querySelector('h1.vtex-store-components-3-x-productNameContainer span')?.innerText;   
            let precioXunidadMedida = document.querySelector("div.discoargentina-store-theme-1QiyQadHj-1_x9js9EXUYK")?.innerText; 
            //CAPTURANDO PROMOCIONES                  
            let promoMenosPorcentaje = document.querySelector('div.vtex-flex-layout-0-x-flexCol--main-container div.discoargentina-store-theme-SpFtPOZlANEkxX04GqL31 span')?.innerText;
            let promoEj2X1 = document.querySelector('div.vtex-flex-layout-0-x-flexCol--main-container span.discoargentina-store-theme-Aq2AAEuiQuapu8IqwN0Aj')?.innerText;
            let promoSegundoAlPorcentaje = document.querySelector('div.vtex-flex-layout-0-x-flexCol--main-container div.discoargentina-store-theme-1LCA-xHQ8NgNHQ062m5gTL span.discoargentina-store-theme-MnHW0PCgcT3ih2-RUT-t_')?.innerText;
            let llevandoMasDeUna = document.querySelector("div.vtex-flex-layout-0-x-flexCol--main-container div.discoargentina-store-theme-14k7D0cUQ_45k_MeZ_yfFo")?.innerText; 
            //CADENA
            arrayProductos.push("Disco");
            //SUCURSAL
            arrayProductos.push("Palermo");
            //FECHA
            arrayProductos.push(fechaConSeparador?fechaConSeparador:"");
            //CATEGORIA
            arrayProductos.push(categoriaProducto?categoriaProducto:"");
            //SUBCATEGORIA
            arrayProductos.push("");
            //MARCA
            arrayProductos.push(marcaProducto?marcaProducto:"");
            //DESCRIPCION
            arrayProductos.push(descripcion?descripcion.trim():"");
            //EAN
            arrayProductos.push(skuElement?skuElement:"");
            //PRECIO REGULAR
            let precioAntiguo = document.querySelector('div.vtex-flex-layout-0-x-flexCol--main-container div.discoargentina-store-theme-2t-mVsKNpKjmCAEM_AMCQH')?.innerText;
            arrayProductos.push(precioAntiguo==null || precioAntiguo==undefined?document.querySelector('#priceContainer')?.innerText:precioAntiguo);
            //PRECIO PROMOCIONAL
              if(promoEj2X1){
                arrayProductos.push(promoEj2X1);
                }else if(promoMenosPorcentaje){
                  arrayProductos.push(promoMenosPorcentaje);
                      }else if(promoSegundoAlPorcentaje){
                        arrayProductos.push(promoSegundoAlPorcentaje);
                            }else if(llevandoMasDeUna){
                              arrayProductos.push(llevandoMasDeUna);
                            }else{
                              arrayProductos.push("");
                            }
              //PRECIO OFERTA
              arrayProductos.push(precioAntiguo!=null || precioAntiguo!=undefined?document.querySelector('#priceContainer')?.innerText:"");
              //PRECIO POR UNIDAD DE MEDIDA
              if(precioXunidadMedida){
                let unidades = precioXunidadMedida.split(":");
                let precioXunidad = unidades[0]?unidades[0].split("x"):"";
                arrayProductos.push(unidades?unidades[1].trim():"");           
                //UNIDAD DE MEDIDA
                let unidad = precioXunidad[1]?precioXunidad[1].split(" "):"";
                arrayProductos.push(unidad[1]?unidad[unidad.length - 1].trim():unidad[0]);
              }else{
                arrayProductos.push("");
                arrayProductos.push("");
              }
              //PRECIO ANTIGUO
              arrayProductos.push("");
              return arrayProductos;            
        });
          rows.push(resultado?resultado:"ERROR");
        }catch(error){
          console.log("ERROR AL OBTENER DATOS: "+error);
        }
  }

    await pageProducto.close();
    } catch (error) {
      console.error('Error during scraping individual page:', error);
    } finally {
      
    }
  }

async function loadMoreProducts(page,rows,x,browser) {
  try{
    await page.waitForTimeout(5000);
    //await page.waitForSelector('button.discoargentina-search-result-custom-1-x-fetchMoreOpButton span.discoargentina-search-result-custom-1-x-span-selector-pages');
    const bodyHandle = await page.$('body');
    const { height } = await bodyHandle.boundingBox();
    await bodyHandle.dispose();
    // Definir la velocidad de scroll y el número de pasos
    const scrollSpeed = 10;
    const numSteps = height / scrollSpeed;
    // await page.waitForSelector('#gallery-layout-container');//Espera
    
    console.log("                   ABRIENDO PAGINA ["+x+"]");
    x++;
    await page.waitForTimeout(5000);//Espera

    //YA COMPLETO DE DESPLEGAR TODA LA CATEGORIA
    await page.evaluate(()=>{
      window.scrollTo(0,0);
    })
    //console.log("NO HAY BOTON");

    //HAGO SCROLL DESDE ARRIBA PARA BAJO
    for (let i = 0; i < numSteps; i++) {
      await page.evaluate((scrollSpeed) => {
        window.scrollBy(0, scrollSpeed);
      }, scrollSpeed);
      await page.waitForTimeout(20); 
    }

    const cantPages = await page.evaluate(()=>{
      let stringPages = document.querySelector("button.discoargentina-search-result-custom-1-x-fetchMoreOpButton span.discoargentina-search-result-custom-1-x-span-selector-pages")?.innerText.trim();
      var pages = stringPages? stringPages.split(" "):"";
      var pagesTotales = Number(pages[3]);
      var paginaRecorridas = Number(pages[1]);
      return {
        pagesTotales,
        paginaRecorridas
      }
    })
    //AGREGADO------------------------------
    const linksProductos = await page.evaluate(()=>{
      const enlacesProductos = document.querySelectorAll('#gallery-layout-container div.vtex-search-result-3-x-galleryItem section.vtex-product-summary-2-x-container a');
      let productos = [];
      for (let producto of enlacesProductos) {
        productos.push(producto.href);
      }
      return productos;
    })
    
    await getProducts(rows,linksProductos,browser);
    if(cantPages.pagesTotales != cantPages.paginaRecorridas && x<=cantPages.pagesTotales){

      //APRETAR EL BOTON DE LA PAGINA SIGUIENTE Y VOLVER A EJECUTAR loadMoreProducts
      //OBTENGO EL BOTON ACTUAL 
      let valorEspecifico = cantPages.paginaRecorridas+1;
      let selector = 'div.discoargentina-search-result-custom-1-x-new-btn button.discoargentina-search-result-custom-1-x-option-before[value="' + x + '"]';

      // Verificar si el elemento está presente en la página
      const isElementPresent = await page.evaluate((selector) => {
          return !!document.querySelector(selector);
      }, selector);
      
      if (isElementPresent) {
          // Hacer clic solo si el elemento está presente
          await page.click(selector);
      } else {
        await page.click('div.discoargentina-search-result-custom-1-x-content-btn-next img');
          // Puedes manejar la situación de otra manera si es necesario
      }
      await page.waitForTimeout(5000);//Espera
      await loadMoreProducts(page,rows,x,browser);
    }else{
      console.log("FIN DE CATEGORIA ");
    }
    

  }catch(error){

    console.log("ERROR CARGANDO PAGINA DE LA CATEGORIA "+error);
    await loadMoreProducts(page,rows,x,browser);
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
  const fileName= 'Disco_Palermo_'+fechaConSeparador+'.xlsx';
  const worksheet = workbook.addWorksheet('Productos');

  const Columnas = [
    {header: 'Cadena'},
    {header: 'Sucursal'},
    {header: 'Fecha Scraping'},
    {header: 'Categoria'},
    {header: 'Subcategoria'},
    {header: 'Marca Cadena'},
    {header: 'Descripcion Cadena'},
    {header: 'SKU'},
    {header: 'Precio Regular'},
    {header: 'Precio Promocional'},
    {header: 'Precio Oferta'},
    {header: 'Precio Por Unidad de Medida'},
    {header: 'Unidad de Medida'},
    {header: 'Precio Antiguo'}

  ]
  worksheet.columns = Columnas;
  for(let row of rows){
    worksheet.addRow(row);
  }
  const filePath = 'C:/Users/blass/OneDrive/Desktop/' + fileName; // WINDOWS
  //const filePath = 'C:/Users/Administrator/Desktop/WEB_SCRAPING/ARCHIVOS/DISCO/' + fileName; // WINDOWS

  try {
    await workbook.xlsx.writeFile(filePath);
    console.log(`Archivo Excel creado en: ${filePath}`);
  } catch (error) {
    console.log("ERROR AL GUARDAR EL ARCHIVO EXCEL", error);
  }
}

// Llama a la función principal
scrapeData();