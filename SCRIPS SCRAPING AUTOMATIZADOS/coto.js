import puppeteer from 'puppeteer';
async function scrapeData() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--start-fullscreen', '--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  const arrayProductos = [];
  const rows = [['Cadena','Sucursal','Fecha Scraping','Categoria','Subcategoria','Marca Cadena','Descripcion Cadena','EAN','Precio Regular','Precio Promocional','Precio Unitario Promocional','Precio Oferta','Precio Por Unidad de Medida','Unidad de Medida','Precio Antiguo']];

  try {
    // Navega a la página principal
    await page.goto('https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-almac%C3%A9n-golosinas-alfajores/_/N-1njwjm5');


    // OBTENGO LOS ENLACES DE LOS PRODUCTOS
    const linksProductos = await page.$$eval('#products li div.product_info_container a', (productos) => {
      return productos.map(producto => producto.href);
    });
    
    console.log(linksProductos.length);
    
    for (let link of linksProductos) {
      await page.goto(link);
      //await page.waitFor(3000);
    }
    
    //await openProducts(linksProductos, browser);
  } catch (error) {
    console.error('Error during scraping:', error);
  } finally {
    // Cierra el navegador al finalizar
    await browser.close();
  }
}

async function openProducts(productos, browser) {
  // Recorre los enlaces y obtén datos de cada página
  for (const enlace of productos) {
    // Abre una nueva página para cada enlace
    const nuevaPagina = await browser.newPage();

    try {
      // Navega a la página correspondiente
      await nuevaPagina.goto(enlace);

      // Realiza acciones para obtener datos de la página, por ejemplo:
      const resultado = await nuevaPagina.evaluate(() => {
        const eanElement = document.querySelector('span.span_codigoplu');
        return eanElement ? eanElement.innerText : null;
      });

      // Imprime los resultados
      console.log(resultado);
    } catch (error) {
      console.error('Error during scraping individual page:', error);
    } finally {
      // Cierra la página actual
      await nuevaPagina.close();
    }
  }
}

// Llama a la función principal
scrapeData();
