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
  let i =1;
  const linksCategorias = [
    // 'https://www.hiperlibertad.com.ar/almacen/desayuno-y-merienda/galletitas-dulces?sc=1',
    // 'https://www.hiperlibertad.com.ar/almacen/desayuno-y-merienda/galletitas-saladas?sc=1',
    // 'https://www.hiperlibertad.com.ar/almacen/desayuno-y-merienda/cereales?sc=1',
    // 'https://www.hiperlibertad.com.ar/almacen/desayuno-y-merienda/bizcochuelos-budines-y-magdalenas?sc=1',
    // 'https://www.hiperlibertad.com.ar/almacen/para-preparar?sc=1',
    // 'https://www.hiperlibertad.com.ar/bebidas/jugos/en-polvo?sc=1',
    // 'https://www.hiperlibertad.com.ar/almacen/golosinas-y-chocolates?sc=1',
    // 'https://www.hiperlibertad.com.ar/almacen/aceites-y-vinagres/aceites/aceites-de-girasol/aceites-de-oliva/aceites-mezcla/otras-variedades-de-aceites?initialMap=c,c&initialQuery=almacen/aceites-y-vinagres&map=category-1,category-2,category-3,category-3,category-3,category-3,category-3&sc=1',
    // 'https://www.hiperlibertad.com.ar/almacen/golosinas-y-chocolates?sc=1',
    // 'https://www.hiperlibertad.com.ar/almacen/arroz-y-legumbres/arroz?initialMap=c,c&initialQuery=almacen/arroz-y-legumbres&map=category-1,category-2,category-3&sc=1',
    // 'https://www.hiperlibertad.com.ar/almacen/panificados?sc=1',
    // 'https://www.hiperlibertad.com.ar/almacen/pastas-secas-y-salsas?sc=1',
    // 'https://www.hiperlibertad.com.ar/almacen/snacks?sc=1',
    // 'https://www.hiperlibertad.com.ar/lacteos/yogures?sc=1',
    // 'https://www.hiperlibertad.com.ar/limpieza/papeles/papel-higienico?sc=1',
    // 'https://www.hiperlibertad.com.ar/perfumeria/cuidado-personal/jabones?sc=1',
    // 'https://www.hiperlibertad.com.ar/bebidas/cervezas?sc=1',
    // 'https://www.hiperlibertad.com.ar/bebidas/gaseosas?sc=1',
    // 'https://www.hiperlibertad.com.ar/bebidas/aguas/aguas-saborizadas?sc=1',
    // 'https://www.hiperlibertad.com.ar/lacteos/leches?sc=1'
    // 'https://www.hiperlibertad.com.ar/almacen/desayuno-y-merienda/galletitas-dulces/mir/obleas?initialMap=c,c,c&initialQuery=almacen/desayuno-y-merienda/galletitas-dulces&map=category-1,category-2,category-3,brand,tipo&sc=1'
  "https://www.hiperlibertad.com.ar/almacen/aderezos/mayonesas",
"https://www.hiperlibertad.com.ar/bebidas/aperitivos/con-alcohol/fernet?initialMap=c,c,c&initialQuery=bebidas/aperitivos/con-alcohol&map=category-1,category-2,category-3,tipo",
"https://www.hiperlibertad.com.ar/caldos-sopas-y-pure/pure%20knorr?_q=PURE%20KNORR&fuzzy=auto&initialMap=ft&initialQuery=pure%20knorr&map=category-2,ft&operator=or",
"https://www.hiperlibertad.com.ar/perfumeria/cuidado-capilar/shampoo/pantene/sedal?initialMap=c,c,c&initialQuery=perfumeria/cuidado-capilar/shampoo&map=category-1,category-2,category-3,brand,brand",
"https://www.hiperlibertad.com.ar/limpieza/limpieza-de-cocina/detergentes/cif?initialMap=c,c,c&initialQuery=limpieza/limpieza-de-cocina/detergentes&map=category-1,category-2,category-3,brand",
"https://www.hiperlibertad.com.ar/limpieza/cuidado-de-la-ropa/jabon-liquido/skip?initialMap=c,c,c&initialQuery=limpieza/cuidado-de-la-ropa/jabon-liquido&map=category-1,category-2,category-3,brand"

  ]
  const rows = [];
  try {
    console.log(" ");
    console.log(chalk.green.underline('                         [SUCURSAL LIBERTAD HIPER LUGONES]                         '));
    console.log(" ");
    console.log("               TOTAL DE CATEGORIAS A ESCRAPEAR "+"["+linksCategorias.length+"]");
    for(let link of linksCategorias){
      console.log("               -> ["+i+"]"+" CATEGORIA DE "+"["+linksCategorias.length+"]");
      i++;
      try{
        // Navega a la página principal
        await page.goto(link);

        //Eperamos 10S antes de iniciar----------------------------------
        let tiempoDeEsperaInicio = 10000;
        await page.evaluate(async (waitTime) => {
        // Utiliza la función setTimeout para esperar el tiempo especificado
        await new Promise(resolve => setTimeout(resolve, waitTime));
        }, tiempoDeEsperaInicio);
        //---------------------------------------------------------------
        
        await loadMoreProducts(page,browser,rows);//CARGAMOS TODOS LOS PRODUCTOS DE LA PAGINA
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

async function loadMoreProducts(page, browser, rows) {
    //await page.waitForSelector('div.hiperlibertad-category-page-custom-1-x-customBanner--container');
    await page.waitForTimeout(2000);
    
    //Selecionamos el largo del sitio
    const bodyHandle = await page.$('body');
    const { height } = await bodyHandle.boundingBox();
    await bodyHandle.dispose();
    // Definir la velocidad de scroll y el número de pasos
    const scrollSpeed = 20;
    const numSteps = height / scrollSpeed;

    //Debemos seleccionar el boton de ver mas productos para saber si hay que cargar mas productos...
    const isOnePage = await page.$('div.vtex-search-result-3-x-buttonShowMore button div');
    //console.log("EL BOTON ES "+isOnePage.innerText);
    if (isOnePage!=undefined) {
        //console.log("HAY BOTON");
        await page.click('div.vtex-search-result-3-x-buttonShowMore button');
        await page.waitForTimeout(5000);
        await loadMoreProducts(page, browser, rows);
    } else {
            //YA COMPLETO DE DESPLEGAR TODA LA CATEGORIA
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
            const linksProductos = await page.evaluate(() => {
                const links = document.querySelectorAll('#gallery-layout-container div.vtex-search-result-3-x-galleryItem section a.vtex-product-summary-2-x-clearLink');
                let enlaces = [];
                for (let producto of links) {
                    enlaces.push(producto.href);
                }
                return enlaces;
            });

            await openProducts(linksProductos, browser, rows);
      }
}




async function openProducts(productos,browser,rows) {
  // Recorre los enlaces y obtén datos de cada página
  console.log(chalk.red("                   OBTENIENDO DATOS..."));
  for (const enlace of productos) {
    // Abre una nueva página para cada enlace
    const nuevaPagina = await browser.newPage();

    try {
      // Navega a la página correspondiente
      await nuevaPagina.goto(enlace);
      await nuevaPagina.waitForSelector('h1.vtex-store-components-3-x-productNameContainer');
      await nuevaPagina.waitForTimeout(5000);

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
        await nuevaPagina.waitForTimeout(20); 
      }
        // Realiza acciones para obtener datos de la página, por ejemplo:
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
        const eanElement =document.querySelector('script[data-flix-ean]');
        const eanNumber = eanElement?eanElement.getAttribute('data-flix-ean'):"";
        const descripcion = document.querySelector('h1.vtex-store-components-3-x-productNameContainer span')?.innerText;
        const priceProducto = document.querySelector('span.vtex-product-price-1-x-sellingPriceValue')?.innerText;
        console.log(priceProducto);
        const precioAntiguo = document.querySelector('span.vtex-product-price-1-x-listPriceValue')?.innerText;
        console.log(precioAntiguo);
        let promoEj2X1;
        let promoSegundoAlPorcentaje;
        let promoMenosPorcentaje;
        //LUEGO ANALIZARE LA PROMO QUE TRAE PARA DETERMINAR QUE ES
        const promo = document.querySelector('div.hiperlibertad-custom-highlight-flags-0-x-productTextFlagsWrapper div:last-child')?.innerText;
        console.log(promo);

        if(promo){
          if(promo.includes("x")){
            promoEj2X1 = promo;
          }else if(promo.includes("AL")){
            promoSegundoAlPorcentaje = promo;
          }else{
            promoMenosPorcentaje = promo;
        }}
        
        //CADENA
        arrayProductos.push("Libertad");
        //SUCURSAL
        arrayProductos.push("Lugones");
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
        arrayProductos.push(eanNumber?eanNumber:"");
        //PRECIO REGULAR
        arrayProductos.push(precioAntiguo==null || precioAntiguo==undefined?priceProducto:precioAntiguo);
        //PRECIO PROMOCIONAL
        arrayProductos.push(promo);       
        //PRECIO UNITARIO PROMOCIONAL
        arrayProductos.push("");
        //PRECIO OFERTA
        arrayProductos.push(precioAntiguo!=null || precioAntiguo!=undefined?priceProducto:"");
        //PRECIO POR UNIDAD DE MEDIDA
        arrayProductos.push("");
        //UNIDAD DE MEDIDA
        arrayProductos.push("");
        //PRECIO ANTIGUO
        arrayProductos.push("");
        return arrayProductos;  
      });

      // Imprime los resultados
      //console.log("Categoria: "+resultado.categoriaProducto+" | "+resultado.descripcion+" | "+resultado.eanElement+" | "+resultado.priceProducto);
      rows.push(resultado?resultado:"ERROR");
      
      //console.log(rows);
    } catch (error) {
      console.error('Error during scraping individual page:', error);
    } finally {
      // Cierra la página actual
      await nuevaPagina.close();
    }
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
  const fileName= 'Libertad_Lugones'+fechaConSeparador+'.xlsx';
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
  //const filePath = 'C:/Users/Administrator/Desktop/WEB_SCRAPING/ARCHIVOS/LIBERTAD/' + fileName; // WINDOWS

  try {
    await workbook.xlsx.writeFile(filePath);
    console.log(`Archivo Excel creado en: ${filePath}`);
  } catch (error) {
    console.log("ERROR AL GUARDAR EL ARCHIVO EXCEL", error);
  }
}

// Llama a la función principal
scrapeData();
