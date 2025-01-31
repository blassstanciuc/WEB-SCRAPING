/*! jQuery v3.6.3 | (c) OpenJS Foundation and other contributors | jquery.org/license */

//DEVELOPED STANCIUC BLAS
    // optionals values
    var fechaActual = new Date();
    // Obtener el día, el mes y el año de la fecha actual
    var dia = fechaActual.getDate().toString().padStart(2, '0');
    var mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // Nota: getMonth() devuelve un valor entre 0 y 11, sumamos 1 para obtener el mes real
    var año = fechaActual.getFullYear();
    // Crear una cadena de texto en formato "dd/mm/yyyy"
    var fechaConSeparador = dia + '/' + mes + '/' + año;
    let rows = [['Cadena','Sucursal','Fecha Scraping','Categoria','Subcategoria','Marca Cadena','Descripcion Cadena','EAN','Precio Regular','Precio Promocional','Precio Unitario Promocional','Precio Oferta','Precio Por Unidad de Medida','Unidad de Medida','Precio Antiguo']];
    let linkId = 'csv_link';
    let speed = 10000; 
    var speedInterval = 2000; 
    let html = $('html')
    let totalProducts = parseInt(document.getElementById('resultsCount').innerText);
    let finalHtml = $('#atg_store_pagination').offset() !== undefined?$('#atg_store_pagination').offset().top:$('#suscribite_footer').position().top; //sacamos la posicion de un elemento posicionado y uno pos statico.
    let partFooter = $('#suscribite_footer').position().top;
    let flagProceso = false;
    let msj = ()=>console.log("FIN DE SCREAPEO BY BLAS :)");
    let linkNextPage = "";
    let newPage = '';
    let banderaFin = false;
    let arrayProductos = [];
    var productoIndividual;
    var dataCategoria ="";
    var urlProducto;

    setTimeout(()=>{
        scrollPage(speed,finalHtml);
    },speedInterval);  

    //La web en un inicio se posiciona en el top antes de hacer el scroll
    html.animate({ scrollTop: 0 }, speed);

    //Funcion principal, donde hace scroll
    function scrollPage(speed, posicion){ 
        return new Promise((resolve, reject) => {

        //callback sera la funcion que ejecutaremos al terminar el animate
        //hacemos que el scroll vaya hacia arriba
        html.animate({ scrollTop: posicion }, speed,'linear', () => {
            let btnActual = $('div.atg_store_pagination ul li a.disabledLink').parent();
            let pageSiguiente = btnActual.next();
            pageSiguiente = $('a',pageSiguiente)[0];

            //Validamos si la categoria tiene una sola pagina o tiene varias paginas
            if(finalHtml!==partFooter){
                //Extraemos datos de la pagina principal, todos los productos con su info
                let rawPrimerHojaProductosGral = $('#atg_store_container','.atg_store_main').innerHTML;
                let rawPrimerHojaProductos = $('div.found_box',rawPrimerHojaProductosGral);
                let productosConteiner = $('ul#products',rawPrimerHojaProductos);
                let productos = $('li',productosConteiner);
                

                function obtenerDatos(){
                    //obtenemos la categoria de la pagina
                    dataCategoria = document.querySelector('#atg_store_dimensionRefinements #atg_store_refinementAncestors #atg_store_refinementAncestorsLinks span.atg_store_refinementAncestorsLastLinkSpan');
                    for (let i = 0; i< productos.length; i++) {




                        
                    //GETDATOS
                    let nombreProducto = productos[i].querySelector('span.span_productName div.descrip_full');
                    let precioProducto = productos[i].querySelector('div.rightList span.atg_store_productPrice span.atg_store_newPrice');
                    let precioPromoProducto = productos[i].querySelector('div.rightList div.info_discount div.product_discount_container span.text_price_discount');
                    let precioUnitarioPromocional = productos[i].querySelector("div.rightList div.info_discount div.first_price_discount_container span.price_discount");  
                    let enlaceProduct = productos[i].querySelector("div.product_info_container a");
                    let linkProduct = $(enlaceProduct).attr('href');   
                    console.log("PRODUCTO HREF: "+linkProduct);
                    //CADENA
                    arrayProductos.push("Coto");
                    //SUCURSAL
                    arrayProductos.push("");
                    //FECHA
                    arrayProductos.push(fechaConSeparador);
                    //CATEGORIA
                    arrayProductos.push(dataCategoria==null || dataCategoria==undefined?"":dataCategoria.innerText);
                    //SUBCATEGORIA
                    arrayProductos.push("");
                    //MARCA
                    arrayProductos.push("");
                    //DESCRIPCION
                    arrayProductos.push(nombreProducto.innerText.trim());
                    //EAN
                    arrayProductos.push("");
                    //PRECIO REGULAR
                    arrayProductos.push(precioProducto.innerText.trim());
                    //PRECIO PROMOCIONAL
                    if(precioPromoProducto==undefined || precioPromoProducto==null ){
                        arrayProductos.push("");
                    }else{
                        arrayProductos.push(precioPromoProducto.innerText.trim());
                    }
                    //PRECIO UNITARIO PROMOCIONAL
                    let precioUnitario;
                    let soloUnitario;
                    console.log("PRECIO UNITARIO PROMOCIONAL" + precioUnitarioPromocional);
                    if(precioUnitarioPromocional!=undefined || precioUnitarioPromocional!=null){
                       precioUnitario = precioUnitarioPromocional.innerText;
                       soloUnitario = precioUnitario.split("c"); 
                    }else{
                        precioUnitarioPromocional = productos[i].querySelector("div.rightList div.info_discount div.first_price_discount_container span.price_discount_gde");
                        if(precioUnitarioPromocional!=undefined || precioUnitarioPromocional!=null){
                            precioUnitario = precioUnitarioPromocional.innerText;
                            soloUnitario = precioUnitario.split("c"); 
                         }
                    }
                    arrayProductos.push(precioUnitarioPromocional==undefined || precioUnitarioPromocional==null?"":soloUnitario[0].trim());                    //PRECIO OFERTA
                    //precioOfertaProducto = productos[i].querySelector('div.image_discount_container span.text_price_discount')?productos[i].querySelector('div.image_discount_container span.text_price_discount'):"NO TIENE";
                    //arrayProductos.push(precioOfertaProducto.innerText);
                    arrayProductos.push(" ");
                    //PRECIO POR UNIDAD DE MEDIDA
                    precioUnidadMedidaProducto = productos[i].querySelector('div.product_info_container span.unit')?productos[i].querySelector('div.product_info_container span.unit'):"NO TIENE";
                    unidadDeMedidadPrice = (precioUnidadMedidaProducto.innerText);
                    unidadSeparada = unidadDeMedidadPrice.split(":");
                    unidad= unidadSeparada[1].trim();
                    arrayProductos.push(unidad);
                    
                    //UNIDAD DE MEDIAD
                    UnidadMedidaProducto = productos[i].querySelector('div.product_info_container span.unit')?productos[i].querySelector('div.product_info_container span.unit'):"NO TIENE";
                    unidadDeMedidadProduct = (UnidadMedidaProducto.innerText);
                    medidaSeparada = unidadDeMedidadProduct.split(" ");
                    medida= medidaSeparada[3].trim();
                    arrayProductos.push(medida);
                    
                    //PRECIO ANTIGUO 
                    arrayProductos.push("");
                        //------------------------------------------- 
                        //Preguntamos si se abrieron todos los productos de la pagina
                        if(i==productos.length-1){
                            //Aca llamariamos a que pase a la siguiente pagina, como prueba lo finalizamos
                            $(pageSiguiente).text()!==""?nextPage(pageSiguiente):msj();
                            //finalizar();
                            console.log("SE ABRIERON TODOS LO PRODUCTOS");
                        }
                        rows.push(arrayProductos);
                        arrayProductos=[];
                    }
                }
                    obtenerDatos();  
                }else{
                    //Extraemos datos de la pagina principal, todos los productos con su info
                    let rawPrimerHojaProductosGral = $('#atg_store_container','.atg_store_main').innerHTML;
                    let rawPrimerHojaProductos = $('div.found_box',rawPrimerHojaProductosGral);
                    let productosConteiner = $('ul#products',rawPrimerHojaProductos);
                    let productos = $('li',productosConteiner);
                    //obtenemos la categoria de la pagina
                    dataCategoria = document.querySelector('#atg_store_dimensionRefinements #atg_store_refinementAncestors #atg_store_refinementAncestorsLinks span.atg_store_refinementAncestorsLastLinkSpan');
                    for (let i = 0; i< productos.length; i++) {
                    //GETDATOS
                    let nombreProducto = productos[i].querySelector('span.span_productName div.descrip_full');
                    let precioProducto = productos[i].querySelector('div.rightList span.atg_store_productPrice span.atg_store_newPrice');
                    let precioPromoProducto = productos[i].querySelector('div.rightList div.info_discount div.product_discount_container span.text_price_discount');
                    let precioUnitarioPromocional = productos[i].querySelector("div.rightList div.info_discount div.first_price_discount_container span.price_discount" );    
                    //CADENA
                    arrayProductos.push("Coto");
                    //SUCURSAL
                    arrayProductos.push("");
                    //FECHA
                    arrayProductos.push(fechaConSeparador);
                    //CATEGORIA
                    arrayProductos.push(dataCategoria==null || dataCategoria==undefined?"":dataCategoria.innerText);
                    //SUBCATEGORIA
                    arrayProductos.push("");
                    //MARCA
                    arrayProductos.push("");
                    //DESCRIPCION
                    arrayProductos.push(nombreProducto.innerText.trim());
                    //EAN
                    arrayProductos.push("");
                    //PRECIO REGULAR
                    arrayProductos.push(precioProducto.innerText.trim());
                    //console.log("PRECIO REGULRAR "+i+" "+precioProducto.innerText)
                    //PRECIO PROMOCIONAL
                    if(precioPromoProducto==undefined || precioPromoProducto==null ){
                        arrayProductos.push("");
                    }else{
                        arrayProductos.push(precioPromoProducto.innerText.trim());
                    }
                    //PRECIO UNITARIO PROMOCIONA
                    let precioUnitario;
                    let soloUnitario;
                    console.log("PRECIO UNITARIO PROMOCIONAL" + precioUnitarioPromocional);
                    if(precioUnitarioPromocional!=undefined || precioUnitarioPromocional!=null){
                       precioUnitario = precioUnitarioPromocional.innerText;
                       soloUnitario = precioUnitario.split("c"); 
                    }else{
                        precioUnitarioPromocional = productos[i].querySelector("div.rightList div.info_discount div.first_price_discount_container span.price_discount_gde");
                        if(precioUnitarioPromocional!=undefined || precioUnitarioPromocional!=null){
                            precioUnitario = precioUnitarioPromocional.innerText;
                            soloUnitario = precioUnitario.split("c"); 
                         }
                    }
                    
                    arrayProductos.push(precioUnitarioPromocional==undefined || precioUnitarioPromocional==null?"":soloUnitario[0].trim());
                    //PRECIO OFERTA
                    //precioOfertaProducto = productos[i].querySelector('div.image_discount_container span.text_price_discount')?productos[i].querySelector('div.image_discount_container span.text_price_discount'):"NO TIENE";
                    //arrayProductos.push(precioOfertaProducto.innerText);
                    arrayProductos.push(" ");
                    //PRECIO POR UNIDAD DE MEDIDA
                    precioUnidadMedidaProducto = productos[i].querySelector('div.product_info_container span.unit')?productos[i].querySelector('div.product_info_container span.unit'):"NO TIENE";
                    unidadDeMedidadPrice = (precioUnidadMedidaProducto.innerText);
                    unidadSeparada = unidadDeMedidadPrice.split(":");
                    unidad= unidadSeparada[1].trim();
                    arrayProductos.push(unidad);
                    
                    //UNIDAD DE MEDIAD
                    UnidadMedidaProducto = productos[i].querySelector('div.product_info_container span.unit')?productos[i].querySelector('div.product_info_container span.unit'):"NO TIENE";
                    unidadDeMedidadProduct = (UnidadMedidaProducto.innerText);
                    medidaSeparada = unidadDeMedidadProduct.split(" ");
                    medida= medidaSeparada[3].trim();
                    arrayProductos.push(medida);
                    
                    //PRECIO ANTIGUO 
                    arrayProductos.push("");
                    //------------------------------------------- 
                    //Preguntamos si se abrieron todos los productos de la pagina
                    rows.push(arrayProductos);
                    arrayProductos=[];
                    if(i==productos.length-1){
                        //Cuando termina de recorrer todos los productos finaliza porque es una sola hoja
                        finalizar();
                        console.log("SE ABRIERON TODOS LO PRODUCTOS");
                    }
                    
                    }
                }
            });   
    })
}

    function nextPage(urlNextPage){
        //Funcion que tomara la url de la siguiente pagina y la abrira
        var rawPrimerHojaProductosGral = "",rawPrimerHojaProductos="",productosConteiner="";
        var pageSiguiente ="";
        var productos = "";
        speedInterval = 45000;
        linkNextPage = $(urlNextPage).attr('href');
        console.log($(urlNextPage).text());
        console.log("URL DE LA PAGE SIGUIENTE: "+$(urlNextPage).attr('href'));
        //En newPage abrimos la siguiente pagina
        newPage = window.open(linkNextPage);      
        //Ejecutamos una funcion test desntro de la siguiente pagina
        newPage.test = () => {
            speed = 10000; 
            speedInterval = 2000; 
            html = newPage.$('html');
            //Obtenemos el final de esta pagina
            finalHtml = newPage.$('#atg_store_pagination').offset().top;
            flagProceso = false;
            msjFin = ()=>console.log("FIN DE SCREAPEO BY BLAS :)");
            linkNextPage = "";
            //Obtenemos los productos de la pagina
            let dataCategoria = newPage.document.querySelector('#atg_store_dimensionRefinements #atg_store_refinementAncestors #atg_store_refinementAncestorsLinks span.atg_store_refinementAncestorsLastLinkSpan');
             rawPrimerHojaProductosGral = newPage.document.querySelector('#atg_store_container');
             rawPrimerHojaProductos = $('div.found_box',rawPrimerHojaProductosGral);
             productosConteiner = $('ul#products',rawPrimerHojaProductos);
             productos = $('li',productosConteiner);
            //Creamos la funcion de scroll en esta pagina
            newPage.scrollPage = ()=>{
                html.animate({ scrollTop: finalHtml }, speed,'linear', () => {
                    btnActual = newPage.$('div.atg_store_pagination ul li a.disabledLink').parent();
                    pageSiguiente = btnActual.next();
                    //Obtenemos la url de la pagina siguiente
                    pageSiguiente = $('a',pageSiguiente)[0];
                    banderaFin = true;

                    if(banderaFin=== true){
                        console.log("LOS PRODUCTOS QUE VIAJARAN AL GETDATA"+productos);
                        getData(productos,dataCategoria)
                        .then(()=>{
                            //clearInterval(intervalo);
                            $(pageSiguiente).text() !== "" ? nextPage(pageSiguiente) : finalizar(); 
                        })
                    }
                });   
            }
            //Ejecutamos el scroll de la pagina
            newPage.scrollPage(); 
        };      
        //Ejecutamos el test
        newPage.addEventListener('load',()=>{
            newPage.test();
        }) 
    }

   
    function getData(productos,dataCategoria){ 
        return new Promise((resolve)=>{
            for (let i = 0; i< productos.length; i++) {
                //GETDATOS
                let nombreProducto = productos[i].querySelector('span.span_productName div.descrip_full');
                let precioProducto = productos[i].querySelector('div.rightList span.atg_store_productPrice span.atg_store_newPrice');
                let precioPromoProducto = productos[i].querySelector('div.rightList div.info_discount div.product_discount_container span.text_price_discount');
                let precioUnitarioPromocional = productos[i].querySelector("div.rightList div.info_discount div.first_price_discount_container span.price_discount" );
            //CADENA
            arrayProductos.push("Coto");
            //SUCURSAL
            arrayProductos.push("");
            //FECHA
            arrayProductos.push(fechaConSeparador);
            //CATEGORIA
            arrayProductos.push(dataCategoria==null || dataCategoria==undefined?"":dataCategoria.innerText);
            //SUBCATEGORIA
            arrayProductos.push("");
            //MARCA
            arrayProductos.push("");
            //DESCRIPCION
            arrayProductos.push(nombreProducto.innerText.trim());
            //EAN
            arrayProductos.push("");
            //PRECIO REGULAR
            if(precioProducto){
                arrayProductos.push(precioProducto.innerText.trim());
            }else{
                arrayProductos.push("");
            }
            //PRECIO PROMOCIONAL
            if(precioPromoProducto==undefined || precioPromoProducto==null ){
                arrayProductos.push("");
            }else{
                arrayProductos.push(precioPromoProducto.innerText.trim());
            }
            //PRECIO UNITARIO PROMOCIONAL
            let precioUnitario;
            let soloUnitario;
            console.log("PRECIO UNITARIO PROMOCIONAL" + precioUnitarioPromocional);
            if(precioUnitarioPromocional!=undefined || precioUnitarioPromocional!=null){
               precioUnitario = precioUnitarioPromocional.innerText;
               soloUnitario = precioUnitario.split("c"); 
            }else{
                precioUnitarioPromocional = productos[i].querySelector("div.rightList div.info_discount div.first_price_discount_container span.price_discount_gde");
                if(precioUnitarioPromocional!=undefined || precioUnitarioPromocional!=null){
                    precioUnitario = precioUnitarioPromocional.innerText;
                    soloUnitario = precioUnitario.split("c"); 
                 }
            }
            arrayProductos.push(precioUnitarioPromocional==undefined || precioUnitarioPromocional==null?"":soloUnitario[0].trim());
            //PRECIO OFERTA
            //precioOfertaProducto = productos[i].querySelector('div.image_discount_container span.text_price_discount')?productos[i].querySelector('div.image_discount_container span.text_price_discount'):"NO TIENE";
            //arrayProductos.push(precioOfertaProducto.innerText);
            arrayProductos.push(" ");
            //PRECIO POR UNIDAD DE MEDIDA
            
            precioUnidadMedidaProducto = productos[i].querySelector('div.product_info_container span.unit')?productos[i].querySelector('div.product_info_container span.unit'):"NO TIENE";
            if(precioUnidadMedidaProducto){
                unidadDeMedidadPrice = (precioUnidadMedidaProducto.innerText);
                unidadSeparada = unidadDeMedidadPrice.split(":");
                if(unidadSeparada[1]){
                unidad= unidadSeparada[1].trim();
                arrayProductos.push(unidad);
                }else{
                    arrayProductos.push("");
                }
            }else{
                arrayProductos.push("");
            }
            
            //UNIDAD DE MEDIAD
             UnidadMedidaProducto = productos[i].querySelector('div.product_info_container span.unit')?productos[i].querySelector('div.product_info_container span.unit'):"NO TIENE";
            unidadDeMedidadProduct = (UnidadMedidaProducto.innerText);
            medidaSeparada = unidadDeMedidadProduct.split(" ");
            if(medidaSeparada[3]){
                medida= medidaSeparada[3].trim();
                arrayProductos.push(medida);
            }else{
                arrayProductos.push("");
            }
            
            
            //PRECIO ANTIGUO 
            arrayProductos.push("");
                if(i==productos.length-1){
                    resolve();
                }
                rows.push(arrayProductos);
                arrayProductos=[];
            } 
        })
    }
    
    

    function createFile () {
        //Creamos el archivo excel
        var fileName = 'Cotto_'+dataCategoria==null || dataCategoria==undefined?"":dataCategoria.innerText+'_'+fechaConSeparador+'.csv';
        csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(";")).join("\n");
        encodedUri = encodeURI(csvContent);
        link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.id = linkId;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        $('#csv_link').remove();
    }

    function finalizar(){
        //Exportamos el archivo excel
        
        createFile();
    }

    function closeOpenedWindow() {
        
            productoIndividual.close();
        }
      

    function openWindow(url){
        productoIndividual = window.open(url);
    }