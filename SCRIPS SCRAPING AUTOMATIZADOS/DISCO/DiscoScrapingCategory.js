//process.env.PUPPETEER_EXECUTABLE_PATH = path.join(__dirname, '.local-chromium', 'chrome-linux', 'chrome');
import puppeteer from 'puppeteer';
import ExcelJS from 'exceljs';

import  writeFileSync from 'fs';
import  saveAs  from 'file-saver';

async function scrapeData() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--start-fullscreen', '--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  let i =0;
  const linksCategorias = [
  'https://www.disco.com.ar/Almacen/Desayuno-y-Merienda?initialMap=c,c&initialQuery=almacen/desayuno-y-merienda&map=category-1,category-2,category-3,category-3,category-3,category-3,category-3,category-3,category-3,category-3&query=/almacen/desayuno-y-merienda/azucar-y-edulcorantes/bizcochuelos-budines-y-magdalenas/cafes/cereales/galletitas-dulces/galletitas-saladas/tes/yerbas&searchState',
  'https://www.disco.com.ar/Almacen/Golosinas-y-Chocolates',
  'https://www.disco.com.ar/Almacen/Para-Preparar',
  'https://www.disco.com.ar/Almacen/Pastas-Secas-y-Salsas?initialMap=c,c&initialQuery=almacen/pastas-secas-y-salsas&map=category-1,category-2,category-3,category-3,category-3&query=/almacen/pastas-secas-y-salsas/pastas-listas/pastas-secas-guiseras/pastas-secas-largas&searchState',
  'https://www.disco.com.ar/Almacen/Snacks',
  'https://www.disco.com.ar/Almacen/Panificados',
  'https://www.disco.com.ar/Almacen/Aceites-y-Vinagres?initialMap=c,c&initialQuery=almacen/aceites-y-vinagres&map=category-1,category-2,category-3,category-3&query=/almacen/aceites-y-vinagres/aceites-comunes/aceites-especiales&searchState',
  'https://www.disco.com.ar/Almacen/Arroz-y-Legumbres?initialMap=c,c&initialQuery=almacen/arroz-y-legumbres&map=category-1,category-2,category-3,category-3&query=/almacen/arroz-y-legumbres/arroz/arroz-listos&searchState',
  'https://www.disco.com.ar/Lacteos/Yogures',
  'https://www.disco.com.ar/perfumeria/cuidado-personal/jabones',
  'https://www.disco.com.ar/limpieza/papeles/papel-higienico',
  'https://www.disco.com.ar/Bebidas/Cervezas',
  'https://www.disco.com.ar/bebidas/aguas/aguas-saborizadas',
  'https://www.disco.com.ar/Bebidas/Gaseosas',
  'https://www.disco.com.ar/bebidas/jugos/en-polvo'
  ]
  const rows = [];
  try {
    for(let link of linksCategorias){
      i++;
      console.log("["+i+"]"+" CATEGORIA DE "+"["+linksCategorias.length+"]");
      try{
        // Navega a la página principal
        await page.goto(link);
        await page.waitForSelector('section.vtex-store-components-3-x-container');

        await loadMoreProducts(page,rows);//CARGAMOS TODOS LOS PRODUCTOS DE LA PAGINA
        console.log("CATEGORIA FINALIZADA");
      }
      catch(error){
        console.error('ERROR AL ABRIR LA CATEGORIA '+"["+i+"]",error);
      }
    }  
  } catch (error) {
    console.error('Error during scraping:', error);
  } finally {
    // Cierra el navegador al finalizar
    console.log("FIN DEL SCRAPEO by BLAS");
    await createExcel(rows);
    await browser.close();
  }
}

async function getProducts(productos,page,rows) {
  // Recorre los enlaces y obtén datos de cada página
    try {
      const allProductos = productos;
      for (const producto of allProductos) {  

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
            const categoriaProducto = tempDiv.querySelector('div.vtex-breadcrumb-1-x-container--breadcrumb-category span:last-child a:last-child')?.innerText;
            
            const marcaProducto = tempDiv.querySelector('div.vtex-product-summary-2-x-productBrandContainer span.vtex-product-summary-2-x-productBrandName')?.innerText;
            

            const eanElement ="";

            const descripcion = tempDiv.querySelector('h2 span.vtex-product-summary-2-x-brandName')?.innerText;

            const priceProducto = tempDiv.querySelector('div.contenedor-precio span')?.innerText;
            

            const precioPromocional = tempDiv.querySelector('div.discoargentina-store-theme-1Y4RyoZaLlekb0M0roiDY5 span.discoargentina-store-theme-1vId-Z5l1K6K82ho-1PHy6')?tempDiv.querySelector('div.discoargentina-store-theme-1Y4RyoZaLlekb0M0roiDY5 span.discoargentina-store-theme-1vId-Z5l1K6K82ho-1PHy6').innerText:tempDiv.querySelector('div.discoargentina-store-theme-1Y4RyoZaLlekb0M0roiDY5 span.discoargentina-store-theme-tha9pV36seWfdnuHGKz68')?.innerText;
            

            const precioOferta = tempDiv.querySelector('div.discoargentina-store-theme-1Y4RyoZaLlekb0M0roiDY5 span.discoargentina-store-theme-1fq_v5Ru2hmjMCzmx6XC_E')?.innerText;
            let precioUnitarioPromocional = tempDiv.querySelector('div.vtex-promotionDisclaimer p.vtex-promotionDisclaimerText')?.innerText.split(":");
            console.log(precioUnitarioPromocional)
            let unidad = tempDiv.querySelector('span.discoargentina-store-theme-2b7aTxwaRuuRkUnoQbwL9w')?.innerText.split(" ");
            let finUnidad = unidad.length;
            let unidadCompleta = unidad[finUnidad-1].split(":");
              
              //CADENA
              arrayProductos.push("Disco");
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
              arrayProductos.push(descripcion?descripcion:"");
              //EAN
              arrayProductos.push(eanElement?eanElement:"");
              //PRECIO REGULAR
              arrayProductos.push(priceProducto?priceProducto:"");
              //PRECIO PROMOCIONAL
              arrayProductos.push(precioPromocional?precioPromocional:"");
              //PRECIO UNITARIO PROMOCIONAL
              arrayProductos.push(precioUnitarioPromocional?precioUnitarioPromocional[1]:"");
              //PRECIO OFERTA
              arrayProductos.push(precioOferta);
              //PRECIO POR UNIDAD DE MEDIDA
              arrayProductos.push(unidadCompleta?unidadCompleta[1]:"");
              //UNIDAD DE MEDIDA
              arrayProductos.push(unidadCompleta?unidadCompleta[0]:"");
              //PRECIO ANTIGUO
              arrayProductos.push("");
              return arrayProductos;  
            
          },producto);
        
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

async function loadMoreProducts(page, rows) {
    await page.waitForSelector('div.vtex-rich-text-0-x-container--sucursal');
    await page.waitForTimeout(5000);
    const bodyHandle = await page.$('body');
    const { height } = await bodyHandle.boundingBox();
    await bodyHandle.dispose();
    // Definir la velocidad de scroll y el número de pasos
    const scrollSpeed = 10;
    const numSteps = height / scrollSpeed;

    const isOnePage = await page.evaluate(() => {
        let buttonMoreProducts = document.querySelector('section.vtex-store-components-3-x-container div.container p.text-content strong')?.innerText.split(" ");
        return buttonMoreProducts;
    });

    await page.waitForSelector('section.vtex-store-components-3-x-container div.container p.text-content strong');
    console.log(isOnePage[0]+" - "+isOnePage[2]);
    if (isOnePage[0]!=isOnePage[2]) {
        console.log("HAY BOTON");
        console.log(isOnePage[0]+" - "+isOnePage[2]);
        await page.waitForSelector('div.vtex-search-result-3-x-buttonShowMore');
        await page.click('section.vtex-store-components-3-x-container div.vtex-search-result-3-x-buttonShowMore button.vtex-button');
        await page.waitForTimeout(10000);
        await loadMoreProducts(page, rows);
    } else {
            //YA COMPLETO DE DESPLEGAR TODA LA CATEGORIA
            await page.evaluate(()=>{
              window.scrollTo(0,0);
            })
            console.log("NO HAY BOTON");

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

            const expectedElementCount = Number(isOnePage[0]);
            console.log("TIENEN QUE CARGAR "+expectedElementCount);
            //ESPERA A QUE SE CARGUEN LOS ENLACES DE LOS PRODUCTOS
            await page.waitForFunction((expectedCount) => {
                const elements = document.querySelectorAll('div.vtex-search-result-3-x-galleryItem section a.vtex-product-summary-2-x-clearLink');
                return elements.length <= expectedCount;
            }, { visible: true }, expectedElementCount);
            //OBTENGO TODOS LOS PRODUCTOS DE LA PAGINA
            const Productos = await page.evaluate(() => {
                const links = document.querySelectorAll('#gallery-layout-container div.vtex-search-result-3-x-galleryItem');
                //console.log(links);
                let productos = [];
                for (let producto of links) {
                  productos.push(producto.innerHTML);
                }
                return productos;
            });
            console.log("CANTIDAD DE PRODUCTOS QUE TOMA "+Productos.length);
            await getProducts(Productos,page,rows);
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
  const fileName= 'Disco_'+fechaConSeparador+'.xlsx';
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
  //const filePath = '/home/blas/Descargas/' + fileName; // WINDOWS

  try {
    await workbook.xlsx.writeFile(filePath);
    console.log(`Archivo Excel creado en: ${filePath}`);
  } catch (error) {
    console.log("ERROR AL GUARDAR EL ARCHIVO EXCEL", error);
  }
}

// Llama a la función principal
scrapeData();