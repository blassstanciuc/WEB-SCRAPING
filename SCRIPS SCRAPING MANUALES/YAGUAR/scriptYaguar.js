//DEVELOPED STANCIUC BLAS
    // optionals values
    const fechaActual = new Date();
    // Obtener el día, el mes y el año de la fecha actual
    const dia = fechaActual.getDate().toString().padStart(2, '0');
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // Nota: getMonth() devuelve un valor entre 0 y 11, sumamos 1 para obtener el mes real
    const año = fechaActual.getFullYear();
    // Crear una cadena de texto en formato "dd/mm/yyyy"
    const fechaConSeparador = dia + '_' + mes + '_' + año;  
    let rows = [['Cadena','Sucursal','Fecha Scraping','Categoria','Subcategoria','Marca Cadena','Descripcion Cadena','EAN','Precio Regular','Precio Promocional','Precio Unitario Promocional','Precio Oferta','Precio Por Unidad de Medida','Unidad de Medida','Precio Antiguo']];
    let linkId = 'csv_link';
    let speed = 10000; 
    var speedInterval = 2000; 
    let html = $('html')
    //let totalProducts = parseInt(document.querySelector('span ').innerText);
    //let finalHtml = $('div.Bottom div.Footer').offset().top;
    //console.log(finalHtml);
    let flagProceso = false;
    let msj = ()=>console.log("FIN DE SCREAPEO BY BLAS :)");
    let linkNextPage = "";
    let newPage = '';
    let banderaFin = false;
    var productoIndividual;
    var bandera = false;
    var urlProducto;
    var nuevaVentana;
    let categoria = document.querySelector('span.prdnombre span.tcnaranja')?.innerText.split(">");//Hay que agarrar la categoria[1]
    let pagina = document.querySelector('span.tcceleste')?.innerText.split(" ");//agarrar pagina[0] y pagina[1]
    
    
   
    let x=0;
    var i=0;
    let paginaSiguiente = true;
    let btnSiguiente;
   //do {
        //INICIO
        //await scrollToBottom();
        await obtenerDatos();
        //console.log("OBTENIENDO DATOS");
        await finalizar();
        //await espera();
        //btnSiguiente = document.querySelector("body > table > tbody > tr:nth-child(5) > td > form > table:nth-child(3) > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td.destnotastit > font:nth-child(2) > a:nth-child(2)");
        //paginaSiguiente = btnSiguiente? btnSiguiente : false;
       //await nextPage(btnSiguiente);
    //} while (paginaSiguiente);

    //------------------------------------------------------------------Functions
    function scrollPage(speed, posicion){ //Se posiciona la web en el inicio y se hace un scroll hasta abajo.
        return new Promise ((resolve)=>{
            html.animate({ scrollTop: 0 }, speed);
            html.animate({ scrollTop: posicion }, speed,'linear',()=>{
                resolve();
            }); 
            
        })
   
    }

    function obtenerDatos(categoria) {
        return new Promise (async(resolve)=>{
            let productos = document.querySelectorAll('td[width="50%"][valign="top"]');
            let data_row = [];
            for (let i = 0; i < productos.length; i++) {
                let elemento = productos[i];
                const precioAntiguoProducto = elemento.querySelector('span.product-price.previous-price')?.innerText;
                const precioProducto = elemento.querySelector('span.PRODPRECIOA')?.innerText;
                const descripcionProducto = elemento.querySelector('span.PRODTITULOA span.tcgrisoscuro')?.innerText;
                const producto = elemento.querySelector('span.PRODTITULOA span.tcgrisoscuro a');



                // Simular el clic en el producto
            //    await producto.click();
            //    await espera();
                // Esperar a que el EAN esté disponible
                // const ean = await new Promise((resolve) => {
                //     const eanElement = elemento.querySelector("#divLayerContenido > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > div > table > tbody > tr:nth-child(4) > td:nth-child(2) > span > span")
                //     if (eanElement) {
                //         console.log("TIENE EAN");
                //         resolve(eanElement.innerText);
                        
                //     } else {
                //         setTimeout(checkEAN, 100); // Revisar cada 100 ms
                //         console.log("NO TIENE EAN");
                //         resolve();
                //     }
                // });

                

                const tienePromo = elemento.querySelector('td.grid-icon a.promotion-icon.to-block');
                //console.log("ELEMENTO: " + categoria[1]);
                //CADENA
		        data_row.push("YAGUAR");
                //SUCURSAL
                data_row.push("");
                //FECHA SCRAPING
                data_row.push(fechaConSeparador);
                //CATEGORIA
		        data_row.push("");
		        //SUBCATEGORIA
		        data_row.push("");
                //MARCA CADENA
                data_row.push("");
                //DESCRIPCION CADENA
                data_row.push(descripcionProducto);
                //EAN
                data_row.push("");
                //PRECIO REGULAR
                data_row.push("$"+precioProducto);
                //PRECIO PROMOCIONAL
                data_row.push("");
                //PRECIO UNITARIO PROMOCIONAL
                data_row.push("");
                //PRECIO OFERTA
                data_row.push("");
                rows.push(data_row);
                data_row = [];
            }
            resolve();
        })
        
    }

    function nextPage(pageSiguiente){
            return new Promise ((resolve)=>{
                if(pageSiguiente){
                    pageSiguiente.click();
                    setTimeout(() => {
                        console.log("se resolvio apretar el click siguiente");
                        resolve();
                    }, 10000);
                }else{
                    //finalizar();  
                    console.log("Finalizamos");
                    resolve();  
                }
            })
        }
    function createFile () {
        //Creamos el archivo excel
        if(categoria){
         var fileName = 'YAGUAR'+'_'+categoria[1]+'('+pagina[0]+'-'+pagina[1]+')_'+fechaConSeparador+'.csv';
        }else{
            var fileName = 'YAGUAR'+'_'+fechaConSeparador+'.csv';
        }
        
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
        console.log("FINALIZO EL SCRAPEO");
        createFile();
    }

    function espera(){
        return new Promise ((resolve)=>{
                setTimeout(() => {
                    resolve();
                }, 10000);
        })
    }
    function scrollToBottom() {
        return new Promise((resolve)=>{
            window.scrollBy(0, 1); // Mueve la página hacia abajo por 1 píxel
            if (window.innerHeight + window.scrollY < document.body.offsetHeight) {
              setTimeout(scrollToBottom, 10); // Llama a la función nuevamente después de 10 milisegundos si no hemos llegado al final de la página
            }else{
                console.log("FIN DE SCROLL");
                resolve();
            }
        })

      }
    