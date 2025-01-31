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
  let i =0;
  let x =1;
  const linksCategorias = [
    // 'https://www.jumbo.com.ar/Almacen/Desayuno-y-Merienda?initialMap=c,c&initialQuery=almacen/desayuno-y-merienda&map=category-1,category-2,category-3,category-3,category-3,category-3,category-3,category-3,category-3,category-3&query=/almacen/desayuno-y-merienda/azucar-y-edulcorantes/bizcochuelos-budines-y-magdalenas/cafes/cereales/galletitas-dulces/galletitas-saladas/tes/yerbas&searchState',
    // 'https://www.jumbo.com.ar/Almacen/Golosinas-y-Chocolates',
    // 'https://www.jumbo.com.ar/Almacen/Para-Preparar',
    // 'https://www.jumbo.com.ar/Almacen/Pastas-Secas-y-Salsas?initialMap=c,c&initialQuery=almacen/pastas-secas-y-salsas&map=category-1,category-2,category-3,category-3,category-3&query=/almacen/pastas-secas-y-salsas/pastas-listas/pastas-secas-guiseras/pastas-secas-largas&searchState',
     //  'https://www.jumbo.com.ar/Almacen/Snacks',
    // 'https://www.jumbo.com.ar/Almacen/Panificados',
    // 'https://www.jumbo.com.ar/Almacen/Aceites-y-Vinagres?initialMap=c,c&initialQuery=almacen/aceites-y-vinagres&map=category-1,category-2,category-3,category-3&query=/almacen/aceites-y-vinagres/aceites-comunes/aceites-especiales&searchState',
    // 'https://www.jumbo.com.ar/Almacen/Arroz-y-Legumbres?initialMap=c,c&initialQuery=almacen/arroz-y-legumbres&map=category-1,category-2,category-3,category-3&query=/almacen/arroz-y-legumbres/arroz/arroz-listos&searchState',
    // 'https://www.jumbo.com.ar/Lacteos/Yogures',
    // 'https://www.jumbo.com.ar/perfumeria/cuidado-personal/jabones',
    // 'https://www.jumbo.com.ar/limpieza/papeles/papel-higienico',
    // 'https://www.jumbo.com.ar/Bebidas/Cervezas',
    // 'https://www.jumbo.com.ar/bebidas/aguas/aguas-saborizadas',
    // 'https://www.jumbo.com.ar/Bebidas/Gaseosas',
       'https://www.jumbo.com.ar/bebidas/jugos/en-polvo',
      "https://www.jumbo.com.ar/Bebidas/Aperitivos?initialMap=c,c&initialQuery=bebidas/aperitivos&map=category-1,category-2,brand&query=/bebidas/aperitivos/branca&searchState",
      "https://www.jumbo.com.ar/almacen/caldos-sopas-pure-y-bolsas-para-horno/pure?initialMap=c,c,c&initialQuery=almacen/caldos-sopas-pure-y-bolsas-para-horno/pure&map=category-1,category-2,category-3,brand&query=/almacen/caldos-sopas-pure-y-bolsas-para-horno/pure/knorr&searchState",
      "https://www.jumbo.com.ar/perfumeria/cuidado-capilar/shampoo?initialMap=c,c,c&initialQuery=perfumeria/cuidado-capilar/shampoo&map=category-1,category-2,category-3,brand,brand&query=/perfumeria/cuidado-capilar/shampoo/pantene/sedal&searchState",
      "https://www.jumbo.com.ar/limpieza/cuidado-para-la-ropa/detergente-para-ropa?initialMap=c,c,c&initialQuery=limpieza/cuidado-para-la-ropa/detergente-para-ropa&map=category-1,category-2,category-3,brand,brand&query=/limpieza/cuidado-para-la-ropa/detergente-para-ropa/ariel/skip&searchState",
      "https://www.jumbo.com.ar/limpieza/limpieza-de-cocina/detergentes?initialMap=c,c,c&initialQuery=limpieza/limpieza-de-cocina/detergentes&map=category-1,category-2,category-3,brand,brand&query=/limpieza/limpieza-de-cocina/detergentes/cif/magistral&searchState",
      "https://www.jumbo.com.ar/almacen/aderezos/mayonesas",
      "https://www.jumbo.com.ar/bebes-y-ninos/panales?initialMap=c,c&initialQuery=bebes-y-ninos/panales&map=category-1,category-2,brand,brand&query=/bebes-y-ninos/panales/babysec/pampers&searchState"
    ]
  const rows = [];
  const internalPages = [];

  try {
    console.log(" ");
    console.log(chalk.green.underline('                         [SUCURSAL JUMBO]                         '));
    console.log(" ");
    console.log("               TOTAL DE CATEGORIAS A ESCRAPEAR "+"["+linksCategorias.length+"]");
    for(let link of linksCategorias){
      i++;
      console.log("               -> ["+i+"]"+" CATEGORIA DE "+"["+linksCategorias.length+"]");

      await page.waitForTimeout(20000);
      try{
            // Navega a la página principal
            await page.goto(link);            
            await page.waitForSelector('#gallery-layout-container');
            
            //await page.waitForSelector('div.vtex-flex-layout-0-x-stretchChildrenWidth div.vtex-modal-layout-0-x-triggerContainer');
            let tiempoDeEsperaEnMilisegundos = 15000;

            await page.evaluate(async (waitTime) => {
              // Utiliza la función setTimeout para esperar el tiempo especificado
              await new Promise(resolve => setTimeout(resolve, waitTime));
            }, tiempoDeEsperaEnMilisegundos);

            const [elementHandle] = await page.$x("//html/body/div[2]/div/div[1]/div/div[4]/div[1]/div/div/div[2]/section/div/div[2]/div");

            if (elementHandle) {
              await elementHandle.click();
            } else {
              console.error('Elemento no encontrado');
            }
            await page.waitForSelector('div.vtex-flex-layout-0-x-flexRow--sellerDelivery section div,vtex-flex-layout-0-x-stretchChildrenWidth:last-child div.vtex-modal-layout-0-x-triggerContainer');

            const selectorImput = await page.$('div.jumboargentinaio-delivery-modal-1-x-modalWrapper input');
            if(selectorImput){
              await selectorImput.type('blasstanciuc@gmail.com');
              await page.evaluate(async (waitTime) => {
                // Utiliza la función setTimeout para esperar el tiempo especificado
                await new Promise(resolve => setTimeout(resolve, waitTime));
              }, tiempoDeEsperaEnMilisegundos);
              await page.click('div.jumboargentinaio-delivery-modal-1-x-buttonStyle button');
              await page.evaluate(async (waitTime) => {
                // Utiliza la función setTimeout para esperar el tiempo especificado
                await new Promise(resolve => setTimeout(resolve, waitTime));
              }, tiempoDeEsperaEnMilisegundos);
              await page.click('div.jumboargentinaio-delivery-modal-1-x-pickUpSelectionContainer button');
              await page.evaluate(async (waitTime) => {
                // Utiliza la función setTimeout para esperar el tiempo especificado
                await new Promise(resolve => setTimeout(resolve, waitTime));
              }, tiempoDeEsperaEnMilisegundos);
              const SelectorSelectRegion = 'div.jumboargentinaio-delivery-modal-1-x-StoreFormContainer div.jumboargentinaio-delivery-modal-1-x-StoresDropDownContainer div.vtex-styleguide-9-x-container select'; 
              const opcionASeleccionar = 'Buenos Aires';
              await page.select(SelectorSelectRegion, opcionASeleccionar);
              await page.evaluate(async (waitTime) => {
                // Utiliza la función setTimeout para esperar el tiempo especificado
                await new Promise(resolve => setTimeout(resolve, waitTime));
              }, tiempoDeEsperaEnMilisegundos);
              const SelectorSelectTienda = 'body > div.vtex-modal-layout-0-x-modal.vtex-modal-layout-0-x-modal--store-selector > div > div > div.jumboargentinaio-delivery-modal-1-x-modalWrapper > div > div.jumboargentinaio-delivery-modal-1-x-container.flex.flex-column.ph6.pv7 > div.jumboargentinaio-delivery-modal-1-x-StoresFormContainer.flex.flex-column > div.jumboargentinaio-delivery-modal-1-x-StoreFormContainer > div.jumboargentinaio-delivery-modal-1-x-StoresDropDownContainer.flex.flex-row.justify-around-l.pv2 > div:nth-child(2) > div > label > div > select'; 
              const opcionASeleccionarTienda = 'Jumbo Martinez';
              await page.evaluate(async (waitTime) => {
                // Utiliza la función setTimeout para esperar el tiempo especificado
                await new Promise(resolve => setTimeout(resolve, waitTime));
              }, tiempoDeEsperaEnMilisegundos);
              await page.select(SelectorSelectTienda, opcionASeleccionarTienda);
              await page.evaluate(async (waitTime) => {
                // Utiliza la función setTimeout para esperar el tiempo especificado
                await new Promise(resolve => setTimeout(resolve, waitTime));
              }, tiempoDeEsperaEnMilisegundos);
              await page.click('body > div.vtex-modal-layout-0-x-modal.vtex-modal-layout-0-x-modal--store-selector > div > div > div.jumboargentinaio-delivery-modal-1-x-modalWrapper > div > div.jumboargentinaio-delivery-modal-1-x-container.flex.flex-column.ph6.pv7 > div.jumboargentinaio-delivery-modal-1-x-StoresFormContainer.flex.flex-column > div.jumboargentinaio-delivery-modal-1-x-StoreFormContainer > div.jumboargentinaio-delivery-modal-1-x-buttonsContainer.flex.flex-row.justify-around.pv1 > div.jumboargentinaio-delivery-modal-1-x-buttonStyle.pl5-m.w-100.flex.flex-row.justify-center > button');
              
              tiempoDeEsperaEnMilisegundos = 5000;
              await page.evaluate(async (waitTime) => {
                // Utiliza la función setTimeout para esperar el tiempo especificado
                await new Promise(resolve => setTimeout(resolve, waitTime));
              }, tiempoDeEsperaEnMilisegundos);


            }else{
              console.error('NO SE ENCONTRO EL SELECTOR DEL INPUT');
            }

            await page.waitForSelector('#gallery-layout-container');
            await loadMoreProducts(page,rows,x);//CARGAMOS TODOS LOS PRODUCTOS DE LA PAGINA
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

async function getProducts(productos,page,rows,sucursal) {
  // Recorre los enlaces y obtén datos de cada página
  console.log(chalk.red("                   OBTENIENDO DATOS..."));
    try {
      const allProductos = productos;
      for (const producto of allProductos) {  

          const resultado = await page.evaluate((Productos, sucursal) => {
          
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
            const categoriaProducto = tempDiv.querySelector('div.vtex-breadcrumb-1-x-container--breadcrumb-category span:last-child a:last-child')?.innerText;
           
            
            const marcaProducto = tempDiv.querySelector('div.vtex-product-summary-2-x-productBrandContainer span.vtex-product-summary-2-x-productBrandName')?.innerText;
            

            const eanElement ="";

            const descripcion = tempDiv.querySelector('h2 span.vtex-product-summary-2-x-brandName')?.innerText;                       
            let promoMenosPorcentaje = tempDiv.querySelector('span.jumboargentinaio-store-theme-3Hc7_vKK9au6dX_Su4b0Ae')?.innerText;
            let promoEj2X1 = tempDiv.querySelector('div.jumboargentinaio-store-theme-Aq2AAEuiQuapu8IqwN0Aj span')?.innerText;
            let promoSegundoAlPorcentaje = tempDiv.querySelector('div.jumboargentinaio-store-theme-1LCA-xHQ8NgNHQ062m5gTL span.jumboargentinaio-store-theme-MnHW0PCgcT3ih2-RUT-t_')?.innerText;


              //CADENA
              arrayProductos.push("Jumbo");
              //SUCURSAL
              arrayProductos.push(sucursal);
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
              arrayProductos.push(eanElement?eanElement:"");
              //PRECIO REGULAR
              let precioAntiguo = tempDiv.querySelector('div.jumboargentinaio-store-theme-2t-mVsKNpKjmCAEM_AMCQH')?.innerText;
              arrayProductos.push(precioAntiguo==null || precioAntiguo==undefined?tempDiv.querySelector('div.jumboargentinaio-store-theme-1oaMy8g_TkKDcWOQsx5V2i div.jumboargentinaio-store-theme-1dCOMij_MzTzZOCohX1K7w')?.innerText:tempDiv.querySelector('div.jumboargentinaio-store-theme-2t-mVsKNpKjmCAEM_AMCQH')?.innerText);
              //PRECIO PROMOCIONAL
              if(promoEj2X1){
                arrayProductos.push(promoEj2X1);
                }else if(promoMenosPorcentaje){
                  arrayProductos.push(promoMenosPorcentaje);
                      }else if(promoSegundoAlPorcentaje){
                        arrayProductos.push(promoSegundoAlPorcentaje);
                            }else{
                              arrayProductos.push("");
                            }
              //PRECIO UNITARIO PROMOCIONAL
              let unitarioPromocional = tempDiv.querySelector('div.jumboargentinaio-store-theme-1oaMy8g_TkKDcWOQsx5V2i div.jumboargentinaio-store-theme-1dCOMij_MzTzZOCohX1K7w')?.innerText;
        
              arrayProductos.push(promoEj2X1!=null || promoEj2X1!=undefined || promoSegundoAlPorcentaje!=null || promoSegundoAlPorcentaje!=undefined?unitarioPromocional:"");;
              //PRECIO OFERTA
              arrayProductos.push(promoMenosPorcentaje!=null || promoMenosPorcentaje!=undefined?tempDiv.querySelector('div.jumboargentinaio-store-theme-1oaMy8g_TkKDcWOQsx5V2i div.jumboargentinaio-store-theme-1dCOMij_MzTzZOCohX1K7w')?.innerText:"");

              //PRECIO POR UNIDAD DE MEDIDA
              let precioXunidadMedida = document.querySelector("span.jumboargentinaio-store-theme-1QiyQadHj-1_x9js9EXUYK")?.innerText.split(":");
              let precioXunidad = precioXunidadMedida[1]?precioXunidadMedida[1].split(" "):"";
              console.log("UNIDAD DE MEDIDA SEPARADA "+precioXunidadMedida);
              console.log("UNIDAD DE MEDIDA SEPARADA POR : "+precioXunidad);
              console.log("longitud: "+precioXunidadMedida.length);
              let precioDeUnidad = precioXunidad[1]?precioXunidad[1].split("x"):"";
              arrayProductos.push(precioDeUnidad?precioDeUnidad[0].trim():"");
              //UNIDAD DE MEDIDA
              arrayProductos.push(precioXunidad[precioXunidad.length-1]?precioXunidad[precioXunidad.length-1].trim():"");	
              //PRECIO ANTIGUO
              arrayProductos.push("");
              return arrayProductos;  
            
          },producto,sucursal);
        
      // Imprime los resultados
      //console.log("Categoria: "+resultado.categoriaProducto+" | "+resultado.descripcion+" | "+resultado.eanElement+" | "+resultado.priceProducto);
      rows.push(resultado?resultado:"ERROR");
      }
      //console.log(rows);
    } catch (error) {
      console.error('Error during scraping individual page:', error);
    } finally {
      
    }
  }

async function loadMoreProducts(page,rows,x) {
    await page.waitForTimeout(5000);
    await page.waitForSelector('button.discoargentina-search-result-custom-1-x-fetchMoreOpButton span.discoargentina-search-result-custom-1-x-span-selector-pages');
    const bodyHandle = await page.$('body');
    const { height } = await bodyHandle.boundingBox();
    await bodyHandle.dispose();
    // Definir la velocidad de scroll y el número de pasos
    const scrollSpeed = 10;
    const numSteps = height / scrollSpeed;
    await page.waitForSelector('#gallery-layout-container');//Espera
    
    console.log("                   ABRIENDO PAGINA ["+x+"]");
    x++;
    await page.waitForTimeout(10000);//Espera

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
    //HAGO ESCROLL DE ABAJO PARA ARRIBA
    for (let i = 0; i < numSteps; i++) {
      await page.evaluate((scrollSpeed) => {
        window.scrollBy(0, -scrollSpeed);//lE RESTAMOS  PARA QUE BAJE
      }, scrollSpeed);
      await page.waitForTimeout(20); 
    }

    const Productos = await page.evaluate(() => {
        const links = document.querySelectorAll('#gallery-layout-container div.vtex-search-result-3-x-galleryItem');
        //console.log(links);
        let productos = [];
        for (let producto of links) {
          productos.push(producto.innerHTML);
        }
        return productos;
    });
      
      const sucursal = await page.evaluate(() => {
          const sucursal1 = document.querySelector('body > div.render-container.render-route-store-search-subcategory > div > div.vtex-store__template.bg-base > div > div.vtex-store-header-2-x-headerStickyRow.vtex-store-header-2-x-headerStickyRow--sticky-nav.sticky.z-999 > div.vtex-store-header-2-x-headerRow.vtex-store-header-2-x-headerRow--sticky-nav > div > div > div.vtex-flex-layout-0-x-flexRow.vtex-flex-layout-0-x-flexRow--sellerDelivery > section > div > div:nth-child(2) > div > div > div:nth-child(1) > span > strong');
          return sucursal1?.innerText.trim();
      });
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
    //console.log("CANTIDAD PAGINITAS "+cantPages.paginaRecorridas);
    //console.log("CANTIDAD DE PAGINAS "+cantPages.pagesTotales);

    //console.log("CANTIDAD DE PRODUCTOS QUE TOMA "+Productos.length);
    await getProducts(Productos,page,rows,sucursal);
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
      await page.waitForTimeout(10000);//Espera
      await loadMoreProducts(page,rows,x);
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
  const fileName= 'Jumbo_Martinez'+fechaConSeparador+'.xlsx';
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
  const filePath = '/home/blas/Descargas/' + fileName; // LINUX
  //const filePath = 'C:/Users/Administrator/Desktop/WEB_SCRAPING/ARCHIVOS/VEA/' + fileName; // WINDOWS

  try {
    await workbook.xlsx.writeFile(filePath);
    console.log(`Archivo Excel creado en: ${filePath}`);
  } catch (error) {
    console.log("ERROR AL GUARDAR EL ARCHIVO EXCEL", error);
  }
}

// Llama a la función principal
scrapeData();