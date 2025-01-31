
// CAMBIO -------------------------------------------------

let totalProducts = Number(document.querySelector('#countProducts')?.innerText.split(" ")[0]);
var speed = 10000;
var init_interval_speed = 1000;
var isScrapingComplete = false;
var isSecondLap = false;
let sucursal = document.querySelector('div.title-suc strong')?.innerText;
let categoria = document.querySelector("div.breadcrumb span:last-child");
var fechaActual = new Date();
// Obtener el día, el mes y el año de la fecha actual
var dia = fechaActual.getDate().toString().padStart(2, '0');
var mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // Nota: getMonth() devuelve un valor entre 0 y 11, sumamos 1 para obtener el mes real
var año = fechaActual.getFullYear();
// Crear una cadena de texto en formato "dd/mm/yyyy"
var fechaConSeparador = dia + '/' + mes + '/' + año;
var startInterval = () => {
						loading_interval = setInterval(()=>{
							loadProducts();	
						}, init_interval_speed);
					}

startInterval();

function scrollPage(speed, pos, callback){
	clearInterval(loading_interval);
	
	if(isSecondLap){
		speed /= 3;	
	}
	
    $('html')
		.animate({ scrollTop: pos }, speed,'linear', () => {
			if(callback != undefined){
				callback();
				if(!isScrapingComplete){
					isSecondLap = true;
					startInterval();
				}
			}			   
		});
}

function loadProducts() {
	
    loadProdBtn = $('#btn_getMore');
	btnAtr = loadProdBtn.attr('style');
	footer = $('.header_footer');

    if (btnAtr == 'display: none;' ){
        showMsj();
        clearInterval(loading_interval);
		isScrapingComplete = true;
        scrollPage(0, 0);		
		speed *= 3;
        scrollPage(Math.ceil(totalProducts/20) * speed, $('.header_footer').offset().top - 300, saveFile);
    }else{
        scrollPage(speed, loadProdBtn.offset().top - 300, clickNext);
    }   
}

function clickNext(){
	loadProdBtn[0]?.click();
}
let i=0;
function saveFile(){
	var prodContainer = document.querySelector('#result_container');
	var productos = $('div.item_card', prodContainer);
    var fileName;
	var linkId = 'csv_link';
	var csvContent, encodedUri, link, loadProdBtn;
	var rows = [];
	var data_row = [];
	console.log("productos afuera "+productos.length);


	for (let i = 0; i< productos.length; i++) {
		let nombreProducto = productos[i].querySelector('div.item_card__description');
		let eanProducto = productos[i].querySelector('div div.ean_price')?.innerText;
		let ean = eanProducto.split(" ");
		let precioProducto = productos[i].querySelector('div div.number_price');
		let precioProductoDescuento = productos[i].querySelector('#result_container div.discounted_number_price s');
		let precioProductoXMayor = precioProductoDescuento?precioProductoDescuento:null;
		let OfertaProducto = productos[i].querySelector('div div.title_price');
		let porcentajeNegativo = productos[i].querySelector('div div.discount_percentage');
		let cantPackage = productos[i].querySelector('.cart_button');  
		//CADENA
		data_row.push("Maxi Carrefour");
		//SUCURSAL
		 data_row.push(sucursal!=undefined?sucursal:"");
		// //FECHA SCRAPING
		 data_row.push(fechaConSeparador);
		//CATEGORIA
		 data_row.push(categoria.innerText);
		//SUBCATEGORIA
		 data_row.push("");
		//MARCA CADENA
		data_row.push("");
		//DESCRIPCION CADENA
		 data_row.push(nombreProducto.innerText.trim());
		//EAN
		 data_row.push(ean[1].trim());
		//PRECIO REGULAR
		data_row.push("");
		//PRECIO PROMOCIONAL
		 data_row.push(OfertaProducto.innerText.trim());
		//Precio Unitario Promocional
		data_row.push(precioProductoDescuento?precioProductoDescuento.innerText.trim():precioProducto.innerText.trim());
		// data_row.push(cantidadPaquete);	
		//PRECIO OFERTA
		data_row.push("");
		//PRECIO POR UNIDAD DE MEDIDA
		data_row.push("");
		//UNIDAD DE MEDIDA
		data_row.push("");	
		//PRECIO ANTIGUO
		data_row.push(porcentajeNegativo?porcentajeNegativo.innerText.trim():"");	 
		//PRECIO POR MAYOR
		data_row.push(precioProductoXMayor?precioProducto.innerText.trim():"");
	   
	   rows.push(data_row);
	   data_row = [];
	}
	
	rows.unshift(['Cadena','Sucursal','Fecha Scraping','Categoria','Subcategoria','Marca Cadena','Descripcion Cadena','EAN','Precio Regular','Precio Promocional','Precio Unitario Promocional','Precio Oferta','Precio Por Unidad de Medida','Unidad de Medida','Precio Antiguo',"Precio Por Mayor"]);	fileName = "Maxi"+'_'+fechaConSeparador+'_'+categoria.innerText+'.csv'
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

function showMsj(){
    console.log('**********************************');
    console.log('**** NO MORE PRODUCTS TO LOAD ****');
	console.log('*********** by blas :) ***********');
    console.log('**********************************');
}
