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
  await page.setDefaultNavigationTimeout(120000);
  let i =1;
  let x =1;
  const linksCategorias = [
    'https://www.jumbo.com.ar/almacen/desayuno-y-merienda',
    'https://www.jumbo.com.ar/Almacen/Golosinas-y-Chocolates',
    'https://www.jumbo.com.ar/Almacen/Para-Preparar',
    'https://www.jumbo.com.ar/almacen/pastas-secas-y-salsas',
     'https://www.jumbo.com.ar/Almacen/Snacks',
    'https://www.jumbo.com.ar/Almacen/Panificados',
    'https://www.jumbo.com.ar/almacen/aceites-y-vinagres',
    'https://www.jumbo.com.ar/almacen/arroz-y-legumbres',
    'https://www.jumbo.com.ar/Lacteos/Yogures',
    'https://www.jumbo.com.ar/perfumeria/cuidado-personal/jabones',
      'https://www.jumbo.com.ar/limpieza/papeles/papel-higienico',
    'https://www.jumbo.com.ar/Bebidas/Cervezas',
    'https://www.jumbo.com.ar/bebidas/aguas/aguas-saborizadas',
    'https://www.jumbo.com.ar/Bebidas/Gaseosas',
     'https://www.jumbo.com.ar/bebidas/jugos/en-polvo',

  //   DE PRUEBA
  //  "https://www.jumbo.com.ar/Bebidas/Gaseosas?initialMap=c,c&initialQuery=bebidas/gaseosas&map=category-1,category-2,category-3&query=/bebidas/gaseosas/cola&searchState"    
]
  const rows = [];
  const internalPages = [];

  try {
    console.log(" ");
    console.log(chalk.green.underline('                         [SUCURSAL JUMBO SAN MARTIN]                         '));
    console.log(" ");
    console.log("               TOTAL DE CATEGORIAS A ESCRAPEAR "+"["+linksCategorias.length+"]");
    for(let link of linksCategorias){
      console.log("               -> ["+i+"]"+" CATEGORIA DE "+"["+linksCategorias.length+"]");
      try{
        // Navega a la página principal
        await page.goto(link); 
        try{

          if(i==1){
            
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
              // await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 5000 });
              
              await page.waitForSelector("#btnNoIdWpnPush");
              await page.click('#btnNoIdWpnPush');
              console.log("PRIMERO "); 
              await page.evaluate(async (waitTime) => {
                // Utiliza la función setTimeout para esperar el tiempo especificado
                await new Promise(resolve => setTimeout(resolve, waitTime));
                }, 50000);
                console.log("PASE EL CLICK #btnNoIdWpnPush ");  
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
  
            await page.click('div.jumboargentinaio-delivery-modal-1-x-selectionContainer div.jumboargentinaio-delivery-modal-1-x-pickUpSelectionContainer:last-of-type div.jumboargentinaio-delivery-modal-1-x-ButtonPlain  button');
           
            await page.evaluate(async (waitTime) => {
                // Utiliza la función setTimeout para esperar el tiempo especificado
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }, tiempoDeEsperaEnMilisegundos);
  
  
            const SelectorSelectRegion = 'div.jumboargentinaio-delivery-modal-1-x-StoresDropDownContainer div.jumboargentinaio-delivery-modal-1-x-dropdownStoreForm div label div.vtex-styleguide-9-x-container select'; 
            
            // const opcionASeleccionar = 'Capital Federal'; // ->PALERMO
            const opcionASeleccionar = 'Buenos Aires'; // -> SAN MARTIN
            // const opcionASeleccionar = 'Buenos Aires'; // -> BUENOS AIRES
            await page.select(SelectorSelectRegion, opcionASeleccionar);
            await page.evaluate(async (waitTime) => {
                // Utiliza la función setTimeout para esperar el tiempo especificado
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }, tiempoDeEsperaEnMilisegundos);
            const SelectorSelectTienda = 'div.jumboargentinaio-delivery-modal-1-x-StoresDropDownContainer div.jumboargentinaio-delivery-modal-1-x-dropdownStoreForm.pl5:last-of-type div label div.vtex-styleguide-9-x-container select'; 
            
            // const opcionASeleccionarTienda = 'Jumbo Palermo'; // -> CAPITAL FEDERAL
            const opcionASeleccionarTienda = 'Jumbo San Martín'; // ->BUENOS AIRES
            // const opcionASeleccionarTienda = 'Jumbo Martinez'; // ->BUENOS AIRES
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
              page.click('div.jumboargentinaio-delivery-modal-1-x-buttonStyle button')
            ]);
           
            }else{
            console.error('NO SE ENCONTRO EL SELECTOR DEL INPUT');
            }
          }  

        }catch(error){
          console.error('ERROR INTENTAR LOGGEARSE ',error);
        }
        //REALIZAR SELECCION DE SUCURSAL
        console.log("               -> ["+i+"]"+" CATEGORIA DE "+"["+linksCategorias.length+"]"); 
            
        await page.waitForSelector('div.flagsContainer');
        if(i==1){ 
          console.log("YENDO A LA PAGINA -> "+i)
          await page.goto(link);   
        }
        i++;  
        await loadMoreProducts(page,rows,x,browser,link);//CARGAMOS TODOS LOS PRODUCTOS DE LA PAGINA
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
    for (const producto of linksProductos){
      try{  
        await pageProducto.goto(producto); 
          try{
            await pageProducto.waitForSelector('h1.vtex-store-components-3-x-productNameContainer span');
            await pageProducto.waitForTimeout(10000); //NUEVA ESPERA
            }catch(error){
              await pageProducto.waitForTimeout(10000);
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
            let promoMenosPorcentaje = document.querySelector('div.jumboargentinaio-store-theme-SpFtPOZlANEkxX04GqL31 span')?.innerText;
            let promoEj2X1 = document.querySelector('span.jumboargentinaio-store-theme-Aq2AAEuiQuapu8IqwN0Aj')?.innerText;
            let promoSegundoAlPorcentaje = document.querySelector('div.jumboargentinaio-store-theme-1LCA-xHQ8NgNHQ062m5gTL span.jumboargentinaio-store-theme-MnHW0PCgcT3ih2-RUT-t_')?.innerText;
            let precioAntiguo = document.querySelector('div.jumboargentinaio-store-theme-2t-mVsKNpKjmCAEM_AMCQH')?.innerText;
            let precio = document.querySelector('div.jumboargentinaio-store-theme-1dCOMij_MzTzZOCohX1K7w')?.innerText;

              //CADENA
              arrayProductos.push("Jumbo");
              //SUCURSAL
              arrayProductos.push("Jumbo San Martin");
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
                arrayProductos.push(precioAntiguo? precio:"");

                //PRECIO POR UNIDAD DE MEDIDA
                let precioXunidadMedida = document.querySelector("span.jumboargentinaio-store-theme-1QiyQadHj-1_x9js9EXUYK")?.innerText;
                if(precioXunidadMedida){
                  let unidades = precioXunidadMedida.split(":");
                  let precioXunidad = unidades[1]?unidades[1].split(" "):"";
                  let precioDeUnidad = precioXunidad[1]?precioXunidad[1].split("x"):"";             
                  arrayProductos.push(precioDeUnidad?precioDeUnidad[0].trim():"");
                  //UNIDAD DE MEDIDA
                  arrayProductos.push(precioXunidad[precioXunidad.length-1]?precioXunidad[precioXunidad.length-1].trim():"");
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

async function loadMoreProducts(page,rows,x,browser,link) {
  console.log("                   ABRIENDO PAGINA ["+x+"]");
  await page.waitForTimeout(2000);
  const bodyHandle = await page.$('body');
  const { height } = await bodyHandle.boundingBox();
  await bodyHandle.dispose();
  const scrollSpeed = 10;
  const numSteps = height / scrollSpeed;
  x++;
  await page.waitForTimeout(10000);//Espera
  //------------------------------------------------------------->YA COMPLETO DE DESPLEGAR TODA LA CATEGORIA
  await page.evaluate(()=>{
    window.scrollTo(0,0);//------------------------------------------------------------->SE DESPLAZA HACIA ARRIBA
  })
  //HAGO SCROLL DESDE ARRIBA PARA BAJO
  for (let i = 0; i < numSteps; i++) {
    await page.evaluate((scrollSpeed) => {
      window.scrollBy(0, scrollSpeed);
    }, scrollSpeed);
    await page.waitForTimeout(20); 
  }
  //------------------------------------------------------------->SCROLL
  console.log("                   ¡PAGINA ABIERTA!");

  const Productos = await page.evaluate(() => {
      const links = document.querySelectorAll('#gallery-layout-container div.vtex-search-result-3-x-galleryItem');
      let productos = [];
      for (let producto of links) {
        productos.push(producto.innerHTML);
      }
      return productos;
  });//------------------------------------------------------------->OBTENGO LOS PRODUCTOS
    
  const sucursal = await page.evaluate(() => {
        const sucursal1 = document.querySelector('body > div.render-container.render-route-store-search-subcategory > div > div.vtex-store__template.bg-base > div > div.vtex-store-header-2-x-headerStickyRow.vtex-store-header-2-x-headerStickyRow--sticky-nav.sticky.z-999 > div.vtex-store-header-2-x-headerRow.vtex-store-header-2-x-headerRow--sticky-nav > div > div > div.vtex-flex-layout-0-x-flexRow.vtex-flex-layout-0-x-flexRow--sellerDelivery > section > div > div:nth-child(2) > div > div > div:nth-child(1) > span > strong');
        return sucursal1?.innerText.trim();
    });//------------------------------------------------------------->OBTENGO LA SUCURSAL

  const cantPages = await page.evaluate(()=>{
    let stringPages = document.querySelector("button.discoargentina-search-result-custom-1-x-fetchMoreOpButton span.discoargentina-search-result-custom-1-x-span-selector-pages")?.innerText.trim();
    var pages = stringPages? stringPages.split(" "):"";
    var pagesTotales = Number(pages[3]);
    var paginaRecorridas = Number(pages[1]);
    return {
      pagesTotales,
      paginaRecorridas
    }
  })//------------------------------------------------------------->OBTENGO LA CANTIDAD DE PAGINAS TOTALES Y RECORRIDAS
  
  const linksProductos = await page.evaluate(()=>{
    const enlacesProductos = document.querySelectorAll('#gallery-layout-container div.vtex-search-result-3-x-galleryItem section.vtex-product-summary-2-x-container a');
    let productos = [];
    for (let producto of enlacesProductos) {
      productos.push(producto.href);
    }
    return productos;
  })//------------------------------------------------------------->OBTENGO LOS LINKS A LOS PRODUCTOS

   await getProducts(Productos,page,rows,sucursal,linksProductos,browser);//---------------------------------->OBTENGO LOS DATOS DE LOS PODUCTOS
  // console.log("OBTENGO LOS PRODUCTOS...............");
  // console.log("-------------------------------------");

  if(cantPages.pagesTotales != cantPages.paginaRecorridas && x<=cantPages.pagesTotales){
    // console.log("valor cantidad de paginas totales "+cantPages.pagesTotales);
    // console.log("valor cantidad de paginas recorridas "+cantPages.paginaRecorridas);
    // console.log("la x tiene el valor "+x);
    // console.log("el link tiene el valor "+link);
    // console.log("vamos a-> "+link+"?page="+x); 
    console.log("-----------------------------");
    await page.goto(link+"?page="+x); 
    await page.waitForTimeout(2000);//Espera
    await loadMoreProducts(page,rows,x,browser,link);
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
  const fileName= 'Jumbo_SAN_MARTIN_SKU'+fechaConSeparador+'.xlsx';
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





        