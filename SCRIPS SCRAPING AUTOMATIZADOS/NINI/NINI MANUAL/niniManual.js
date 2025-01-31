(async function(){
    // Verificar si jQuery está disponible
    if (typeof jQuery === 'undefined') {
        console.error("Error: jQuery no está cargado.");
        return;
    }

    // Reinicializar variables globales para evitar conflictos en ejecuciones repetidas
    let html = $('html'); 
    const fechaActual = new Date();
    const dia = fechaActual.getDate().toString().padStart(2, '0');
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
    const año = fechaActual.getFullYear();
    const fechaConSeparador = `${dia}_${mes}_${año}`;
    
    let rows = [['Cadena','Sucursal','Fecha Scraping','Categoria','Subcategoria','Marca Cadena','Descripcion Cadena','EAN','Precio Regular','Precio Promocional','Precio Unitario Promocional','Precio Oferta','Precio Por Unidad de Medida','Unidad de Medida','Precio Antiguo']];
    let linkId = 'csv_link';
    let speed = 10000; 
    let speedInterval = 2000; 
    let totalProducts = parseInt(document.querySelector('#pageInfoBot span:last-child')?.innerText || "0");
    let finalHtml = $('#pages').offset()?.top || 0;
    let flagProceso = false;
    let linkNextPage = "";
    let newPage = '';
    let banderaFin = false;
    let categoria = document.querySelector('li.filter-tag.sectors')?.innerText || "";
    let x = 0;
    let i = 0;
    let paginaSiguiente = true;

    console.log("Inicio del scraping...");

    do {
        await scrollPage(speed, finalHtml);
        await obtenerDatos();
        
        let btnActual = $('#pageButton a.pager-selected').parent();
        let pageSiguiente = $('a', btnActual.next())[0];

        paginaSiguiente = pageSiguiente ? pageSiguiente : false;
        await nextPage(pageSiguiente);
    } while (paginaSiguiente);

    console.log("Scraping finalizado.");
    finalizar();

    //------------------------------------------------------------------Funciones

    function scrollPage(speed, posicion) {
        return new Promise((resolve) => {
            html.animate({ scrollTop: 0 }, speed);
            html.animate({ scrollTop: posicion }, speed, 'linear', () => {
                resolve();
            });
        });
    }

    function obtenerDatos() {
        return new Promise((resolve) => {
            let productos = document.querySelectorAll('#productModel');
            let data_row = [];

            for (let i = 0; i < productos.length; i++) {
                let elemento = productos[i];
                const precioAntiguoProducto = elemento.querySelector('span.product-price.previous-price')?.innerText || "";
                const precioProducto = elemento.querySelector('span.product-price.actual-price')?.innerText || "";
                const descripcionProducto = elemento.querySelector('#productSmallDesc')?.innerText || "";
                const tienePromo = elemento.querySelector('td.grid-icon a.promotion-icon.to-block') ? "P" : "";

                // Agregar datos a la fila
                data_row.push("NINI");  // CADENA
                data_row.push("");      // SUCURSAL
                data_row.push(fechaConSeparador); // FECHA SCRAPING
                data_row.push("");      // CATEGORIA
                data_row.push("");      // SUBCATEGORIA
                data_row.push("");      // MARCA CADENA
                data_row.push(descripcionProducto); // DESCRIPCION
                data_row.push("");      // EAN
                data_row.push(precioAntiguoProducto || precioProducto); // PRECIO REGULAR
                data_row.push(tienePromo); // PRECIO PROMOCIONAL
                data_row.push("");      // PRECIO UNITARIO PROMOCIONAL
                data_row.push(precioAntiguoProducto ? precioProducto : precioAntiguoProducto); // PRECIO OFERTA
                rows.push(data_row);
                data_row = [];
            }
            resolve();
        });
    }

    function nextPage(pageSiguiente) {
        return new Promise((resolve) => {
            if (pageSiguiente) {
                pageSiguiente.click();
                setTimeout(() => {
                    resolve();
                }, 10000);
            } else {
                finalizar();
                resolve();
            }
        });
    }

    function createFile() {
        let fileName = `NINI_${categoria}_${fechaConSeparador}.csv`;
        let csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(";")).join("\n");
        let encodedUri = encodeURI(csvContent);
        let link = document.createElement("a");

        link.setAttribute("href", encodedUri);
        link.setAttribute("download", fileName);
        link.id = linkId;
        document.body.appendChild(link);
        link.click();
        $('#csv_link').remove();
    }

    function finalizar() {
        console.log("Generando archivo CSV...");
        createFile();
    }

})();
