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
    await page.goto('https://supermercado.laanonimaonline.com/almacen/aceites/n2_11/');
  } catch (err) {
    console.log('ERROR AL ABRIR LA CATEGORÍA [1] Error:', err);
  }
  let selectorFound = false;
  let attempts = 0;

  const maxAttempts = 10; // Número máximo de intentos
  let i = 0;
  let x = 1;
  const arrayProductos = [];
  const rows = [];


  //LINKS DE LAS CATEGORIAS QUE VISITAREMOS
  const linksCategorias = [ 
    "https://supermercado.laanonimaonline.com/almacen/aceites/n2_11/",
    "https://supermercado.laanonimaonline.com/almacen/arroz-y-legumbres/arroz/n3_93/",
    "https://supermercado.laanonimaonline.com/almacen/cereales/cereales-y-barras/n3_99/",
    "https://supermercado.laanonimaonline.com/almacen/chocolates-y-golosinas/n2_16/",
    "https://supermercado.laanonimaonline.com/frescos/panificados/n2_71/",
    "https://supermercado.laanonimaonline.com/frescos/lacteos/yogures/n3_249/",
    "https://supermercado.laanonimaonline.com/frescos/lacteos/leches/n3_305/",
    "https://supermercado.laanonimaonline.com/almacen/fideos/n2_22/",
    "https://supermercado.laanonimaonline.com/almacen/galletitas-y-panificados/n2_23/",
    "https://supermercado.laanonimaonline.com/almacen/infusiones/n2_25/",
    "https://supermercado.laanonimaonline.com/almacen/polvos-para-postres-y-reposteria/n2_27/",
    "https://supermercado.laanonimaonline.com/almacen/snacks/n2_29/",
    "https://supermercado.laanonimaonline.com/almacen/endulzantes/azucar/n3_124/",
    "https://supermercado.laanonimaonline.com/perfumeria/jabones-de-tocador/n2_47/",
    "https://supermercado.laanonimaonline.com/limpieza/papeles/papel-higienico/n3_231/",
    "https://supermercado.laanonimaonline.com/bebidas/aguas/aguas-saborizadas/n3_156/",
    "https://supermercado.laanonimaonline.com/bebidas/gaseosas/n2_34/",
    "https://supermercado.laanonimaonline.com/bebidas/cervezas/n2_33/",
    "https://supermercado.laanonimaonline.com/bebidas/jugos/jugos-en-polvo/n3_164/",
    "https://supermercado.laanonimaonline.com/aperitivos-con-alcohol/n3_159/filtrar__120/",
    "https://supermercado.laanonimaonline.com/pure/n3_97/filtrar__266/",
    "https://supermercado.laanonimaonline.com/mayonesa/n3_148/filtrar__2354-634/",
    "https://supermercado.laanonimaonline.com/shampoo/n3_186/filtrar__195-521/",
    "https://supermercado.laanonimaonline.com/detergentes-y-jabones/n3_221/filtrar__505-436/",
    "https://supermercado.laanonimaonline.com/lavavajillas/n2_60/filtrar__287-429/",
    "https://supermercado.laanonimaonline.com/aperitivos/n2_32/filtrar___120_/",
    "https://supermercado.laanonimaonline.com/cuidado-cabello/n2_43/filtrar___195-521_182/",
    "https://supermercado.laanonimaonline.com/panales/n2_356/filtrar____/",
    "https://supermercado.laanonimaonline.com/perfumeria/cuidado-cabello/shampoo/n3_186/",
    "https://supermercado.laanonimaonline.com/perfumeria/desodorantes/n2_45/",
    "https://supermercado.laanonimaonline.com/lavado-de-ropa/n2_58/filtrar__221/"
  ]
  try {
    console.log(" ");
    console.log(chalk.green.underline('                  [LA ANONIMA COMODORO RIVADAVIA]                         '));
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
        
        //MODULO DE RECARGA
        while (!selectorFound && attempts < maxAttempts) {
          try {
            // Espera hasta que aparezca el selector en la página
            await page.waitForSelector('#pie_informacion', { timeout: 5000 });
            selectorFound = true; // Se encontró el selector
          } catch (error) {
            console.error('Selector no encontrado, recargando página...');
            attempts++;
            // await page.reload();
            await page.evaluate(() => {
              return new Promise(resolve => {
                setTimeout(resolve, 10000);
              });
            });
            selectorFound = true; // Se encontró el selector
          }
        }      
        //------------------------------------------------
        if (selectorFound) {
          console.log("Comenzando...");
          if(i==1){
            let cerraPopUp = await page.$('#notificacion-btn-cerrar');
            if(cerraPopUp){
              await page.click('#notificacion-btn-cerrar'); //CERRA POPUP
            }
            await selectSucursal(page);
            await page.goto(link);
          }
          
        // HAGO UNA BREVE ESPERA
        await page.evaluate(() => {
          return new Promise(resolve => {
            setTimeout(resolve, 5000);
          });
        });
          //Selecciono los links 
          await getProducts(page,rows);
          //CONSULTO SI LA PAGINA A SCRAPEAR ES UNA UNICA PAGINA, ESTO ME DARA LA PAUTA SI HAY QUE RECORRERALA O NO.
          const isOnePage = await page.evaluate(() => {
            let formulario = document.querySelector('form[name="_paginacion"]');
            let divs = formulario?formulario.querySelectorAll('div'):null;
            let penultimoDiv = divs?divs[divs.length - 2]:null;
            
                if (penultimoDiv){
                  return elemento = penultimoDiv;
                } else {
                    return elemento = false;
                }
            })
           console.log("lo que tiene isoonepage "+isOnePage);
            selectorFound = false;
            attempts = 0;
            //SI NO ES UNA PAGINA UNICA, ABRO LA SIGUIENTE PAGINA 
            if (isOnePage === false){
              console.log(chalk.yellow("--------------------------------------"));    
              console.log("                  CATEGORIA FINALIZADA");
              console.log(chalk.yellow("--------------------------------------"));  
            }else{
              await openNextPage(page,rows);
              console.log(chalk.yellow("--------------------------------------"));    
              console.log("                CATEGORIA FINALIZADA");
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
async function getProducts(page,rows){
//--------------------------------------------------- Esperar y Recorrer pagina 

  await page.waitForTimeout(10000); 

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
  console.log("LLEGUE AL FINAL");
  try {
      //OBTENGO TODOS LOS PRODUCTOS DE LA PAGINA
      const htmlProductos = await page.evaluate(() => {
        const itemsProductos = document.querySelectorAll('div.producto.item.text_center.centrar_img.fijar.cuadro.clearfix');
        console.log(itemsProductos);
        let itemsProducts = [];
        for (let itemProducto of itemsProductos) {
          itemsProducts.push(itemProducto.innerHTML);
        }
        return itemsProducts;
        });
        console.log("DATOS OBTENIDOS "+htmlProductos.length);
        await saveProducts(htmlProductos,page,rows);
      } catch (error) {
        console.log("error al obtener productos");
        return false; 
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
  
          const marcaProducto = tempDiv.querySelector('[id^="brand_item_imetrics_"]');
   
          const eanElement ="";

          const descripcion = tempDiv.querySelector('[id^="name_item_imetrics_"]');

          const priceProducto = tempDiv.querySelector('div.precio-promo  div.precio.semibold.aux1')?.innerText;
         console.log(priceProducto);
          const priceProductoAntiguo = tempDiv.querySelector('[id^="precio_oferta_item_imetrics_"]');

          const priceUnidadDeMedida = tempDiv.querySelector('div.col2_listado > div.precio_complemento.aux1 > div.codigo.aux1.mt-3.mb-3')?.innerText;


          let promo = tempDiv.querySelector('.promocion');
          let promocionOff = null;
          let promoGeneral = null;
          let promocion;
          if(promo){
            let clasesPromo = Array.from(promo.classList);
            promocion = clasesPromo[clasesPromo.length - 1];
            if (promocion.endsWith('-off')) {
                promocionOff=promocion;
                
              }else{
                promoGeneral = promocion;
              }
          }
                    
          let valorDeUnidadMedida = priceUnidadDeMedida.split(":");
          let unidadDeMedida = valorDeUnidadMedida[0].split(" ");
          //console.log(unidadDeMedida[1]); 
          //CADENA
          arrayProductos.push("La Anonima");
          //SUCURSAL
          arrayProductos.push("Comodoro Rivadavia");
          //FECHA
          arrayProductos.push(fechaConSeparador?fechaConSeparador:"");
          //CATEGORIA
          arrayProductos.push("");
          //SUBCATEGORIA
          arrayProductos.push("");
          //MARCA
          arrayProductos.push(marcaProducto?marcaProducto.value:"");
          //DESCRIPCION
          arrayProductos.push(descripcion?descripcion.value:"");
          //EAN
          arrayProductos.push("");
          //PRECIO REGULAR
          arrayProductos.push(promo?priceProductoAntiguo.value:priceProducto);
          //PRECIO PROMOCIONAL
          arrayProductos.push(promo?promocion:"");
          //PRECIO OFERTA
          arrayProductos.push(promoGeneral || promocionOff?priceProducto:"");
          //PRECIO POR UNIDAD DE MEDIDA
          arrayProductos.push(priceUnidadDeMedida?valorDeUnidadMedida[1]:"");
          //UNIDAD DE MEDIDA
          arrayProductos.push(priceUnidadDeMedida?unidadDeMedida[unidadDeMedida.length-1]:"");
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

//Abro la pagina sieguiente 
async function openNextPage(page,rows){
  let nextPage = await page.$('form[name="_paginacion"] div div.img_pag.actual + div');

  console.log("PAGINA SIGUIENTE "+nextPage);
    try{
        if(nextPage){ //Mientras que haya una siguiente pagina 
          console.log("ingrese a la pag siguiente")
            await page.click('form[name="_paginacion"] div div.img_pag.actual + div'); //CLICK EN EL BTN PARA QUE PASE AL SIGUIENTE
            console.log("----------------------------------------");
            console.log("Pasando a la siguiente pagina")
            console.log("----------------------------------------");
            await page.waitForTimeout(10000);
            await getProducts(page,rows);
            await page.waitForTimeout(10000);
            await openNextPage(page,rows)//VOLVEMOS A ejecutar, para que consulte con getNextPage, si hay mas paginas
        }else{ 
            console.log('FIN DE LAS PAGINAS');
        }
    }catch(error){
        console.log("ERROR AL ABRIR LA SIGUIENTE PAGINA "+error);
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
          //console.log("INTENTOS "+intentos);
         // console.log("SELECTOR "+seencontroSelector);
            if(intentos < 2){
                try{
                    const selectProvincia = '#sel_provincia'; 
                    const opcionProvincia = '4';
                    await page.select(selectProvincia, opcionProvincia);

                    const selectLocalidad = '#sel_localidad_4'; 
                    const opcionLocalidad = '12';
                    await page.select(selectLocalidad, opcionLocalidad);

                }catch{
                    console.error('error al setear valores de ingreso');
                }
                try{
                    const btnConfirmar = await page.$("div.btn.estandar.cursor_pointer.btn-confirmar");
                    await btnConfirmar.click();
                }catch{
                  console.error('error al clickear btn de confirmar');
                }

              await page.waitForTimeout(20000);
            }
           
            console.log(".");
            console.log(".");
            console.log("INGRESO A SUCURSAL DE FORMA CORRECTA");
            seencontroSelector = true; // Se encontró el selector
            console.log(chalk.green("-------------------------------------------------------"));
        }
    } catch (error) {
        console.error('ERROR AL ELEGIR SUCURSAL, recargando página...' + error);
        intentos++;           //await page.reload();
        await page.goto('https://supermercado.laanonimaonline.com/home/');
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
  const fileName= 'LaAnonima_ComodoroRivadavia'+fechaConSeparador+'.xlsx';
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
    {header: 'Precio Oferta'},
    {header: 'Precio Por Unidad de Medida'},
    {header: 'Unidad de Medida'}
  ]
  worksheet.columns = Columnas;
  for(let row of rows){
    worksheet.addRow(row);
  }
  const filePath = 'C:/Users/blass/OneDrive/Desktop/' + fileName; // WINDOWS
  //const filePath = '/home/blas/Descargas/' + fileName; // LINUX


  try {
    await workbook.xlsx.writeFile(filePath);
    console.log(`Archivo Excel creado en: ${filePath}`);
  } catch (error) {
    console.log("ERROR AL GUARDAR EL ARCHIVO EXCEL", error);
  }
}

// Llama a la función principal
scrapeData().catch(console.error);