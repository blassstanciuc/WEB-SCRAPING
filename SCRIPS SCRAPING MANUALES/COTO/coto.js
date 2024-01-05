/*! jQuery v3.6.3 | (c) OpenJS Foundation and other contributors | jquery.org/license */

//DEVELOPED STANCIUC BLAS
    // optionals values
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

    var urlProducto;
    let x=0;
    var i=0;
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

                async function obtenerDatos() {
                    for (x = 0; x < productos.length; x++) {
                        urlProducto = $('div.product_info_container a', productos[x]).attr('href');
                        productoIndividual = window.open(urlProducto);
                        await new Promise((resolve) => {
                            productoIndividual.addEventListener('load', () => {
                                let dataCategoria = productoIndividual.document.querySelector('#atg_store_main #atg_store_container #atg_store_breadcrumbs a:last-child');
                                arrayProductos.push(dataCategoria.innerText);
                                console.log("VUELTAS " + (x + 1));

                                if (x == productos.length - 1) {
                                    console.log("SE ABRIERON TODOS LOS PRODUCTOS");
                                }
                                console.log("SE DEBE CERRAR");
                                
                                resolve();
                            });
                        });
                        productoIndividual.close();
                    }
                   
                }

                    //Ejecutamos obtener datos
                    obtenerDatos();   
                    console.log(x+'|'+productos.length);  
                    //arrayProductos.push(nombre.innerText);
                    //console.log(nombre.innerText);                         
                    // productoIndividual.getData();

                }else{
                //Se ejecutaria el siguiente codigo en caso de que sea una sola pagina la categoria
                let rawPrimerHojaProductosGral = $('#atg_store_container','.atg_store_main').innerHTML;
                let rawPrimerHojaProductos = $('div.found_box',rawPrimerHojaProductosGral);
                let productosConteiner = $('ul#products',rawPrimerHojaProductos);
                let productos = $('li',productosConteiner);
                let cantProductos = productos.length;
                console.log("SOLO HAY FOOTER");
                msj();
                }
            });   
    })
}

    function nextPage(urlNextPage){
        //Funcion que tomara la url de la siguiente pagina y la abrira
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
            //Creamos la funcion de scroll en esta pagina
            newPage.scrollPage = ()=>{
                html.animate({ scrollTop: finalHtml }, speed,'linear', () => {
                    btnActual = newPage.$('div.atg_store_pagination ul li a.disabledLink').parent();
                    pageSiguiente = btnActual.next();
                    //Obtenemos la url de la pagina siguiente
                    pageSiguiente = $('a',pageSiguiente)[0];
                    banderaFin = true;
                });   
            }
            //Ejecutamos el scroll de la pagina
            newPage.scrollPage(); 
        };  
        
        //Creamos un intervalo para preguntar si existe una nueva pagina para volver a ejecutar la apertura de la nueva pagina
        let intervalo = setInterval(() => {
                if(banderaFin=== true){
                //ACAOBTENEDREMOS LOS DATOS Y LUEGO EJECUTAREMOS EL PAGINA SIGUIENTE
                $(pageSiguiente).text()!==""?nextPage(pageSiguiente):msjFin();
                clearInterval(intervalo);
            }
        }, 3000);    
    
    //Ejecutamos el test
    //setTimeout(()=>newPage.test() ,20000);
        
    }

   
    function getData(){ //SIN FUNCIONAMIENTO
        //EXTRAEMOS PRODUCTOS DE LA PAGINA
        let rawPrimerHojaProductosGral = $('#atg_store_container','.atg_store_main').innerHTML;
        let rawPrimerHojaProductos = $('div.found_box',rawPrimerHojaProductosGral);
        let productosConteiner = $('ul#products',rawPrimerHojaProductos);
        let productos = $('li',productosConteiner);
        let cantProductos = productos.length;
        console.log("ESTOY SACANDO DATA");
    }

    function createFile () {
        //Creamos el archivo excel
        var fileName = 'Cotto_'+'.csv';
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
        rows.push(arrayProductos);
        createFile();
    }


      
 
    function openWindow(url){
        productoIndividual = window.open(url);
    }