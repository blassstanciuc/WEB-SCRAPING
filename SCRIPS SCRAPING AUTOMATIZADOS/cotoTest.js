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
  const arrayProductos = [];
  const linksCategorias = [
    'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-almac%C3%A9n-golosinas-alfajores/_/N-1njwjm5Z1arqwxi;jsessionid=LNe2_uC1xu4Dk_M24P8vC_oFYSTt06ylaSCAW8E85AF6y5QLVrlN!-1125113230!1267993131?Nf=product.endDate%7CGTEQ+1.703808E12%7C%7Cproduct.startDate%7CLTEQ+1.703808E12&Nr=AND%28product.sDisp_200%3A1004%2Cproduct.language%3Aespa%C3%B1ol%2COR%28product.siteId%3ACotoDigital%29%29',
    'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-bebidas-bebidas-con-alcohol-vinos-jerez/_/N-1f33kcy?Nf=product.endDate%7CGTEQ+1.7037216E12%7C%7Cproduct.startDate%7CLTEQ+1.7037216E12&Nr=AND%28product.sDisp_200%3A1004%2Cproduct.language%3Aespa%C3%B1ol%2COR%28product.siteId%3ACotoDigital%29%29'
  ]
  const rows = [];
  try {
    for(let link of linksCategorias){
      i++;
      console.log("["+i+"]"+" CATEGORIA DE "+"["+linksCategorias.length+"]");
      try{
        // Navega a la página principal
        await page.goto(link);
      
        // OBTENGO LOS ENLACES DE LOS PRODUCTOS DE LA PAGINA PRINCIPAL
        const linksProductos = await page.evaluate(() => {
            const links = document.querySelectorAll('#products li div.product_info_container a');
            let enlaces = [];
            for(let producto of links){
                enlaces.push(producto.href);
            }
            
            return enlaces;
        });
        //Obtengo true si es una One page, esto quiere decir que no puedo recorrela, por lo tanto el programa muere ahi.
        const isOnePage = await page.evaluate(() => {
            let elemento = document.querySelector('#atg_store_pagination');
                if (elemento != null || elemento != undefined){
                  return elemento = false;
                } else {
                    return elemento = true;
                }
        })

        await openProducts(linksProductos,browser,arrayProductos,rows);
        if (isOnePage === false){
            await openNextPage(page,browser,arrayProductos,rows,i)
            //await createExcel(rows);
            console.log("CATEGORIA FINALIZADA");
        }else{
            //await createExcel(rows);
            //console.log("HAY SOLO UNA PAGINA PARA SCRAPEAR");
            //console.log("FIN");
            console.log("CATEGORIA FINALIZADA");
        }
      }
      catch(error){
        console.error('ERROR AL ABRIR LA CATEGORIA '+"["+i+"]");
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

async function openProducts(productos,browser,arrayProductos,rows) {

  // Recorre los enlaces y obtén datos de cada página
  for (const enlace of productos) {
    // Abre una nueva página para cada enlace
    const nuevaPagina = await browser.newPage();

    try {
      // Navega a la página correspondiente
      await nuevaPagina.goto(enlace);
      await nuevaPagina.waitForSelector('h1.product_page');
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
        const categoriaProducto = document.querySelector('#atg_store_breadcrumbs a:last-child')?.innerText;
        const marcaProducto = document.querySelector('#tab1 table.tblData td:last-child span.texto')?.innerText;
        const eanElement =document.querySelector('#brandText span.span_codigoplu:last-child')?.innerText;
        const descripcion = document.querySelector('h1.product_page')?.innerText;
        const priceProducto = document.querySelector('span.atg_store_newPrice')?.innerText.trim();
        const precioPromocional = document.querySelector('#productInfoContainer div.product_discount_container div.image_discount_container span.text_price_discount')?.innerText.split('D');
        let precioUnitarioPromocional = document.querySelector('#productInfoContainer div.product_discount div.first_price_discount_container span.price_discount')?.innerText;
        const unidad = document.querySelector('#productInfoContainer #atg_store_productMoreInfo span.unit')?.innerText.split(" ");
        
        //CADENA
        arrayProductos.push("Coto");
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
        arrayProductos.push(precioPromocional?precioPromocional[0]:"");
        //PRECIO UNITARIO PROMOCIONAL
        if(precioPromocional && !precioUnitarioPromocional){
          precioUnitarioPromocional = document.querySelector('#productInfoContainer div.product_discount div.first_price_discount_container span.price_discount_gde')?.innerText;
        }
        arrayProductos.push(precioUnitarioPromocional?precioUnitarioPromocional:"");
        //PRECIO OFERTA
        arrayProductos.push("");
        //PRECIO POR UNIDAD DE MEDIDA
        arrayProductos.push(unidad?unidad[5]:"");
        //UNIDAD DE MEDIDA
        arrayProductos.push(unidad?unidad[3]:"");
        //PRECIO ANTIGUO
        arrayProductos.push("");
        return arrayProductos;  
        // return{
        //   categoriaProducto,
        //   eanElement,
        //   descripcion,
        //   priceProducto
        // }
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

async function getNextPage(actualPage,){
    const nextPage = await actualPage.$eval('div.atg_store_pagination ul li.active',(btnActual) => {
        const btnNext = btnActual.nextElementSibling;
        const enlaceBtnNext = btnNext.querySelector('a');
        if (enlaceBtnNext) {
            return {
              href: enlaceBtnNext.href,
              contenido: btnNext.querySelector('a')===null?"no hay mas":btnNext.innerText
            };
          } else {
            return null;
          }
    });

   return nextPage;
}

async function openNextPage(page,browser,arrayProductos,rows){
    const nextPagina = await getNextPage(page);
    
    //const pagina = await browser.newPage();
    try{
        if(nextPagina !== null){
            await page.goto(nextPagina.href);
            console.log("----------------------------------------");
            console.log("PAGINA "+nextPagina.contenido)
            console.log("----------------------------------------");
            const nuevosProductos = await page.evaluate(() => {
                const links = document.querySelectorAll('#products li div.product_info_container a');
                let enlaces = [];
                for(let producto of links){
                    enlaces.push(producto.href);
                }
                return enlaces;
            });
            await openProducts(nuevosProductos,browser,arrayProductos,rows);
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

async function createExcel(rows) {
  const fechaActual = new Date();
  // Obtener el día, el mes y el año de la fecha actual
  const dia = fechaActual.getDate().toString().padStart(2, '0');
  const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // Nota: getMonth() devuelve un valor entre 0 y 11, sumamos 1 para obtener el mes real
  const año = fechaActual.getFullYear();
  // Crear una cadena de texto en formato "dd/mm/yyyy"
  const fechaConSeparador = dia + '_' + mes + '_' + año;
  const workbook = new ExcelJS.Workbook();
  const fileName= 'Coto_'+fechaConSeparador+'.xlsx';
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


  try {
    await workbook.xlsx.writeFile(filePath);
    console.log(`Archivo Excel creado en: ${filePath}`);
  } catch (error) {
    console.log("ERROR AL GUARDAR EL ARCHIVO EXCEL", error);
  }
}

// Llama a la función principal
scrapeData();