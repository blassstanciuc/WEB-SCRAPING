//ACA DEJARE LOS LINKS ORIGINALES CON LOS FILTROS
import puppeteer from 'puppeteer';
import ExcelJS from 'exceljs';
import chalk  from 'chalk';

import  writeFileSync from 'fs';
import  saveAs  from 'file-saver';

async function scrapeData() {
  const browser = await puppeteer.launch({
   // headless: false,
    args: ['--start-fullscreen', '--no-sandbox', '--disable-setuid-sandbox'],
    protocolTimeout: 60000 // 60 segundos 
  });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(120000);
  let i =1;
  let x =1;
  const linksCategorias = [
    // 'https://www.jumbo.com.ar/Almacen/Desayuno-y-Merienda?initialMap=c,c&initialQuery=almacen/desayuno-y-merienda&map=category-1,category-2,category-3,category-3&query=/almacen/desayuno-y-merienda/bizcochuelos-budines-y-magdalenas/galletitas-dulces&searchState',
    // 'https://www.jumbo.com.ar/Almacen/Desayuno-y-Merienda?initialMap=c,c&initialQuery=almacen/desayuno-y-merienda&map=category-1,category-2,category-3,category-3&query=/almacen/desayuno-y-merienda/cereales/galletitas-saladas&searchState',
    // 'https://www.jumbo.com.ar/Almacen/Desayuno-y-Merienda?initialMap=c,c&initialQuery=almacen/desayuno-y-merienda&map=category-1,category-2,category-3,category-3&query=/almacen/desayuno-y-merienda/azucar-y-edulcorantes/cafes&searchState',
    // 'https://www.jumbo.com.ar/Almacen/Desayuno-y-Merienda?initialMap=c,c&initialQuery=almacen/desayuno-y-merienda&map=category-1,category-2,category-3,category-3&query=/almacen/desayuno-y-merienda/tes/yerbas&searchState',
    // 'https://www.jumbo.com.ar/Almacen/Golosinas-y-Chocolates',
    // 'https://www.jumbo.com.ar/Almacen/Para-Preparar',
    // 'https://www.jumbo.com.ar/Almacen/Pastas-Secas-y-Salsas?initialMap=c,c&initialQuery=almacen/pastas-secas-y-salsas&map=category-1,category-2,category-3,category-3,category-3&query=/almacen/pastas-secas-y-salsas/pastas-listas/pastas-secas-guiseras/pastas-secas-largas&searchState',
    // 'https://www.jumbo.com.ar/Almacen/Snacks',
    // 'https://www.jumbo.com.ar/Almacen/Panificados',
    // 'https://www.jumbo.com.ar/Almacen/Aceites-y-Vinagres?initialMap=c,c&initialQuery=almacen/aceites-y-vinagres&map=category-1,category-2,category-3,category-3&query=/almacen/aceites-y-vinagres/aceites-comunes/aceites-especiales&searchState',
    // 'https://www.jumbo.com.ar/Almacen/Arroz-y-Legumbres?initialMap=c,c&initialQuery=almacen/arroz-y-legumbres&map=category-1,category-2,category-3,category-3&query=/almacen/arroz-y-legumbres/arroz/arroz-listos&searchState',
    // 'https://www.jumbo.com.ar/Lacteos/Yogures',
    // 'https://www.jumbo.com.ar/perfumeria/cuidado-personal/jabones',
    //  'https://www.jumbo.com.ar/limpieza/papeles/papel-higienico',
    // 'https://www.jumbo.com.ar/Bebidas/Cervezas',
    // 'https://www.jumbo.com.ar/bebidas/aguas/aguas-saborizadas',
    // 'https://www.jumbo.com.ar/Bebidas/Gaseosas',
    // 'https://www.jumbo.com.ar/bebidas/jugos/en-polvo'
  //   DE PRUEBA
    "https://www.jumbo.com.ar/almacen/desayuno-y-merienda/galletitas-dulces?initialMap=c,c,c&initialQuery=almacen/desayuno-y-merienda/galletitas-dulces&map=category-1,category-2,category-3,brand&query=/almacen/desayuno-y-merienda/galletitas-dulces/oreo&searchState"
]
  const rows = [];
  const internalPages = [];
  try {
    console.log(" ");
    console.log(chalk.green.underline('                         [SUCURSAL JUMBO MARTINEZ]                         '));
    console.log(" ");
    console.log("               TOTAL DE CATEGORIAS A ESCRAPEAR "+"["+linksCategorias.length+"]");
    for(let link of linksCategorias){
      console.log("               -> ["+i+"]"+" CATEGORIA DE "+"["+linksCategorias.length+"]");

      

      try{
            // Navega a la página principal
            await page.goto(link);            
            if(i==0){
                
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
                //await page.waitForSelector('div.vtex-flex-layout-0-x-flexRow--sellerDelivery section div,vtex-flex-layout-0-x-stretchChildrenWidth:last-child div.vtex-modal-layout-0-x-triggerContainer');

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
                
                let tiempoDeEspera = 8000;
                await page.evaluate(async (waitTime) => {
                    // Utiliza la función setTimeout para esperar el tiempo especificado
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                }, tiempoDeEspera);


                }else{
                console.error('NO SE ENCONTRO EL SELECTOR DEL INPUT');
                }
            }
            //await page.waitForSelector('#gallery-layout-container');
            await loadMoreProducts(page,rows,x,browser);//CARGAMOS TODOS LOS PRODUCTOS DE LA PAGINA
        console.log(chalk.yellow("--------------------------------------"));    
        console.log("                   CATEGORIA FINALIZADA");
        console.log(chalk.yellow("--------------------------------------"));   
        i++;
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

async function getProducts(productos,page,rows,sucursal,linksProductos,browser) { 
  //LOS PRODUCTOS SE TIENEN QUE ABRIR Y CERRAR, PARA ESO SE DEBE PASAR POR PARAMETRO EL BROWSER
  // Recorre los enlaces y obtén datos de cada página
  console.log(chalk.red("                   OBTENIENDO DATOS..."));
   
        const allProductos = productos;
        const pageProducto = await browser.newPage();
        for (const producto of linksProductos) 
        {
          try{  
            await pageProducto.goto(producto); 
            try{
                await pageProducto.waitForSelector('h1.vtex-store-components-3-x-productNameContainer span');
                 await pageProducto.waitForTimeout(5000);
              }catch{
              await pageProducto.waitForTimeout(5000);
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
              let promoMenosPorcentaje = document.querySelector('span.jumboargentinaio-store-theme-3Hc7_vKK9au6dX_Su4b0Ae')?.innerText;
              let promoEj2X1 = document.querySelector('div.jumboargentinaio-store-theme-Aq2AAEuiQuapu8IqwN0Aj span')?.innerText;
              let promoSegundoAlPorcentaje = document.querySelector('div.jumboargentinaio-store-theme-1LCA-xHQ8NgNHQ062m5gTL span.jumboargentinaio-store-theme-MnHW0PCgcT3ih2-RUT-t_')?.innerText;
              let precioAntiguo = document.querySelector('div.jumboargentinaio-store-theme-2t-mVsKNpKjmCAEM_AMCQH')?.innerText;
              let precio = document.querySelector('div.jumboargentinaio-store-theme-1dCOMij_MzTzZOCohX1K7w')?.innerText;
              let precioXunidadMedida = document.querySelector("span.jumboargentinaio-store-theme-1QiyQadHj-1_x9js9EXUYK")?.innerText;

              //CADENA
              arrayProductos.push("Jumbo");
              //SUCURSAL
              arrayProductos.push("Jumbo Martinez");
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
              arrayProductos.push(precioAntiguo?precioAntiguo:precio);
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
                let unitarioPromocional = document.querySelector('div.jumboargentinaio-store-theme-1oaMy8g_TkKDcWOQsx5V2i div.jumboargentinaio-store-theme-1dCOMij_MzTzZOCohX1K7w')?.innerText;
                  
                arrayProductos.push(promoEj2X1!=null || promoEj2X1!=undefined || promoSegundoAlPorcentaje!=null || promoSegundoAlPorcentaje!=undefined?unitarioPromocional:"");
                //PRECIO OFERTA
                arrayProductos.push(((promoMenosPorcentaje!=undefined || promoMenosPorcentaje!=null) && precioAntiguo)? precio:"");

                //PRECIO POR UNIDAD DE MEDIDA
                if(precioXunidadMedida){
                  let unidades = precioXunidadMedida.split(":");
                  let precioXunidad = unidades[1]?unidades[1].split("x"):"";       
                  arrayProductos.push(precioXunidad[precioXunidad.length-1]?precioXunidad[precioXunidad.length-1].trim():"");
                  //UNIDAD DE MEDIDA
                  arrayProductos.push(precioXunidad?precioXunidad[1].trim():"");
                }else{
                  arrayProductos.push("");
                  arrayProductos.push("");
                }
                //PRECIO ANTIGUO
                arrayProductos.push("");
                return arrayProductos;  
              
            });
          
        // Imprime los resultados
        //console.log("Categoria: "+resultado.categoriaProducto+" | "+resultado.descripcion+" | "+resultado.eanElement+" | "+resultado.priceProducto);
        rows.push(resultado?resultado:"ERROR");
        
          } catch (error) {
          console.error('Error during scraping individual page: '+producto);
          } 
        }
        await pageProducto.close();
        
}

async function loadMoreProducts(page,rows,x,browser) {
    await page.waitForTimeout(2000);
   // await page.waitForSelector('button.discoargentina-search-result-custom-1-x-fetchMoreOpButton span.discoargentina-search-result-custom-1-x-span-selector-pages');
    const bodyHandle = await page.$('body');
    const { height } = await bodyHandle.boundingBox();
    await bodyHandle.dispose();
    // Definir la velocidad de scroll y el número de pasos
    const scrollSpeed = 10;
    const numSteps = height / scrollSpeed;
    //await page.waitForSelector('#gallery-layout-container');//Espera
    
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

    const Productos = await page.evaluate(() => {
        const links = document.querySelectorAll('#gallery-layout-container div.vtex-search-result-3-x-galleryItem');
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
    //AGREGADO------------------------------
    const linksProductos = await page.evaluate(()=>{
      const enlacesProductos = document.querySelectorAll('#gallery-layout-container div.vtex-search-result-3-x-galleryItem section.vtex-product-summary-2-x-container a');
      let productos = [];
      for (let producto of enlacesProductos) {
        productos.push(producto.href);
      }
      return productos;
    })

    await getProducts(Productos,page,rows,sucursal,linksProductos,browser);
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
      await page.waitForTimeout(2000);//Espera
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
  const fileName= 'Jumbo_SKU_GENERICO'+fechaConSeparador+'.xlsx';
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
  //const filePath = '/home/blas/Descargas/' + fileName; // LINUX
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
