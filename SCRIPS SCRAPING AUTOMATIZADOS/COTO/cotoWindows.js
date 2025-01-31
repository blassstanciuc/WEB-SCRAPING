//IMPORTAMOS LIBRERIAS
import puppeteer from 'puppeteer';
import ExcelJS from 'exceljs';


async function scrapeData() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--start-fullscreen', '--no-sandbox', '--disable-setuid-sandbox'],
  }); //GENERAMOS UNA NUEVA INSTANCIA DE BUSCADOR
  const page = await browser.newPage(); //GENERAMOS UNA VENTANA
  let i =0;
  const arrayProductos = [];
  const rows = [];
  //LINKS DE LAS CATEGORIAS QUE VISITAREMOS
  const linksCategorias = [ 
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-almac%C3%A9n-golosinas-alfajores/_/N-1njwjm5',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-almac%C3%A9n-golosinas-chocolates/_/N-uiml5b',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-almac%C3%A9n-golosinas-caramelos-y-chupetines/_/N-1xkf1n',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-almac%C3%A9n-golosinas-chicles-y-pastillas/_/N-axoedr',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-almac%C3%A9n-panaderia-galletitas/_/N-10z239c',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-almac%C3%A9n-panaderia-panificados/_/N-1sv7ob1',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-almac%C3%A9n-panaderia-galletas-tostadas-y-grisines/_/N-39hspl',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-almac%C3%A9n-snacks/_/N-10kzbyj',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-almac%C3%A9n-cereales/_/N-ukd5id',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-almac%C3%A9n-endulzantes-az%C3%BAcar/_/N-1w1x9xa',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-almac%C3%A9n-infusiones-caf%C3%A9/_/N-1cgicr5',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-almac%C3%A9n-infusiones-mate/_/N-vra9dh',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-almac%C3%A9n-infusiones-mate-cocido/_/N-12sv9y0',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-almac%C3%A9n-infusiones-t%C3%A9/_/N-vtu7ep',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-almac%C3%A9n-aceites-y-condimentos-aceites/_/N-16r0nc0',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-almac%C3%A9n-arroz-y-legumbres-arroz/_/N-149fj7g',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-almac%C3%A9n-polvo-para-postres-y-reposteria/_/N-a6cxruhttps://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-almac%C3%A9n-navidad/_/N-1glv01j',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-frescos-l%C3%A1cteos-yogures/_/N-rfedtp',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-limpieza-papeles-papel-higi%C3%A9nico/_/N-q3aft3',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-perfumer%C3%ADa-higiene-personal-jabones/_/N-1avz0x',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-bebidas-bebidas-con-alcohol-cerveza/_/N-137sk0z',
    // 'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-bebidas-bebidas-sin-alcohol-gaseosas/_/N-n4l4r5',
     'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-bebidas-bebidas-sin-alcohol-aguas-aguas-saborizadas/_/N-rtdaup?Nf=product.startDate%7CLTEQ+1.7037216E12%7C%7Cproduct.endDate%7CGTEQ+1.7037216E12&Nr=AND%28product.sDisp_200%3A1004%2Cproduct.language%3Aespa%C3%B1ol%2COR%28product.siteId%3ACotoDigital%29%29',
    'https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-bebidas-bebidas-sin-alcohol-jugos-jugos-en-polvo/_/N-xwrj6e?Nf=product.startDate%7CLTEQ+1.7037216E12%7C%7Cproduct.endDate%7CGTEQ+1.7037216E12&Nr=AND%28product.sDisp_200%3A1004%2Cproduct.language%3Aespa%C3%B1ol%2COR%28product.siteId%3ACotoDigital%29%29'
  ]
  
  try {
    for(let link of linksCategorias){
      console.log("["+i+"]"+" CATEGORIA DE "+"["+linksCategorias.length+"]");
      i++;
      try{
        // NAVEGA AL ENLACE INDICADO
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

        //CONSULTO SI LA PAGINA A SCRAPEAR ES UNA UNICA PAGINA, ESTO ME DARA LA PAUTA SI HAY QUE RECORRERALA O NO.
        const isOnePage = await page.evaluate(() => {
            let elemento = document.querySelector('#atg_store_pagination');
                if (elemento != null || elemento != undefined){
                  return elemento = false;
                } else {
                    return elemento = true;
                }
        })

        await openProducts(linksProductos,browser,arrayProductos,rows);//OBTENGO LOS PRODUCTOS DE LA PAGINA INICIAL

        //SI NO ES UNA PAGINA UNICA, ABRO LA SIGUIENTE PAGINA 
        if (isOnePage === false){
            await openNextPage(page,browser,arrayProductos,rows,i)
            console.log("CATEGORIA FINALIZADA");
        }else{
            console.log("CATEGORIA FINALIZADA");
        }
      }
      catch(error){
        console.error('ERROR AL ABRIR LA CATEGORIA '+"["+i+"]",error);
      }
    }  
  } catch (error) {
    console.error('Error during scraping:', error);
  } finally {
    console.log("["+i+"]"+" CATEGORIA DE "+"["+linksCategorias.length+"]");
    console.log("FIN DEL SCRAPEO by BLAS");
    await createExcel(rows);//EXTRAIGO EL ARCHIVO EXCEL
    await browser.close();// CIERRO LA VENTANA DEL NAVEGADOR
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
      await nuevaPagina.waitForSelector('h1.product_page');//se detiene hasta encontrar el selector
      // Con evaluate me permite interactuar con la web y aplicar js
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
        
        //OBTENGO LOS DATOS
        const categoriaProducto = document.querySelector('#atg_store_breadcrumbs a:last-child')?.innerText;
        const marcaProducto = document.querySelector('#tab1 table.tblData td:last-child span.texto')?.innerText;
        const eanElement = document.querySelector('span.span_codigoplu')?.innerText;
        const descripcion = document.querySelector('h1.product_page')?.innerText;
        const priceProducto = document.querySelector('span.atg_store_newPrice')?.innerText.trim();
        const precioPromocional = document.querySelector('#productInfoContainer div.product_discount_container div.image_discount_container span.text_price_discount')?.innerText.split('D');
        let precioUnitarioPromocional = document.querySelector('#productInfoContainer div.product_discount div.first_price_discount_container span.price_discount')?.innerText;
        const unidad = document.querySelector('#productInfoContainer #atg_store_productMoreInfo span.unit')?.innerText.split(" ");
        
        //AGREGO LOS DATOS A UN ARRAY
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
      });
      rows.push(resultado?resultado:"ERROR");
    } catch (error) {
      console.error('Error during scraping individual page:', error);
    } finally {
      // Cierra la página actual
      await nuevaPagina.close();
    }
  }
}

//Obtengo el enlace de la siguiente pagina para recorrer
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

//Abro la pagina sieguiente 
async function openNextPage(page,browser,arrayProductos,rows){
    const nextPagina = await getNextPage(page); //Consulto si hay una pagina siguiente
    try{
        if(nextPagina !== null){ //Mientras que haya una siguiente pagina 
            await page.goto(nextPagina.href);
            console.log("----------------------------------------");
            console.log("PAGINA "+nextPagina.contenido)
            console.log("----------------------------------------");
            const nuevosProductos = await page.evaluate(() => { //Obtenermos los enlaces individuales de los productos
                const links = document.querySelectorAll('#products li div.product_info_container a');
                let enlaces = [];
                for(let producto of links){
                    enlaces.push(producto.href);
                }
                return enlaces;
            });
            await openProducts(nuevosProductos,browser,arrayProductos,rows); //Obtenemos la info de los productos
            await openNextPage(page,browser,arrayProductos,rows)//VOLVEMOS A ejecutar, para que consulte con getNextPage, si hay mas paginas
        }else{ 
            console.log('FIN DE LAS PAGINAS');
            await browser.close();
        }
    }catch(error){
        console.log("ERROR AL ABRIR LA SIGUIENTE PAGINA "+error);
        await browser.close();
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
  //const filePath = 'C:/Users/Blas/Desktop/' + fileName; // COLOCAMOS LA RUTA DONDE SE GUARDARA
  const filePath = '/home/blas/Descargas/' + fileName; // LINUX


  try {
    await workbook.xlsx.writeFile(filePath);
    console.log(`Archivo Excel creado en: ${filePath}`);
  } catch (error) {
    console.log("ERROR AL GUARDAR EL ARCHIVO EXCEL", error);
  }
}

// Llama a la función principal
scrapeData();
