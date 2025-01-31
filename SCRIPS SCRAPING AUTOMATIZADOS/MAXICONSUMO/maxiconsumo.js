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
  let i =0;
  let x =1;
  const linksCategorias = [
    "https://maxiconsumo.com/sucursal_campana/almacen/aceites-y-vinagres/aceites.html",
    "https://maxiconsumo.com/sucursal_campana/almacen/arroz.html",
    "https://maxiconsumo.com/sucursal_campana/almacen/cereales.html",
    "https://maxiconsumo.com/sucursal_campana/almacen/endulzantes/azucar.html",
    "https://maxiconsumo.com/sucursal_campana/almacen/fiestas.html",
    "https://maxiconsumo.com/sucursal_campana/almacen/galletitas.html",
    "https://maxiconsumo.com/sucursal_campana/almacen/golosinas.html",
    "https://maxiconsumo.com/sucursal_campana/almacen/infusiones.html",
    "https://maxiconsumo.com/sucursal_campana/almacen/panificados/pan.html",
    "https://maxiconsumo.com/sucursal_campana/almacen/pastas-secas/fideos.html",
    "https://maxiconsumo.com/sucursal_campana/almacen/polvo-para-postres-y-reposteria.html",
    "https://maxiconsumo.com/sucursal_campana/almacen/snack.html",
    "https://maxiconsumo.com/sucursal_campana/bebidas/aguas/aguas-saborizadas.html",
    "https://maxiconsumo.com/sucursal_campana/bebidas/cervezas.html",
    "https://maxiconsumo.com/sucursal_campana/bebidas/gaseosas.html",
    "https://maxiconsumo.com/sucursal_campana/bebidas/jugos/jugos-en-polvo.html",
    "https://maxiconsumo.com/sucursal_campana/frescos/lacteos.html",
    "https://maxiconsumo.com/sucursal_campana/limpieza/cocina/detergentes-y-lavavajillas.html",
    "https://maxiconsumo.com/sucursal_campana/limpieza/cocina/detergentes-y-lavavajillas-concentrados.html",
    "https://maxiconsumo.com/sucursal_campana/limpieza/ba-o/papel-higienico.html",
    "https://maxiconsumo.com/sucursal_campana/limpieza/cocina/rollos-de-cocina.html",
    "https://maxiconsumo.com/sucursal_campana/perfumeria/cuidado-para-el-cabello/shampoo-y-acondicionadores-familiares.html",
    "https://maxiconsumo.com/sucursal_campana/perfumeria/cuidado-para-el-cabello/shampoo-y-acondicionadores-personales.html",
    "https://maxiconsumo.com/sucursal_campana/perfumeria/desodorantes-personales.html",
    "https://maxiconsumo.com/sucursal_campana/bebidas/aperitivos/fernet.html",
    "https://maxiconsumo.com/sucursal_campana/almacen/aderezos-y-condimentos/mayonesas.html",
    "https://maxiconsumo.com/sucursal_campana/almacen/pure-de-papas.html",
    "https://maxiconsumo.com/sucursal_campana/perfumeria/bebes/pa-ales-para-bebe.html",
    "https://maxiconsumo.com/sucursal_campana/limpieza/ropa/jabones-liquidos.html"


    //prueba
    // "https://maxiconsumo.com/sucursal_capital/almacen/cereales/aros.html"
    ]
  const rows = [];
  const internalPages = [];

  try {
    console.log(" ");
    console.log(chalk.green.underline('                         [SUCURSAL MAS ONLINE]                         '));
    console.log(" ");
    console.log("               TOTAL DE CATEGORIAS A ESCRAPEAR "+"["+linksCategorias.length+"]");
    for(let link of linksCategorias){
      i++;
      console.log("               -> ["+i+"]"+" CATEGORIA DE "+"["+linksCategorias.length+"]");

      try{
            // Navega a la página principal
            await page.goto(link);            
            await page.waitForSelector('#catalog-listing');
            
            let tiempoDeEsperaEnMilisegundos = 15000;

            await page.evaluate(async (waitTime) => {
              // Utiliza la función setTimeout para esperar el tiempo especificado
              await new Promise(resolve => setTimeout(resolve, waitTime));
            }, tiempoDeEsperaEnMilisegundos);

            await page.waitForSelector('#catalog-listing');
            const linkMarcas = await getMarcas(page);
            for(let linkMarca of linkMarcas){
              console.log("LINKMARCA NOMBRE: "+linkMarca.nombre);
              const brandName = linkMarca.nombre;
              console.log("LINKMARCA: "+linkMarca.link);
              await page.goto(linkMarca.link);
              await loadMoreProducts(page,rows,x,link,brandName);//CARGAMOS TODOS LOS PRODUCTOS DE LA PAGINA
            }
            
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
    if(intentos <= 5){
        page.reload();
        scrapeData();
    }
  } finally {
    // Cierra el navegador al finalizar
    console.log(chalk.red("FIN DEL SCRAPEO by BLAS :)"));
    await createExcel(rows);
    await browser.close();
  }
}

async function getProducts(productos,page,rows,marcasProductos) {
  // Recorre los enlaces y obtén datos de cada página
  console.log(chalk.red("                   OBTENIENDO DATOS..."));
  const brandName = marcasProductos;
    try {
      const allProductos = productos;

      for (const producto of allProductos) {  

          const resultado = await page.evaluate((Productos,brandName) => {
            console.log(" MARCA QUE ME LLEGA: "+brandName);
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
            const categoriaProducto = document.querySelector('div.breadcrumbs ul.items li:last-child')?.innerText;
           
            
            //const marcaProducto = tempDiv.querySelector('div.vtex-product-summary-2-x-productBrandContainer span.vtex-product-summary-2-x-productBrandName')?.innerText;
            

            const eanElement ="";

            const descripcion = tempDiv.querySelector('h2.product-name')?.innerText;   
            const precioProducto = tempDiv.querySelector('div.product-item-details div:nth-child(3) span span span:nth-child(2)')?.innerText;       
            const precioProductoMayotista = tempDiv.querySelector('div.product-item-details div:nth-child(2) span span span:nth-child(2) span')?.innerText;       
                    

            //CADENA
            arrayProductos.push("Maxiconsumo");
            //SUCURSAL
            arrayProductos.push("");
            //FECHA
            arrayProductos.push(fechaConSeparador?fechaConSeparador:"");
            //CATEGORIA
            arrayProductos.push(categoriaProducto?categoriaProducto:"");
            //SUBCATEGORIA
            arrayProductos.push("");
            //MARCA
            arrayProductos.push(brandName);
            //DESCRIPCION
            arrayProductos.push(descripcion?descripcion.trim():"");
            //EAN
            arrayProductos.push("");
            //PRECIO REGULAR
            arrayProductos.push(precioProducto)
            //PRECIO PROMOCIONAL
            arrayProductos.push("");
            //PRECIO UNITARIO PROMOCIONAL
            arrayProductos.push("");
            //PRECIO OFERTA
            arrayProductos.push("");
            //PRECIO POR UNIDAD DE MEDIDA
            arrayProductos.push("");
            //UNIDAD DE MEDIDA
            arrayProductos.push("");	
            //PRECIO ANTIGUO
            arrayProductos.push("");
            //PRECIO MAYORISTA
            arrayProductos.push(precioProductoMayotista?precioProductoMayotista.trim():"");
            return arrayProductos;  
            
          },producto,brandName);
        
      // Imprime los resultados
      rows.push(resultado?resultado:"ERROR");
      }
    } catch (error) {
      console.error('Error during scraping individual page:', error);
    } finally {   
    }
  }

async function loadMoreProducts(page,rows,x,link,brandName) {
    await page.waitForTimeout(5000);
    //await page.waitForSelector('#paging-label');
    const bodyHandle = await page.$('body');
    const { height } = await bodyHandle.boundingBox();
    await bodyHandle.dispose();
    // Definir la velocidad de scroll y el número de pasos
    const scrollSpeed = 10;
    const numSteps = height / scrollSpeed;
    //await page.waitForSelector('#catalog-listing');
    
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
        const links = document.querySelectorAll('ol.product-items ul.list li.list-item');
        //console.log(links);
        let productos = [];
        for (let producto of links) {
          productos.push(producto.innerHTML);
        }
        return productos;
    });
    
    
    await getProducts(Productos,page,rows,brandName);
    const btnSiguiente = await page.evaluate(() => {
        const btnActual = document.querySelector('div.pages ul.pages-items li.current');
        
        if (btnActual) {
            const btnNext = btnActual.nextElementSibling;
            if (btnNext) {
                return {
                  selector: 'div.pages ul.pages-items li.current + li'||null, //SELECCIONAMOS EL SIGUIENTE LI (el siguiente boton)
                };
            } else {
                return null;
            }
        } else {
            return null;
        }
    });
      if (btnSiguiente!=null) {
          // Ir a la sigueinte pagina
          await page.click(btnSiguiente.selector);      
          await page.waitForTimeout(10000);//Espera
          await loadMoreProducts(page,rows,x,link,brandName);
      }
  }

async function getMarcas(page){
  await page.waitForTimeout(5000);
  const bodyHandle = await page.$('body');
  const { height } = await bodyHandle.boundingBox();
  await bodyHandle.dispose();
  // Definir la velocidad de scroll y el número de pasos
  const scrollSpeed = 10;
  const numSteps = height / scrollSpeed;
  //HAGO SCROLL DESDE ARRIBA PARA BAJO
  for (let i = 0; i < numSteps; i++) {
    await page.evaluate((scrollSpeed) => {
      window.scrollBy(0, scrollSpeed);
    }, scrollSpeed);
    await page.waitForTimeout(20); 
  }

  const marcasProductos = await page.evaluate(() => {
    const dl = document.querySelectorAll('dl.filter-options dt');
    const dtArray = Array.from(dl);
    if (dtArray) {
      // Busca el <dt> que contiene el texto "MARCA"
      const dtMarca = dtArray.find((elemento)=>{
        return elemento.innerText.trim() === 'MARCA'
      });
  
      // Si se encontró el <dt>, selecciona el siguiente <dd> y los elementos <li> dentro de él
      if (dtMarca) {
        const ddMarca = dtMarca.nextElementSibling;
        const marcas = Array.from(ddMarca.querySelectorAll('ol li'));
        let brand = [];
  
        for (let b of marcas) {
          let bLinks = b.querySelector("a");
          brand.push({
            nombre: b.innerText,
            link: bLinks ? bLinks.href : ""
          });
        }
  
        return brand;
      }
    }
  
    // Si no se encontró el <dl> o el <dt>, devuelve un array vacío o un valor predeterminado
    return [];
  });
  
  return marcasProductos;
  
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
  const fileName= 'MAXICONSUMO_'+fechaConSeparador+'.xlsx';
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
    {header: 'Precio Antiguo'},
    {header: 'Precio Mayorista'}

  ]
  worksheet.columns = Columnas;
  for(let row of rows){
    worksheet.addRow(row);
  }
  const filePath = 'C:/Users/blass/OneDrive/Desktop/' + fileName; // WINDOWS
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