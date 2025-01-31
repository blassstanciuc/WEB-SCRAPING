//Verificar que solo funciona el despliegue cuando el headlees esta en false
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
  await page.setDefaultTimeout(120000);
  let i =1;
  let selectorFound = false;
  let attempts = 0;
  const maxAttempts = 10;
  const linksCategorias = [
    // "https://maxi.carrefour.com.ar/online/category/cereales_y_barritas",
    // "https://maxi.carrefour.com.ar/online/category/infusiones",
    // "https://maxi.carrefour.com.ar/online/category/az%C3%BAcar_y_endulzantes",
    // "https://maxi.carrefour.com.ar/online/category/caf%C3%A9",
    // "https://maxi.carrefour.com.ar/online/category/yerba",
    // "https://maxi.carrefour.com.ar/online/category/panificados",
    // "https://maxi.carrefour.com.ar/online/category/reposter%C3%ADa_y_postres",
    // "https://maxi.carrefour.com.ar/online/category/pastas_secas",
    // "https://maxi.carrefour.com.ar/online/category/golosinas_y_chocolates",
    // "https://maxi.carrefour.com.ar/online/category/arroz_y_legumbres",
    // "https://maxi.carrefour.com.ar/online/category/snacks",
    // "https://maxi.carrefour.com.ar/online/category/papeles_higi%C3%A9nicos",
    // "https://maxi.carrefour.com.ar/online/category/jabones",
    // "https://maxi.carrefour.com.ar/online/category/cervezas",
    // "https://maxi.carrefour.com.ar/online/category/gaseosas",
    // "https://maxi.carrefour.com.ar/online/category/aguas",
    // "https://maxi.carrefour.com.ar/online/category/jugos",
        // "https://maxi.carrefour.com.ar/online/category/sal,_aderezos_y_saborizadores",
        // "https://maxi.carrefour.com.ar/online/category/pa%C3%B1ales",
        // "https://maxi.carrefour.com.ar/online/category/fernet_y_aperitivos",
        // "https://maxi.carrefour.com.ar/online/category/cuidado_del_cabello",
        // "https://maxi.carrefour.com.ar/online/category/limpieza_de_la_ropa",
        // "https://maxi.carrefour.com.ar/online/category/limpieza_de_cocina"
//         "https://www.carrefour.com.ar/Almacen/Sal-aderezos-y-saborizadores/Salsas-y-aderezos?initialMap=c,c,c&initialQuery=almacen/sal-aderezos-y-saborizadores/salsas-y-aderezos&map=category-1,category-2,category-3,brand,tipo-de-producto&query=/almacen/sal-aderezos-y-saborizadores/salsas-y-aderezos/hellmanns/aderezo&searchState",
// "https://www.carrefour.com.ar/Bebidas/Fernet-y-aperitivos/Fernet",
// "https://www.carrefour.com.ar/pure%20de%20tomate?_q=PURE%20DE%20TOMATE&fuzzy=0&initialMap=ft&initialQuery=pure%20de%20tomate&map=ft,tipo-de-producto&operator=and&query=/pure%20de%20tomate/pure-de-tomate&searchState",
// "https://www.carrefour.com.ar/Mundo-Bebe/Panales?initialMap=c,c&initialQuery=mundo-bebe/panales&map=category-1,category-2,brand,brand&query=/mundo-bebe/panales/babysec/pampers&searchState",
// "https://www.carrefour.com.ar/Limpieza/Limpieza-de-la-ropa?initialMap=c,c&initialQuery=limpieza/limpieza-de-la-ropa&map=category-1,category-2,brand,brand&query=/limpieza/limpieza-de-la-ropa/ariel/skip&searchState",
// "https://www.carrefour.com.ar/Limpieza/Limpieza-de-cocina?initialMap=c,c&initialQuery=limpieza/limpieza-de-cocina&map=category-1,category-2,brand,brand&query=/limpieza/limpieza-de-cocina/cif/magistral&searchState",
// "https://www.carrefour.com.ar/Perfumeria/Cuidado-del-cabello/Shampoos?initialMap=c,c,c&initialQuery=perfumeria/cuidado-del-cabello/shampoos&map=category-1,category-2,category-3,brand,brand&query=/perfumeria/cuidado-del-cabello/shampoos/pantene/sedal&searchState"


    //PRUEBA
    "https://maxi.carrefour.com.ar/online/category/gaseosas"
  ]
  const rows = [];
  try {
    console.log(" ");
    console.log(chalk.blue.underline('                         [MAXI CARREFOUR]                         '));
    console.log(" ");
    console.log("               TOTAL DE CATEGORIAS A ESCRAPEAR "+"["+linksCategorias.length+"]");
    for(let link of linksCategorias){
      console.log("               -> ["+i+"]"+" CATEGORIA DE "+"["+linksCategorias.length+"]");
      i++;
      try{
        // Navega a la página principal
        await page.goto(link);
        //await page.waitForNavigation();
        //Eperamos 10S antes de iniciar----------------------------------
        let tiempoDeEsperaInicio = 5000;
        await page.evaluate(async (waitTime) => {
        // Utiliza la función setTimeout para esperar el tiempo especificado
        await new Promise(resolve => setTimeout(resolve, waitTime));
        }, tiempoDeEsperaInicio);
        //---------------------------------------------------------------
        //MODULO DE RECARGA
        while (!selectorFound && attempts < maxAttempts) {
        try {
          selectorFound = false;
          console.log("INGRESE MANUALMENTE");
          // Espera hasta que aparezca el selector en la página
          await page.waitForFunction(() => {
            return document.querySelector('section.carousel_banner') !== null;
          }, { timeout: 60000 });
          // await page.waitForSelector('#result_container', { timeout: 60000 });
          console.log("ENCONTRADO");
          selectorFound = true; // Se encontró el selector
          
            } catch (error) {
            console.error('Selector no encontrado, recargando página...');
            attempts++;
            await page.reload();
        }
        }
        //EN ESTE LAPSO DE ESPERA EL USUARIO ENCARGADO DEL SCRAPEO TENDRA QUE INGRESAR AL USUARIO
        await page.evaluate(async (waitTime) => {
          // Utiliza la función setTimeout para esperar el tiempo especificado
          await new Promise(resolve => setTimeout(resolve, waitTime));
          }, 50000);

        if(i==2){
          console.log("IR A LA PAGINA");
          // await selectSucursal(page);
          await page.goto(link);
          //esperamos un tiempo
          await page.evaluate(async (waitTime) => {
          // Utiliza la función setTimeout para esperar el tiempo especificado
          await new Promise(resolve => setTimeout(resolve, waitTime));
          }, tiempoDeEsperaInicio);
          //MODULO DE RECARGA
          while (!selectorFound && attempts < maxAttempts) {
          try {
            selectorFound = false;
            // Espera hasta que aparezca el selector en la página
            await page.waitForSelector('section.main-section', { timeout: 2000 });
            selectorFound = true; // Se encontró el selector
            console.log("SELECTOR DE CATEGORIA ENCONTRADO");

              } catch (error) {
              console.error('Selector no encontrado, recargando página...');
              attempts++;
              await page.reload();
              await page.evaluate(() => {
              return new Promise(resolve => {
                setTimeout(resolve, 2000);
              });
            });
          }
          }
        }  
        
        await loadMoreProducts(page,browser,rows,link);//CARGAMOS TODOS LOS PRODUCTOS DE LA PAGINA
        selectorFound = false;
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

async function loadMoreProducts(page, browser, rows, link) {
  console.log("ENTRE A LA FUNCION DE LOADMORAPRODUCTS");
    //await page.waitForSelector('div.hiperlibertad-category-page-custom-1-x-customBanner--container');
    await page.waitForTimeout(5000);

    // let btnClosePopUp = await page.$("div.tooltip img.btn_access__img1");
    // while(btnClosePopUp){
    //   console.log("ENTRE AL CICLO");
    //   await selectSucursal(page);
    //   await page.goto(link);
    //   await page.waitForTimeout(5000);
    //   btnClosePopUp = await page.$("div.tooltip img.btn_access__img1");
    // }
    const cantidadDeProductosTotales = await page.evaluate(() => {
      const element = document.querySelector("#countProducts");
      return element ? element.innerText.split(" ") : null;
    });
  let productosADesplegar = await page.evaluate(() => {
    const element = document.querySelector("#page_show");
    return element ? element.innerText.split(" ") : null;
  });

    console.log("cantidad de productos" + cantidadDeProductosTotales[0]);
    //Selecionamos el largo del sitio
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
    await page.waitForTimeout(5000);
    //Debemos seleccionar el boton de ver mas productos para saber si hay que cargar mas productos...
    const btnMoreProducts = await page.$("#btn_getMore");

    //obtenemos el estado del display del elemento del boton
    if(btnMoreProducts){
      const displayStyle = await page.evaluate(elemento => {
        return window.getComputedStyle(elemento).display;
      },btnMoreProducts)

      if(displayStyle === 'none'){
        console.log("NO HAY BOTON");

        //scroll hasta el inicio de la web
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

        //OBTENGO TODOS LOS PRODUCTOS DE LA PAGINA
        const htmlProductos = await page.evaluate(() => {
          const itemsProductos = document.querySelectorAll('div.item_card');
          console.log(itemsProductos);
          let itemsProducts = [];
          for (let itemProducto of itemsProductos) {
            itemsProducts.push(itemProducto.innerHTML);
          }
          return itemsProducts;
          });
          console.log("["+htmlProductos.length+"]"+" PRODUCTOS");
          if(htmlProductos.length == cantidadDeProductosTotales[0] ){
            console.log("SE OBTUVIERON TODOS LOS PRODUCTOS DE LA PAGINA: "+htmlProductos.length)
            await saveProducts(htmlProductos,page,rows);
          }else{
            console.log("NO SE OBTUVIERON EL TOTAL DE PRODUCTOS");
            await loadMoreProducts(page, browser, rows);
          }
      }else{
            console.log("HAY BOTON");
            await page.click("#btn_getMore");
            //await page.waitForNavigation();
                    //scroll hasta el inicio de la web
            await page.evaluate(()=>{
              window.scrollTo(0,0);
            })
            await page.waitForTimeout(5000);
            await loadMoreProducts(page, browser, rows);
      }
    }else{
      console.log("ERROR BOTON DE DESPLEGAR PRODUCTOS");
    }





    console.log("EL BOTON ES "+btnMoreProducts);
   console.log("EXISTE EL FIN? "+productosADesplegar[2]);
   
    if (productosADesplegar[2]) {
       
    } else {
              //YA COMPLETO DE DESPLEGAR TODA LA CATEGORIA
              
            }
}

async function saveProducts(productos,page,rows) {
  console.log(chalk.red("                   OBTENIENDO DATOS..."));

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
  
          const marcaProducto = "";
   
          const eanElement =tempDiv.querySelector('div div.ean_price')?.innerText.split(" ");

          const descripcion = tempDiv.querySelector('div.item_card__description')?.innerText;

          const priceProducto = tempDiv.querySelector('div.number_price')?.innerText;
          const priceProductoDescuento = tempDiv.querySelector('div.discounted_number_price')?.innerText;
          const priceProductPorMayor = priceProductoDescuento? priceProductoDescuento : null;
          console.log(priceProducto);
          const promo = tempDiv.querySelector('div div.title_price')?.innerText;         

          //CADENA
          arrayProductos.push("Maxi Carrefour");
          //SUCURSAL
          arrayProductos.push("");
          //FECHA
          arrayProductos.push(fechaConSeparador?fechaConSeparador:"");
          //CATEGORIA
          arrayProductos.push("");
          //SUBCATEGORIA
          arrayProductos.push("");
          //MARCA
          arrayProductos.push("");
          //DESCRIPCION
          arrayProductos.push(descripcion?descripcion.trim():"");
          //EAN
          arrayProductos.push(eanElement?eanElement[1]:"");
          //PRECIO REGULAR
          arrayProductos.push("");
          //PRECIO PROMOCIONAL
          arrayProductos.push(promo?promo:"");
          //PRECIO UNITARIO PROMOCIONAL
          arrayProductos.push(priceProductPorMayor?priceProductPorMayor:priceProducto);
          //PRECIO OFERTA
          arrayProductos.push("");
           //PRECIO POR UNIDAD DE MEDIDA
           arrayProductos.push("");
           //UNIDAD DE MEDIDA
          arrayProductos.push("");
          //PRECIO ANTIGUO
          arrayProductos.push("");
          //PRECIO POR MAYOR
          arrayProductos.push(priceProductPorMayor);
          return arrayProductos;  
          
        },producto);
      
      rows.push(resultado?resultado:"ERROR");
        //console.log(rows);
    } catch (error) {
      console.error('error obteniendo datos del producto individual', error);
    } 
  }
}

async function selectSucursal(page){
    try{
        console.log("INICIANDO SELECCION DE SURCURSAL");
        await page.waitForSelector('#nav > div > div.text_right > div.menuSearch__icon2.menuSearch__pt.subMenu_container.inline-block.cursor_pointer');
        const btnIngresarPerfil = await page.$("#nav > div > div.text_right > div.menuSearch__icon2.menuSearch__pt.subMenu_container.inline-block.cursor_pointer");
        await btnIngresarPerfil.click();

        await page.waitForSelector('#userForm');
        const btnRetiroEnSucursal = await page.$("#deliveryType2 > div:nth-child(1) > img");
        await btnRetiroEnSucursal.click();
        const btnConfirmar = await page.$("#btn_step1");
        await btnConfirmar.click();
        await page.waitForTimeout(5000);
        try{
          const selectProvincia = '#region'; 
          const opcionProvincia = 'BS AS (NORTE)';
          await page.select(selectProvincia, opcionProvincia);
          await page.waitForTimeout(1000);
          const selectLocalidad = '#seller'; 
          const opcionLocalidad = '709';
          await page.select(selectLocalidad, opcionLocalidad);

          const btnConfirmar2 = await page.$("#btn_step2");
          await page.waitForTimeout(1000);
          await btnConfirmar2.click();
          await page.waitForTimeout(5000);
        }catch{
          console.error('error al setear valores de ingreso de seleccion de provincia');
        }
        try{
          const selectorInputNombre = await page.$('#user-name');
          const selectorInputCuit = await page.$('#user-cuit');
          const selectorInputCel = await page.$('#user-phone');
          const selectorInputMail = await page.$('#user-email');

          // console.log("SLECTOR "+selectorInputMail);
           if(selectorInputNombre){
             await selectorInputNombre.type('blas stanciuc');
           }else{console.log("NO SE ENCONTRO EL INPUT DEL MAIL")}
           await page.waitForTimeout(1000);
           if(selectorInputCuit){
            await selectorInputCuit.type('20400957215');
          }else{console.log("NO SE ENCONTRO EL INPUT DEL MAIL")}
          await page.waitForTimeout(1000);
          if(selectorInputCel){
            await selectorInputCel.type('2291461422');
          }else{console.log("NO SE ENCONTRO EL INPUT DEL MAIL")}
          await page.waitForTimeout(1000);
          if(selectorInputMail){
            await selectorInputMail.type('blasstanciuc@gmail.com');
          }else{console.log("NO SE ENCONTRO EL INPUT DEL MAIL")}
          await page.waitForTimeout(1000);
          const btnConfirmar3 = await page.$("#btn_step3");
          await page.waitForTimeout(2000);
          await page.click("#btn_step3");
          await page.waitForTimeout(1000);
          await page.keyboard.press('Enter');
         await page.waitForTimeout(5000);
          const errorIngreso = await page.$("div.error_msj button");
          if(errorIngreso){
            await errorIngreso.click();
          }else{console.log("NO SE ENCONTRO ERROR EN VENTANA DE INGRESO")}

        }catch{
          console.error('error al setear valores de datos personales');
        } 
        await page.waitForTimeout(10000);
        console.error('INGRESO CON EXITO');
    }catch(error){
        console.log("ERROR SELECCIONAR SUCURSAL"+error);
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
  const fileName= 'maxiCarrefour'+fechaConSeparador+'.xlsx';
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
    {header: 'Precio pOR mAYOR'}

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
