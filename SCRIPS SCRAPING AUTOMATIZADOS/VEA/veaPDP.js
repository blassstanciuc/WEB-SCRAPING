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
  const page = await browser.newPage();
  let i =0;
  let x =1;
  const linksCategorias = [
    // "https://www.vea.com.ar/Almacen/Desayuno-y-Merienda?initialMap=c,c&initialQuery=almacen/desayuno-y-merienda&map=category-1,category-2,category-3,category-3&query=/almacen/desayuno-y-merienda/bizcochuelos-budines-y-magdalenas/galletitas-dulces&searchState",
    //  "https://www.vea.com.ar/Almacen/Desayuno-y-Merienda?initialMap=c,c&initialQuery=almacen/desayuno-y-merienda&map=category-1,category-2,category-3,category-3&query=/almacen/desayuno-y-merienda/cereales/galletitas-saladas&searchState",
    //  "https://www.vea.com.ar/Almacen/Desayuno-y-Merienda?initialMap=c,c&initialQuery=almacen/desayuno-y-merienda&map=category-1,category-2,category-3,category-3&query=/almacen/desayuno-y-merienda/azucar-y-edulcorantes/cafes&searchState",
    //  "https://www.vea.com.ar/Almacen/Desayuno-y-Merienda?initialMap=c,c&initialQuery=almacen/desayuno-y-merienda&map=category-1,category-2,category-3,category-3&query=/almacen/desayuno-y-merienda/tes/yerbas&searchState",
    //  'https://www.vea.com.ar/Almacen/Golosinas-y-Chocolates',
    //  'https://www.vea.com.ar/Almacen/Para-Preparar',
    //  'https://www.vea.com.ar/Almacen/Pastas-Secas-y-Salsas?initialMap=c,c&initialQuery=almacen/pastas-secas-y-salsas&map=category-1,category-2,category-3,category-3,category-3&query=/almacen/pastas-secas-y-salsas/pastas-listas/pastas-secas-guiseras/pastas-secas-largas&searchState',
    //  'https://www.vea.com.ar/Almacen/Snacks',
    //  'https://www.vea.com.ar/Almacen/Panificados',
    //  'https://www.vea.com.ar/Almacen/Aceites-y-Vinagres?initialMap=c,c&initialQuery=almacen/aceites-y-vinagres&map=category-1,category-2,category-3,category-3&query=/almacen/aceites-y-vinagres/aceites-comunes/aceites-especiales&searchState',
    //  'https://www.vea.com.ar/Almacen/Arroz-y-Legumbres?initialMap=c,c&initialQuery=almacen/arroz-y-legumbres&map=category-1,category-2,category-3,category-3&query=/almacen/arroz-y-legumbres/arroz/arroz-listos&searchState',
    //  'https://www.vea.com.ar/Lacteos/Yogures',
    //  'https://www.vea.com.ar/perfumeria/cuidado-personal/jabones',
    //  'https://www.vea.com.ar/limpieza/papeles/papel-higienico',
    //  'https://www.vea.com.ar/Bebidas/Cervezas',
    //   'https://www.vea.com.ar/Bebidas/Gaseosas',
    //  'https://www.vea.com.ar/bebidas/jugos/en-polvo',
    //  "https://www.vea.com.ar/almacen/aderezos/mayonesas",
    // "https://www.vea.com.ar/Bebidas/Aperitivos?initialMap=c,c&initialQuery=bebidas/aperitivos&map=category-1,category-2,brand&query=/bebidas/aperitivos/branca&searchState",
    // "https://www.vea.com.ar/almacen/caldos-sopas-pure-y-bolsas-para-horno/pure?initialMap=c,c,c&initialQuery=almacen/caldos-sopas-pure-y-bolsas-para-horno/pure&map=category-1,category-2,category-3,brand&query=/almacen/caldos-sopas-pure-y-bolsas-para-horno/pure/knorr&searchState",
    // "https://www.vea.com.ar/perfumeria/cuidado-capilar/shampoo?initialMap=c,c,c&initialQuery=perfumeria/cuidado-capilar/shampoo&map=category-1,category-2,category-3,brand,brand&query=/perfumeria/cuidado-capilar/shampoo/pantene/sedal&searchState",
    // "https://www.vea.com.ar/limpieza/cuidado-para-la-ropa/detergente-para-ropa?initialMap=c,c,c&initialQuery=limpieza/cuidado-para-la-ropa/detergente-para-ropa&map=category-1,category-2,category-3,brand,brand&query=/limpieza/cuidado-para-la-ropa/detergente-para-ropa/ariel/skip&searchState",
    // "https://www.vea.com.ar/limpieza/limpieza-de-cocina/detergentes?initialMap=c,c,c&initialQuery=limpieza/limpieza-de-cocina/detergentes&map=category-1,category-2,category-3,brand,brand&query=/limpieza/limpieza-de-cocina/detergentes/cif/magistral&searchState",
    // "https://www.vea.com.ar/bebes-y-ninos/panales?initialMap=c,c&initialQuery=bebes-y-ninos/panales&map=category-1,category-2,brand,brand&query=/bebes-y-ninos/panales/babysec/pampers&searchState"  
    // LINKS DE PRUEBA
    "https://www.vea.com.ar/bebidas/jugos/en-polvo"
  ]
  const rows = [];
  const internalPages = [];

  try {
    console.log(" ");
    console.log(chalk.green.underline('                         [SUCURSAL VEA]                         '));
    console.log(" ");
    console.log("               TOTAL DE CATEGORIAS A ESCRAPEAR "+"["+linksCategorias.length+"]");
    for(let link of linksCategorias){
      i++;
      console.log("               -> ["+i+"]"+" CATEGORIA DE "+"["+linksCategorias.length+"]");

      try{
            // Navega a la página principal
            await page.goto(link);            
            await page.waitForSelector('#gallery-layout-container');
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
                 await pageProducto.waitForTimeout(10000);
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
              const categoriaProducto = document.querySelector('div.vtex-flex-layout-0-x-flexRow--product-main div.vtex-store-components-3-x-productBrandContainer span.vtex-store-components-3-x-productBrandName')?.innerText;
              const marcaProducto = document.querySelector('div.vtex-flex-layout-0-x-flexRow--product-main div.vtex-store-components-3-x-productBrandContainer span.vtex-store-components-3-x-productBrandName')?.innerText;
              const skuElement =document.querySelector('div.vtex-flex-layout-0-x-flexRow--product-main span.vtex-product-identifier-0-x-product-identifier span.vtex-product-identifier-0-x-product-identifier__value')?.innerText;
              const descripcion = document.querySelector('div.vtex-flex-layout-0-x-flexRow--product-main h1.vtex-store-components-3-x-productNameContainer span')?.innerText;
              let promoMenosPorcentaje = document.querySelector('div.vtex-flex-layout-0-x-flexRow--product-main span.veaargentina-store-theme-3Hc7_vKK9au6dX_Su4b0Ae')?.innerText;
              let promoEj2X1 = document.querySelector('div.vtex-flex-layout-0-x-flexRow--product-main div.veaargentina-store-theme-Aq2AAEuiQuapu8IqwN0Aj span')?.innerText;
              let promoSegundoAlPorcentaje = document.querySelector('div.vtex-flex-layout-0-x-flexRow--product-main div.veaargentina-store-theme-1LCA-xHQ8NgNHQ062m5gTL span.veaargentina-store-theme-MnHW0PCgcT3ih2-RUT-t_')?.innerText;
              let precioAntiguo = document.querySelector('div.vtex-flex-layout-0-x-flexRow--product-main div.veaargentina-store-theme-2t-mVsKNpKjmCAEM_AMCQH')?.innerText;
              let precio = document.querySelector('div.vtex-flex-layout-0-x-flexRow--product-main div.veaargentina-store-theme-1oaMy8g_TkKDcWOQsx5V2i div.veaargentina-store-theme-1dCOMij_MzTzZOCohX1K7w')?.innerText;
              //CADENA
              arrayProductos.push("VEA");
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
                //PRECIO OFERTA
                arrayProductos.push(precioAntiguo?precio:"");

                //PRECIO POR UNIDAD DE MEDIDA
                let precioXunidadMedida = document.querySelector("div.vtex-flex-layout-0-x-flexRow.vtex-flex-layout-0-x-flexRow--product-main > section > div > div:nth-child(1) > div > div > div > div > div:nth-child(2) > div > div:nth-child(4) > div > div > div > div > div:nth-child(1) > div > div.veaargentina-store-theme-1QiyQadHj-1_x9js9EXUYK")?.innerText;               
                 if(precioXunidadMedida){
                  let unidades = precioXunidadMedida.split(":");
                  let precioXunidad = unidades[1]?unidades[1].split("x"):"";  
                  let unidad = unidades[0]?unidades[0].split("x"):"";  
                  
                  arrayProductos.push(precioXunidad[precioXunidad.length-1]?precioXunidad[precioXunidad.length-1].trim():"");
                  //UNIDAD DE MEDIDA
                  arrayProductos.push(unidad[1]?unidad[1].trim():"");
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
          console.error('Error during scraping individual page: '+producto + " :"+error);
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
  const fileName= 'Vea_'+fechaConSeparador+'.xlsx';
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