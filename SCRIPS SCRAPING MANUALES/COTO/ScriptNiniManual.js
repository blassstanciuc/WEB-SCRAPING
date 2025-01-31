    //DEVELOPED STANCIUC BLAS
        // optionals values
        const fechaActual = new Date();
        // Obtener el día, el mes y el año de la fecha actual
        const dia = fechaActual.getDate().toString().padStart(2, '0');
        const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // Nota: getMonth() devuelve un valor entre 0 y 11, sumamos 1 para obtener el mes real
        const año = fechaActual.getFullYear();
        // Crear una cadena de texto en formato "dd/mm/yyyy"
        const fechaConSeparador = dia + '/' + mes + '/' + año;  
        let rows = [['Cadena','Sucursal','Fecha Scraping','Categoria','Subcategoria','Marca Cadena','Descripcion Cadena','EAN','Precio Regular','Precio Promocional','Precio Unitario Promocional','Precio Oferta','Precio Por Unidad de Medida','Unidad de Medida','Precio Antiguo']];
        let linkId = 'csv_link';
        let speed = 10000; 
        var speedInterval = 2000; 
        let html = $('html')
        let totalProducts = parseInt(document.querySelector('#pageInfoBot span:last-child').innerText);
        let finalHtml = $('#pages').offset().top;
        let flagProceso = false;
        let msj = ()=>console.log("FIN DE SCREAPEO BY BLAS :)");
        let linkNextPage = "";
        let newPage = '';
        let banderaFin = false;
        var productoIndividual;
        var bandera = false;
        var urlProducto;
        var nuevaVentana;
        let categoria = document.querySelector('li.filter-tag.sectors')?.innerText;;
        let x=0;
        var i=0;
        let paginaSiguiente = true;
    do {
            //INICIO
            await scrollPage(speed,finalHtml);
            await obtenerDatos();
            let btnActual = $('#pageButton a.pager-selected').parent();
            
            let pageSiguiente = btnActual.next();
            //console.log(pageSiguiente);
            pageSiguiente = $('a',pageSiguiente)[0];
            paginaSiguiente = pageSiguiente? pageSiguiente : false;
            await nextPage(pageSiguiente);
        } while (paginaSiguiente);

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
            return new Promise ((resolve)=>{
                let productos = document.querySelectorAll('#productModel');
                let data_row = [];
                for (let i = 0; i < productos.length; i++) {
                    let elemento = productos[i];
                    const precioAntiguoProducto = elemento.querySelector('span.product-price.previous-price')?.innerText;
                    const precioProducto = elemento.querySelector('span.product-price.actual-price')?.innerText;
                    const descripcionProducto = elemento.querySelector('#productSmallDesc')?.innerText;
                    const tienePromo = elemento.querySelector('td.grid-icon a.promotion-icon.to-block');
                    console.log("ELEMENTO: " + categoria);
                    //CADENA
                    data_row.push("NINI");
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
                    data_row.push(precioAntiguoProducto?precioAntiguoProducto:precioProducto);
                    //PRECIO PROMOCIONAL
                    data_row.push(tienePromo?"P":"");
                    //PRECIO UNITARIO PROMOCIONAL
                    data_row.push("");
                    //PRECIO OFERTA
                    data_row.push(precioAntiguoProducto?precioProducto:precioAntiguoProducto);
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
                            resolve();
                        }, 10000);
                    }else{
                        finalizar();  
                        resolve();  
                    }
                })
            }
        function createFile () {
            //Creamos el archivo excel
            var fileName = 'NINI'+'_'+categoria+'_'+fechaConSeparador+'.csv';
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


