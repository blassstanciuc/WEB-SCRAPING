
//IMPORTAMOS LIBRERIAS
import puppeteer from 'puppeteer';
import ExcelJS from 'exceljs';
import chalk from 'chalk';

async function scrapeData() {
  const proxyUrl = "gw.dataimpulse.com:823"; // Solo el host y el puerto del proxy
  
  const browser = await puppeteer.launch({
     headless: false,
    args: [
      `--proxy-server=${proxyUrl}`,  // Configuramos el proxy en los argumentos
      '--start-fullscreen', 
      '--no-sandbox', 
      '--disable-setuid-sandbox'
    ],
    // executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Ruta a Google Chrome
  });

  const page = await browser.newPage();  // Generamos una nueva ventana

  // Configuramos la autenticación del proxy
  await page.authenticate({
    username: "2b9603d09f0cede38272", // Usuario del proxy
    password: "261f7b6fdb49abb7",     // Contraseña del proxy
  });

  // Establecemos el User-Agent y otros encabezados
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
  await page.setExtraHTTPHeaders({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  });

  await page.setDefaultNavigationTimeout(120000); // Aumentar el tiempo de espera si es necesario

  try {
    await page.goto('https://www.cotodigital.com.ar/sitios/cdigi/nuevositio');
  } catch (err) {
    console.log('ERROR AL ABRIR LA CATEGORÍA [1] Error:', err);
  }
  let i =1;
  const arrayProductos = [];
  const linksCategorias = [
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-almac%C3%A9n-golosinas-alfajores/_/N-1njwjm5',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-almac%C3%A9n-golosinas-chocolates/_/N-uiml5b',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-almac%C3%A9n-golosinas-caramelos-y-chupetines/_/N-1xkf1n',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-almac%C3%A9n-golosinas-chicles-y-pastillas/_/N-axoedr',
    'https://www.cotodigital.com.ar/sitios/cdigi/categoria/catalogo-almac%C3%A9n-panaderia-galletitas/_/N-10z239c',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-almac%C3%A9n-panaderia-panificados/_/N-1sv7ob1',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-almac%C3%A9n-panaderia-galletas-tostadas-y-grisines/_/N-39hspl',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-almac%C3%A9n-snacks/_/N-10kzbyj',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-almac%C3%A9n-cereales/_/N-ukd5id',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-almac%C3%A9n-endulzantes-az%C3%BAcar/_/N-1w1x9xa',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-almac%C3%A9n-infusiones-caf%C3%A9/_/N-1cgicr5',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-almac%C3%A9n-infusiones-mate/_/N-vra9dh',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-almac%C3%A9n-infusiones-mate-cocido/_/N-12sv9y0',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-almac%C3%A9n-infusiones-t%C3%A9/_/N-vtu7ep',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-almacén-aceites-y-condimentos-aceites/_/N-16r0nc0',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-almac%C3%A9n-arroz-y-legumbres-arroz/_/N-149fj7g',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-almacén-polvo-para-postres-y-reposteria/_/N-a6cxru',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-frescos-l%C3%A1cteos-yogures/_/N-rfedtp',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-limpieza-papeles-papel-higi%C3%A9nico/_/N-q3aft3',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-perfumer%C3%ADa-higiene-personal-jabones/_/N-1avz0x',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-bebidas-bebidas-con-alcohol-cerveza/_/N-137sk0z',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-bebidas-bebidas-sin-alcohol-gaseosas/_/N-n4l4r5',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-bebidas-bebidas-sin-alcohol-aguas-aguas-saborizadas/_/N-rtdaup?Nf=product.startDate%7CLTEQ+1.7037216E12%7C%7Cproduct.endDate%7CGTEQ+1.7037216E12&Nr=AND%28product.sDisp_200%3A1004%2Cproduct.language%3Aespa%C3%B1ol%2COR%28product.siteId%3ACotoDigital%29%29',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-bebidas-bebidas-sin-alcohol-jugos-jugos-en-polvo/_/N-xwrj6e?Nf=product.startDate%7CLTEQ+1.7037216E12%7C%7Cproduct.endDate%7CGTEQ+1.7037216E12&Nr=AND%28product.sDisp_200%3A1004%2Cproduct.language%3Aespa%C3%B1ol%2COR%28product.siteId%3ACotoDigital%29%29',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-almac%C3%A9n-aderezos-y-salsas-mayonesas/_/N-r3vqlx',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-bebidas-bebidas-con-alcohol-aperitivos-fernet/_/N-1rutp5',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-perfumer%C3%ADa-pa%C3%B1ales-y-productos-para-incontinencia-pa%C3%B1ales-para-beb%C3%A9/_/N-fmf3uu',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-limpieza-limpieza-de-cocina-detergentes/_/N-bn6wsg',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-limpieza-lavado-jab%C3%B3n-liquido-y-en-polvo/_/N-czvkwoZs5wgl5Z16ef65j?Nf=product.startDate%7CLTEQ+1.726272E12%7C%7Cproduct.endDate%7CGTEQ+1.726272E12&Nr=AND%28product.language%3Aespa%C3%B1ol%2Cproduct.sDisp_200%3A1004%2COR%28product.siteId%3ACotoDigital%29%29',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-perfumer%C3%ADa-cuidado-del-cabello-shampoo/_/N-1p298ndZkzmt8gZ1gpgtl5?Nf=product.startDate%7CLTEQ+1.726272E12%7C%7Cproduct.endDate%7CGTEQ+1.726272E12&Nr=AND%28product.language%3Aespa%C3%B1ol%2Cproduct.sDisp_200%3A1004%2COR%28product.siteId%3ACotoDigital%29%29',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-almac%C3%A9n-sopas-caldos-pur%C3%A9-y-saborizantes-mezcla-lista/_/N-3t1dg7?Dy=1&Nf=product.startDate%7CLTEQ+1.726272E12%7C%7Cproduct.endDate%7CGTEQ+1.726272E12&Nr=AND%28product.language%3Aespa%C3%B1ol%2Cproduct.sDisp_200%3A1004%2Cproduct.siteId%3ACotoDigital%2COR%28product.siteId%3ACotoDigital%29%29&Ntt=PURE+KNOR&Nty=1&_D%3AidSucursal=+&_D%3AsiteScope=+&atg_store_searchInput=PURE+KNOR&idSucursal=200&siteScope=ok',
    // ENLACES DE EJEMPLO
    // "https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-bebidas-bebidas-sin-alcohol-jugos/_/N-11la5tuZc7ha3p?Nf=product.endDate%7CGTEQ+1.7295552E12%7C%7Cproduct.startDate%7CLTEQ+1.7295552E12&Nr=AND%28product.language%3Aespa%C3%B1ol%2Cproduct.sDisp_200%3A1004%2COR%28product.siteId%3ACotoDigital%29%29&Nrpp=12",
    // "https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-bebidas/_/N-c7ha3pZ1c1jy9yZ1y6glk0?Nf=product.endDate%7CGTEQ+1.7295552E12%7C%7Cproduct.startDate%7CLTEQ+1.7295552E12&Nr=AND%28product.language%3Aespa%C3%B1ol%2Cproduct.sDisp_200%3A1004%2COR%28product.siteId%3ACotoDigital%29%29&Nrpp=12&showMoreIds=4291659268",
    // "https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-almac%C3%A9n-panaderia-galletitas/_/N-10z239cZ1arqwxi?Nf=product.endDate%7CGTEQ+1.7295552E12%7C%7Cproduct.startDate%7CLTEQ+1.7295552E12&Nr=AND%28product.sDisp_200%3A1004%2Cproduct.language%3Aespa%C3%B1ol%2COR%28product.siteId%3ACotoDigital%29%29"
   ]
  const rows = [];
  try {
    await page.goto('https://www.cotodigital3.com.ar/sitios/cdigi/');
    try{
      
      let tiempoDeEsperaEnMilisegundos = 10000;
      if(i==1){
       
        await page.evaluate(async (waitTime) => {
        // Utiliza la función setTimeout para esperar el tiempo especificado
        await new Promise(resolve => setTimeout(resolve, waitTime));
        }, tiempoDeEsperaEnMilisegundos);

        // step 0 ------------------------------------------------------------> "CONTINUAR EN EL SITIO ACTUAL"
        // const btnContinuar = await page.$("body > div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div.ui-dialog-buttonset > button.no-border-button.ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-text-only");
        // if (btnContinuar) {
        //   await btnContinuar.click();   
        //   console.error('continuar clickeado'); 
        // } else {
        //   console.error('Elemento continuar no encontrado');
        // }
        // await page.waitForSelector('div.productos');

        //step 1
        //-------------------------------------------------------------------
        const btnIngresar = await page.$("div.configuracion-perfil a");
        if (btnIngresar) {
          await btnIngresar.click();    
          console.error('STEP 1');
        } else {
          console.error('Elemento no encontrado');
        }
        //-------------------------------------------------------------------

        //step 2
        //-------------------------------------------------------------------
        await page.evaluate(async (waitTime) => {
          // Utiliza la función setTimeout para esperar el tiempo especificado
          await new Promise(resolve => setTimeout(resolve, waitTime));
          }, 2000);
        await page.waitForSelector('body > app-root > app-main > app-layout-render > dynamic-loader > cuantica-address-landing-page > section > div > dynamic-loader > login-main > main > div > div > div > div > login > aside > div > div > form');
        const selectorImputAdress = await page.$('#login');
        if(selectorImputAdress){
          await selectorImputAdress.type('Vani Na');
          const selectorImputPass = await page.$('#password');
          await selectorImputPass.type('honda2212');
          console.error('STEP 2');
        }else{
          console.error('NO SE ENCONTRO EL SELECTOR DEL INPUT');
        }
        //-------------------------------------------------------------------

        //step 3
        //-------------------------------------------------------------------
        await page.evaluate(async (waitTime) => {
          // Utiliza la función setTimeout para esperar el tiempo especificado
          await new Promise(resolve => setTimeout(resolve, waitTime));
          }, 2000);
        await page.waitForSelector('button.button_ingresar_login');
        let btnLogin = await page.$("button.button_ingresar_login");
        if (btnLogin) {
          await btnLogin.click();    
          console.error('STEP 3');
          await page.evaluate(async (waitTime) => {
            // Utiliza la función setTimeout para esperar el tiempo especificado
            await new Promise(resolve => setTimeout(resolve, waitTime));
            }, 5000);
        } else {
          console.error('Elemento no encontrado login');
        } 
        //-------------------------------------------------------------------

        //step 4
        //-------------------------------------------------------------------   
        await page.evaluate(async (waitTime) => {
          // Utiliza la función setTimeout para esperar el tiempo especificado
          await new Promise(resolve => setTimeout(resolve, waitTime));
          }, 5000);
        await page.waitForSelector('body > app-root > app-main > app-header > header > div.seccion-principal.container.pb-3.px-0 > div.lado-izquierdo.align-items-center > div');
        const btnUbicacion = await page.$('body > app-root > app-main > app-header > header > div.seccion-principal.container.pb-3.px-0 > div.lado-izquierdo.align-items-center > div');
        if (btnUbicacion){
          await btnUbicacion.click();
          const adminSucursal = await page.$('#address-list > div > div > li:nth-child(4)');
          console.error('STEP 4');
          await adminSucursal.click();    
        }else{
          console.log("No se encontro el elemento cerrar modal");
        }
        //-------------------------------------------------------------------

        // step 5
        //-------------------------------------------------------------------
        await page.evaluate(async (waitTime) => {
          // Utiliza la función setTimeout para esperar el tiempo especificado
          await new Promise(resolve => setTimeout(resolve, waitTime));
          }, 10000);
        await page.waitForSelector('body > app-root > app-main > app-layout-render > dynamic-loader > account-landing-page > section > div > div > dynamic-loader:nth-child(2) > cuantica-account-address > address-main > address-list > main > address-card > div > div:nth-child(1)');
        const btnSucursalLibertador = await page.$('body > app-root > app-main > app-layout-render > dynamic-loader > account-landing-page > section > div > div > dynamic-loader:nth-child(2) > cuantica-account-address > address-main > address-list > main > address-card > div > div:nth-child(2) > div.card-footer.ng-tns-c65-4 > button');
        // const btnSucursalTortugas = await page.$('#atg_store_addressBookDefault > form > div.addressBookScrollPanel > table > tbody > tr:nth-child(2) > td.mute_address_td');
        if (btnSucursalLibertador){
          await btnSucursalLibertador.click();
          console.error('STEP 5');
        }else{
          console.log("No se encontro el elemento seleccion de sucursal");
        }
        // -------------------------------------------------------------------
        console.log(chalk.green("SE INGRESO CORRECTAMENTE A LA SUCURSAL"));
      }
    }catch(error){
      console.log("Error en el ingreso a la sucursal" + error);
    }finally{
      await page.evaluate(async (waitTime) => {
        // Utiliza la función setTimeout para esperar el tiempo especificado
        await new Promise(resolve => setTimeout(resolve, waitTime));
        }, 2000);
      // await page.waitForSelector('#Mixdeofertas > div.carousel-inner');
    }


    console.log(" ");
    console.log(chalk.green.underline('                         [SUCURSAL COTO]                         '));
    console.log(" ");
    console.log("               TOTAL DE CATEGORIAS A ESCRAPEAR "+"["+linksCategorias.length+"]");
    for(let link of linksCategorias){
      console.log("               -> ["+i+"]"+" CATEGORIA DE "+"["+linksCategorias.length+"]");
      i++;
      try{
        
        // Navega a la página principal
        await page.goto(link);
       
        await page.evaluate(async (waitTime) => {
          // Utiliza la función setTimeout para esperar el tiempo especificado
          await new Promise(resolve => setTimeout(resolve, waitTime));
          }, 5000);

        //OBTENGO TODOS LOS PRODUCTOS DE LA PAGINA
        let Productos = await page.evaluate(() => {
          const links = document.querySelectorAll('div.productos div.producto-card catalogue-product');
          // console.log("Producto links:"+links)
          //console.log(links);
          let productos = [];
          for (let producto of links) {
            productos.push(producto.innerHTML);
          }
          return productos;
      });


      // for (const producto of ProductosCards) {
      //   console.log(`Producto:   ${producto}`)
      // }
      // console.log("Producto:"+ProductosCards)


        //Obtengo true si es una One page, esto quiere decir que no puedo recorrela, por lo tanto el programa muere ahi.
        const isOnePage = await page.evaluate(() => {
            let elemento = document.querySelector('app-paginator nav ul.pagination');
                if (elemento != null || elemento != undefined){
                  return elemento = false;
                } else {
                    return elemento = true;
                }
        })

        await openProducts(Productos,browser,arrayProductos,rows,page);
        if (isOnePage === false){
            await openNextPage(page,browser,arrayProductos,rows,i)
            //await createExcel(rows);
            console.log(chalk.yellow("--------------------------------------"));    
            console.log("                   CATEGORIA FINALIZADA");
            console.log(chalk.yellow("--------------------------------------"));   
        }else{
            //await createExcel(rows);
            //console.log("HAY SOLO UNA PAGINA PARA SCRAPEAR");
            //console.log("FIN");
            console.log(chalk.yellow("--------------------------------------"));    
            console.log("                   CATEGORIA FINALIZADA");
            console.log(chalk.yellow("--------------------------------------"));   
        }
      }
      catch(error){
        console.error('ERROR AL ABRIR LA CATEGORIA '+"["+i+"] "+error);
      }
    }  
  } catch (error) {
    console.error('Error during scraping:', error);
  } finally {
    console.log(chalk.red("FIN DEL SCRAPEO by BLAS :)"));
    await createExcel(rows,page);
    await browser.close();
  }
}

async function openProducts(productos,browser,arrayProductos,rows,page) {
  console.log(chalk.red("                   OBTENIENDO DATOS..."));
  // Recorre los enlaces y obtén datos de cada página
  const allProductos = productos;
  for (const producto of allProductos) {
    // Abre una nueva página para cada enlace
    try {
      const resultado = await page.evaluate((productoindividuales) => {
        let tempDiv = document.createElement('div');
        tempDiv.innerHTML = productoindividuales;
        // optionals values
        const fechaActual = new Date();
        // Obtener el día, el mes y el año de la fecha actual
        const dia = fechaActual.getDate().toString().padStart(2, '0');
        const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // Nota: getMonth() devuelve un valor entre 0 y 11, sumamos 1 para obtener el mes real
        const año = fechaActual.getFullYear();
        // Crear una cadena de texto en formato "dd/mm/yyyy"
        const fechaConSeparador = dia + '/' + mes + '/' + año;
        const arrayProductos = [];
        const sucursal = document.querySelector("body > app-root > app-main > app-header > header > div.seccion-principal.container.pb-3.px-0 > div.lado-izquierdo.align-items-center > div > p")?document.querySelector("body > app-root > app-main > app-header > header > div.seccion-principal.container.pb-3.px-0 > div.lado-izquierdo.align-items-center > div > p")?.innerText:"";
        const categoriaProducto = tempDiv.querySelector('#atg_store_breadcrumbs a:last-child')?.innerText;
        const marcaProducto = tempDiv.querySelector('#tab1 table.tblData td:last-child span.texto')?.innerText;
        const eanElement =tempDiv.querySelector('#brandText span.span_codigoplu:last-child')?.innerText;
        const descripcion = tempDiv.querySelector('h3.nombre-producto')?.innerText;
        const priceProducto = tempDiv.querySelector('div.card-container div.centro-precios h4.card-title')?.innerText.trim();
        const oldprice= tempDiv.querySelector("div.card-container div.centro-precios small.marked-text")?.innerText.split(":");
        const precioPromocional = tempDiv.querySelector('span.cucarda-promo.x-cantidad:last-child')?.innerText;
        let precioUnitarioPromocional = tempDiv.querySelector('div.card-container div.centro-precios div.text-center small')?.innerText.split(":");
        const unidad = precioUnitarioPromocional[0]?precioUnitarioPromocional[0].split(" "):null;
        let hayPorcentaje = precioPromocional?precioPromocional[0].includes("%"):false;

        //CADENA
        arrayProductos.push("Coto");
        //SUCURSAL
        if(sucursal == 'depto'){
          arrayProductos.push("Libertador");
        }else{
          arrayProductos.push("Tortugas");
        }
        //FECHA
        arrayProductos.push(fechaConSeparador?fechaConSeparador:"");
        //CATEGORIA
        arrayProductos.push(categoriaProducto?categoriaProducto:"");
        //SUBCATEGORIA
        arrayProductos.push("");
        //MARCA
        arrayProductos.push("");
        //DESCRIPCION
        arrayProductos.push(descripcion?descripcion:"jj");
        //EAN
        arrayProductos.push("");
        //PRECIO REGULAR
        arrayProductos.push(oldprice?oldprice[1]:priceProducto);
        //PRECIO PROMOCIONAL
        arrayProductos.push(precioPromocional?precioPromocional:"");
        //PRECIO UNITARIO PROMOCIONAL
        arrayProductos.push("");
        //PRECIO OFERTA
        arrayProductos.push(oldprice?priceProducto:"");
        //PRECIO POR UNIDAD DE MEDIDA
         arrayProductos.push(precioUnitarioPromocional[1]?precioUnitarioPromocional[1]:"");
        //UNIDAD DE MEDIDA
         arrayProductos.push(unidad?unidad[4]:"");
        //PRECIO ANTIGUO
        arrayProductos.push("");
        return arrayProductos;  
      },producto);

      rows.push(resultado?resultado:"ERROR");
    
    } catch (error) {
      console.error('Error during scraping individual page:', error);
     } 
    // finally {
    //   // Cierra la página actual
    //   await nuevaPagina.close();
    // }
  }
}


async function openNextPage(page,browser,arrayProductos,rows){

  await page.evaluate(async (waitTime) => {
    // Utiliza la función setTimeout para esperar el tiempo especificado
    await new Promise(resolve => setTimeout(resolve, waitTime));
    }, 3000);
  //const pagina = await browser.newPage();
  try{

    const resultadoPage = await page.evaluate(() => {
      let elemento = document.querySelector('body > app-root > app-main > app-layout-render > dynamic-loader > general-slot > dynamic-loader > app-category-landing-page > section > div > div.mt-4.col-12.col-md-9.col-lg-9.col-xxl-9.col-xl-9 > dynamic-loader > general-slot > dynamic-loader > catalogue-main > aside > app-paginator > nav > ul > li:last-child')?document.querySelector('body > app-root > app-main > app-layout-render > dynamic-loader > general-slot > dynamic-loader > app-category-landing-page > section > div > div.mt-4.col-12.col-md-9.col-lg-9.col-xxl-9.col-xl-9 > dynamic-loader > general-slot > dynamic-loader > catalogue-main > aside > app-paginator > nav > ul > li:last-child').outerHTML:null;
      
      return elemento;   
  })
  console.log("ELEMENTO "+resultadoPage)
    if (resultadoPage.includes('hidden="">')) {

      console.log("TIENE HIDDEN ");
      
    } else {
      console.log("NO TIENE HIDDEN");
    }
    

      if( !resultadoPage.includes('hidden="">') ){
        let productoindi = await page.$('body > app-root > app-main > app-layout-render > dynamic-loader > general-slot > dynamic-loader > app-category-landing-page > section > div > div.mt-4.col-12.col-md-9.col-lg-9.col-xxl-9.col-xl-9 > dynamic-loader > general-slot > dynamic-loader > catalogue-main > aside > app-paginator > nav > ul > li:last-child > a');
          await productoindi.click();
          productoindi = null;
          await page.evaluate(async (waitTime) => {
            // Utiliza la función setTimeout para esperar el tiempo especificado
            await new Promise(resolve => setTimeout(resolve, waitTime));
            }, 10000);
          console.log("----------------------------------------");
          console.log("                   ABRIENDO PAGINA");
          console.log("----------------------------------------");
          let Productos = await page.evaluate(() => {
            const links = document.querySelectorAll('div.productos div.producto-card catalogue-product');
            // console.log("Producto links:"+links)
            //console.log(links);
            let productos = [];
            for (let producto of links) {
              productos.push(producto.innerHTML);
            }
            return productos;
        });    
        console.log('TOME LOS PRODUCTOS');
          await openProducts(Productos,browser,arrayProductos,rows,page);
          await openNextPage(page,browser,arrayProductos,rows)
      }else{ 
          console.log('FIN DE LAS PAGINAS');
          //await browser.close();
      }
  }catch(error){
      console.log("ERROR AL ABRIR LA SIGUIENTE PAGINA "+error);
     // await browser.close();
  }
}


async function createExcel(rows,page) {
  const fechaActual = new Date();
  // Obtener el día, el mes y el año de la fecha actual
  const dia = fechaActual.getDate().toString().padStart(2, '0');
  const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // Nota: getMonth() devuelve un valor entre 0 y 11, sumamos 1 para obtener el mes real
  const año = fechaActual.getFullYear();
  // Crear una cadena de texto en formato "dd/mm/yyyy"
  const fechaConSeparador = dia + '_' + mes + '_' + año;
  const workbook = new ExcelJS.Workbook();

  let nombreSucursal = await page.evaluate(()=>{
    let sucursal = document.querySelector("#address-list > div > div > li:nth-child(1) > div > div > div > span.d-block.fw-bold")?.innerText;
    return sucursal;
  })

  console.log("nombre de la sucursal "+nombreSucursal);
  if(nombreSucursal == 'depto'){
    nombreSucursal = "Libertador";
  }else{
    nombreSucursal = "Tortugas";
  }

  const fileName= "Coto_"+nombreSucursal+"_"+fechaConSeparador+'.xlsx';
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
  // const filePath = 'C:/Users/Klehr/Desktop/rockstarsolutions/WEB-SCRAPING/ARCHIVOS/COTO/' + fileName; // WINDOWS

  const filePath = 'C:/Users/blass/Desktop/WEB SCRAPING/ARCHIVOS/' + fileName; // WINDOWS


  try {
    await workbook.xlsx.writeFile(filePath);
    console.log(`Archivo Excel creado en: ${filePath}`);
  } catch (error) {
    console.log("ERROR AL GUARDAR EL ARCHIVO EXCEL", error);
  }
}

// Llama a la función principal
scrapeData();
