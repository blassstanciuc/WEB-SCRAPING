
$('html').animate({ scrollTop: 10}, 100);

// optionals values
var rows = [['Cadena','Sucursal','Fecha Scraping','Categoria','Subcategoria','Marca Cadena','Descripcion Cadena','EAN','Precio Regular','Precio Promocional','Precio Unitario Promocional','Precio Oferta','Precio Por Unidad de Medida','Unidad de Medida','Precio Antiguo']];
// obtener fecha actual
let fechaActual = new Date();
// Obtener el día, el mes y el año de la fecha actual
let dia = fechaActual.getDate().toString().padStart(2, '0');
let mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // Nota: getMonth() devuelve un valor entre 0 y 11, sumamos 1 para obtener el mes real
let año = fechaActual.getFullYear();
// Crear una cadena de texto en formato "dd/mm/yyyy"
let fechaConSeparador = dia + '/' + mes + '/' + año;
var categoria = 0;
var sucursalMod = 0;
var sucursal= 0;
var linkId = 'csv_link';
var scroll_speed = 3000;
var delay = 2000;
var openedProducts = [];
let flag = 0;
var sucursalLugar = 0;
//-----------------
		var totalProducts = document.querySelector('div.valtech-carrefourar-search-result-0-x-totalProducts--layout > span:first-child')?.innerText.split(" ");
		totalProducts=totalProducts[0];
		console.log(totalProducts);
var productsPerPage = 16;
var cont = 0;
var currentPage = 0;
var totalPages = Math.ceil(totalProducts / productsPerPage);
var prodContainer =  $('.valtech-carrefourar-search-result-0-x-gallery');
var productsList = $('.valtech-carrefourar-search-result-0-x-galleryItem ', prodContainer);
var firstProd = $('.valtech-carrefourar-search-result-0-x-galleryItem ', prodContainer)[0];
var spinner_flag = true;   
var csvContent, encodedUri, link;
var data_row = [];

setTimeout(()=> start(), delay);

function isPageLoaded() {
    return new Promise((resolve)=>{
		setTimeout(() => {
			spinner_flag = document.querySelector('.vtex__icon-spinner');
            if(spinner_flag){
                resolve(false);
            }else{
                resolve(true);
            } 
        }, delay);
    });
}

async function start() {
    let pageLoaded = false;
    
    while(!pageLoaded){
        pageLoaded = await isPageLoaded();
    }    
	
	scrollPage(scroll_speed, scraping);
}

 function scraping(){
	cont++;
	console.log('*****************');
	console.log(`Page N° ${cont} of ${totalPages}`);
	console.log('*****************');
	
	if(currentPage >= totalPages){
		console.log('*****************');
    	console.log('scraping complete');
		console.log('*****************');
		createFile();
		return;
	}
	
	getInfo();
	setTimeout(()=> start(), delay);
}

function scrollPage(scroll_speed, callback){
	var element = document.querySelector('div.valtech-carrefourar-search-result-0-x-paginationButtonPages');
	
	if (element) {
	$('html').animate({ scrollTop: 10}, 100);

// optionals values
var rows = [['Cadena','Sucursal','Fecha Scraping','Categoria','Subcategoria','Marca Cadena','Descripcion Cadena','EAN','Precio Regular','Precio Promocional','Precio Unitario Promocional','Precio Oferta','Precio Por Unidad de Medida','Unidad de Medida','Precio Antiguo']];
// obtener fecha actual
let fechaActual = new Date();
// Obtener el día, el mes y el año de la fecha actual
let dia = fechaActual.getDate().toString().padStart(2, '0');
let mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // Nota: getMonth() devuelve un valor entre 0 y 11, sumamos 1 para obtener el mes real
let año = fechaActual.getFullYear();
// Crear una cadena de texto en formato "dd/mm/yyyy"
let fechaConSeparador = dia + '/' + mes + '/' + año;
var categoria = 0;
var sucursalMod = 0;
var sucursal= 0;
var linkId = 'csv_link';
var scroll_speed = 3000;
var delay = 2000;
var openedProducts = [];
let flag = 0;
var sucursalLugar = 0;
//-----------------
		var totalProducts = document.querySelector('div.valtech-carrefourar-search-result-0-x-totalProducts--layout > span:first-child')?.innerText.split(" ");
		totalProducts=totalProducts[0];
		console.log(totalProducts);
var productsPerPage = 16;
var cont = 0;
var currentPage = 0;
var totalPages = Math.ceil(totalProducts / productsPerPage);
var prodContainer =  $('.valtech-carrefourar-search-result-0-x-gallery');
var productsList = $('.valtech-carrefourar-search-result-0-x-galleryItem ', prodContainer);
var firstProd = $('.valtech-carrefourar-search-result-0-x-galleryItem ', prodContainer)[0];
var spinner_flag = true;   
var csvContent, encodedUri, link;
var data_row = [];

setTimeout(()=> start(), delay);

function isPageLoaded() {
    return new Promise((resolve)=>{
		setTimeout(() => {
			spinner_flag = document.querySelector('.vtex__icon-spinner');
            if(spinner_flag){
                resolve(false);
            }else{
                resolve(true);
            } 
        }, delay);
    });
}

async function start() {
    let pageLoaded = false;
    
    while(!pageLoaded){
        pageLoaded = await isPageLoaded();
    }    
	
	scrollPage(scroll_speed, scraping);
}

 function scraping(){
	cont++;
	console.log('*****************');
	console.log(`Page N° ${cont} of ${totalPages}`);
	console.log('*****************');
	
	if(currentPage >= totalPages){
		console.log('*****************');
    	console.log('scraping complete');
		console.log('*****************');
		createFile();
		return;
	}
	
	getInfo();
	setTimeout(()=> start(), delay);
}

function scrollPage(scroll_speed, callback){
	var element = document.querySelector('div.valtech-carrefourar-search-result-0-x-paginationButtonPages');
	
	if (element) {
		$('html').animate({ scrollTop: $element.offset().top - 500}, scroll_speed, 'linear', callback);
	} else {
	  console.error('El elemento no existe.');
	}
  }

  function clickNext(){	
    var parentButtons = $('div.valtech-carrefourar-search-result-0-x-paginationButtonChangePage').parent();
    var lastPagination = $('div.valtech-carrefourar-search-result-0-x-paginationButtonPages:last', parentButtons);
    var lastButtonContext = $(lastPagination).next();
    var nextButton = $('button', lastButtonContext)[0];
    
    if(nextButton != undefined){
        nextButton.click();
		console.log("Cantidad de paginas= "+totalPages);
		flag=0;
    }
	
	currentPage++;
}

async function getInfo(){
	let elementosCategoria =0;
	var rawData = $('script', '.render-provider')[0].innerHTML
	    .replaceAll('&amp;','&')
	    .replaceAll('&apos;','\'');
	var products = JSON.parse(rawData).itemListElement;
    var prodContainer = $('.valtech-carrefourar-search-result-0-x-gallery');
	var productsList = '';  
    for (let i = 0; i < products.length; i++) {
		productsList = $('.valtech-carrefourar-search-result-0-x-galleryItem', prodContainer)[i];
		var offerName_00 = $('span.valtech-carrefourar-product-highlights-0-x-productHighlightText span.tooltipText', productsList)[0]?.innerText;
	  if(offerName_00 === undefined){
		offerName_00 = " "; // o simplemente no agregues la variable al array
	} 
	var offerName_01 = $('span.valtech-carrefourar-product-price-0-x-sellingPriceValue span.valtech-carrefourar-product-price-0-x-discountPercentage', productsList)[0]?.innerText;
	var prodName = $('span.vtex-product-summary-2-x-productBrand', productsList)[0]?.innerText;
	var price = $('span.valtech-carrefourar-product-price-0-x-sellingPriceValue span.valtech-carrefourar-product-price-0-x-currencyContainer', productsList)[0]?.innerText; 
	var oldPrice = $('div.vtex-flex-layout-0-x-flexCol div:nth-of-type(2) span.valtech-carrefourar-product-price-0-x-listPriceValue span.valtech-carrefourar-product-price-0-x-currencyContainer', productsList)[0]?.innerText;
	var unitDescrip = $('span.valtech-carrefourar-dynamic-weight-price-0-x-unit', productsList)[0]?.innerText;
	var unitPrice = $('div.vtex-flex-layout-0-x-stretchChildrenWidth span.valtech-carrefourar-dynamic-weight-price-0-x-currencyContainer', productsList)[0]?.innerText;
	var unidad = unitDescrip.split(" ");
	var unidadDeMedida = unidad[1].trim();
	let elements = document.querySelectorAll('div.valtech-carrefourar-search-result-0-x-galleryItem section.vtex-product-summary-2-x-container a.vtex-product-summary-2-x-clearLink--contentProduct');
	let productLink = $(elements[i]).attr('href');
	console.log("PRODUCTO HREF: "+productLink);

	

		if (!openedProducts.includes(productLink)) {
			openedProducts.push(productLink);
	 		let nuevaVeentana = window.open(productLink);
	 		nuevaVeentana.test = function () {
        	return new Promise((resolve) => {
			
                try {
					
					//CADENA
					data_row.push("Carrefour");
					//SUCURSAL
	   				elementosSucursal = document.querySelector('div.vtex-store-drawer-0-x-drawerTriggerContainer');
	   				sucursal = elementosSucursal.textContent;
					console.log("SUCURSAL:"+sucursal);
	   				sucursalLugar = sucursal.split(":");
	   				//sucursalMod = sucursalLugar[1].trim();
	   				data_row.push(sucursal!== "SELECCIONÁ TIENDA" ?sucursalLugar[1].trim():" ");
					//FECHA
					data_row.push(fechaConSeparador);
					
					//CATEGORIA
					elementosCategoria = nuevaVeentana.document.querySelector('div.vtex-breadcrumb-1-x-container span.vtex-breadcrumb-1-x-arrow--3 a.vtex-breadcrumb-1-x-link');
					console.log("CATEGORIA "+elementosCategoria);
					categoria = elementosCategoria.textContent;
					console.log('la categoria: '+categoria);
					data_row.push(categoria);
					//SUBCATEGORIA
					data_row.push("");
					//MARCA
					data_row.push(products[i].item.brand.name);
					//DESCRIPCION
					data_row.push(prodName);
					//EAN		
                    const EAN = nuevaVeentana.document.querySelector('td.vtex-store-components-3-x-specificationItemSpecifications');
                    data_row.push(EAN.textContent);
					//PRECIO REGULAR
					data_row.push(price);
					//PRECIO PROMOCIONAL
					data_row.push(offerName_00);
					//PRECIO UNITARIO PROMOCIONAL
					data_row.push("");
					//PRECIO OFERTA
					data_row.push(offerName_01);
					//PRECIO POR UNIDAD DE MEDIDA
					if(unitDescrip === undefined){
						data_row.push(" ");
					}else{
						data_row.push(unitPrice);
					}
					//UNIDAD DE MEDIDA
					data_row.push(unidadDeMedida);
					//PRECIO ANTIGUO
					data_row.push(oldPrice);
					nuevaVeentana.window.close();
			        //console.log("ESTOY EN LA CONDICION");
			        flag = flag + 1;
		            resolve();
                  } catch (error) {
                    console.log(`An error occurred: ${error}`);
                    					//CADENA
					data_row.push("Carrefour");
					//SUCURSAL
	   				elementosSucursal = document.querySelector('div.vtex-store-drawer-0-x-drawerTriggerContainer');
	   				sucursal = elementosSucursal.textContent;
					console.log("SUCURSAL:"+sucursal);
	   				sucursalLugar = sucursal.split(":");
	   				//sucursalMod = sucursalLugar[1].trim();
	   				data_row.push(sucursal!== "SELECCIONÁ TIENDA" ?sucursalLugar[1].trim():" ");
					//FECHA
					data_row.push(fechaConSeparador);
					
					//CATEGORIA
					elementosCategoria = nuevaVeentana.document.querySelector('div.vtex-breadcrumb-1-x-container span.vtex-breadcrumb-1-x-arrow--3 a.vtex-breadcrumb-1-x-link');
					console.log("CATEGORIA "+elementosCategoria);
					categoria = elementosCategoria.textContent;
					console.log('la categoria: '+categoria);
					data_row.push(categoria);
					//SUBCATEGORIA
					data_row.push("");
					//MARCA
					data_row.push(products[i].item.brand.name);
					//DESCRIPCION
					data_row.push(prodName);
					//EAN		
                    data_row.push(" ");
					//PRECIO REGULAR
					data_row.push(price);
					//PRECIO PROMOCIONAL
					data_row.push(offerName_00);
					//PRECIO UNITARIO PROMOCIONAL
					data_row.push("");
					//PRECIO OFERTA
					data_row.push(offerName_01);
					//PRECIO POR UNIDAD DE MEDIDA
					if(unitDescrip === undefined){
						data_row.push(" ");
					}else{
						data_row.push(unitPrice);
					}
					//UNIDAD DE MEDIDA
					data_row.push(unidadDeMedida);
					//PRECIO ANTIGUO
					data_row.push(oldPrice);
				    nuevaVeentana.window.close();
			        console.log("ESTOY EN LA CONDICION");
			        flag = flag + 1
		            resolve();
                  }
		 });
	   };
	
    }
    await nuevaVeentana.test().then(() => {
	  console.log("ENTRE");
	  console.log("oferta en el lugar "+i+" "+offerName_00);        
      rows.push(data_row);
	  data_row = [];   
    } )}

	return new Promise((resolve) => {
		if (flag == products.length){
			resolve();
		}}).then(()=>{
			clickNext();
 		});

}
async function createFile () {
    await getInfo()
	csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(";")).join("\n");
	encodedUri = encodeURI(csvContent);
	link = document.createElement("a");
	link.setAttribute("href", encodedUri);
	link.id = linkId;
	var sucursalTitulo = sucursal!== "SELECCIONÁ TIENDA"?sucursalLugar[1].trim():"";
	var fileName = 'carrefour_'+ fechaConSeparador +'_'+ categoria +'_'+sucursalTitulo+'.csv';
	link.setAttribute("download", fileName);
	document.body.appendChild(link);
	link.click();
	$('#csv_link').remove();
}
	} else {
	  console.error('El elemento no existe.');
	}
  }

  function clickNext(){	
    var parentButtons = $('div.valtech-carrefourar-search-result-0-x-paginationButtonChangePage').parent();
    var lastPagination = $('div.valtech-carrefourar-search-result-0-x-paginationButtonPages:last', parentButtons);
    var lastButtonContext = $(lastPagination).next();
    var nextButton = $('button', lastButtonContext)[0];
    
    if(nextButton != undefined){
        nextButton.click();
		console.log("Cantidad de paginas= "+totalPages);
		flag=0;
    }
	
	currentPage++;
}

async function getInfo(){
	let elementosCategoria =0;
	var rawData = $('script', '.render-provider')[0].innerHTML
	    .replaceAll('&amp;','&')
	    .replaceAll('&apos;','\'');
	var products = JSON.parse(rawData).itemListElement;
    var prodContainer = $('.valtech-carrefourar-search-result-0-x-gallery');
	var productsList = '';  
    for (let i = 0; i < products.length; i++) {
		productsList = $('.valtech-carrefourar-search-result-0-x-galleryItem', prodContainer)[i];
		var offerName_00 = $('span.valtech-carrefourar-product-highlights-0-x-productHighlightText span.tooltipText', productsList)[0]?.innerText;
	  if(offerName_00 === undefined){
		offerName_00 = " "; // o simplemente no agregues la variable al array
	} 
	var offerName_01 = $('span.valtech-carrefourar-product-price-0-x-sellingPriceValue span.valtech-carrefourar-product-price-0-x-discountPercentage', productsList)[0]?.innerText;
	var prodName = $('span.vtex-product-summary-2-x-productBrand', productsList)[0]?.innerText;
	var price = $('span.valtech-carrefourar-product-price-0-x-sellingPriceValue span.valtech-carrefourar-product-price-0-x-currencyContainer', productsList)[0]?.innerText; 
	var oldPrice = $('div.vtex-flex-layout-0-x-flexCol div:nth-of-type(2) span.valtech-carrefourar-product-price-0-x-listPriceValue span.valtech-carrefourar-product-price-0-x-currencyContainer', productsList)[0]?.innerText;
	var unitDescrip = $('span.valtech-carrefourar-dynamic-weight-price-0-x-unit', productsList)[0]?.innerText;
	var unitPrice = $('div.vtex-flex-layout-0-x-stretchChildrenWidth span.valtech-carrefourar-dynamic-weight-price-0-x-currencyContainer', productsList)[0]?.innerText;
	var unidad = unitDescrip.split(" ");
	var unidadDeMedida = unidad[1].trim();
	let elements = document.querySelectorAll('div.valtech-carrefourar-search-result-0-x-galleryItem section.vtex-product-summary-2-x-container a.vtex-product-summary-2-x-clearLink--contentProduct');
	let productLink = $(elements[i]).attr('href');
	console.log("PRODUCTO HREF: "+productLink);

	

		if (!openedProducts.includes(productLink)) {
			openedProducts.push(productLink);
	 		let nuevaVeentana = window.open(productLink);
	 		nuevaVeentana.test = function () {
        	return new Promise((resolve) => {
			
                try {
					
					//CADENA
					data_row.push("Carrefour");
					//SUCURSAL
	   				elementosSucursal = document.querySelector('div.vtex-store-drawer-0-x-drawerTriggerContainer');
	   				sucursal = elementosSucursal.textContent;
					console.log("SUCURSAL:"+sucursal);
	   				sucursalLugar = sucursal.split(":");
	   				//sucursalMod = sucursalLugar[1].trim();
	   				data_row.push(sucursal!== "SELECCIONÁ TIENDA" ?sucursalLugar[1].trim():" ");
					//FECHA
					data_row.push(fechaConSeparador);
					
					//CATEGORIA
					elementosCategoria = nuevaVeentana.document.querySelector('div.vtex-breadcrumb-1-x-container span.vtex-breadcrumb-1-x-arrow--3 a.vtex-breadcrumb-1-x-link');
					console.log("CATEGORIA "+elementosCategoria);
					categoria = elementosCategoria.textContent;
					console.log('la categoria: '+categoria);
					data_row.push(categoria);
					//SUBCATEGORIA
					data_row.push("");
					//MARCA
					data_row.push(products[i].item.brand.name);
					//DESCRIPCION
					data_row.push(prodName);
					//EAN		
                    const EAN = nuevaVeentana.document.querySelector('td.vtex-store-components-3-x-specificationItemSpecifications');
                    data_row.push(EAN.textContent);
					//PRECIO REGULAR
					data_row.push(price);
					//PRECIO PROMOCIONAL
					data_row.push(offerName_00);
					//PRECIO UNITARIO PROMOCIONAL
					data_row.push("");
					//PRECIO OFERTA
					data_row.push(offerName_01);
					//PRECIO POR UNIDAD DE MEDIDA
					if(unitDescrip === undefined){
						data_row.push(" ");
					}else{
						data_row.push(unitPrice);
					}
					//UNIDAD DE MEDIDA
					data_row.push(unidadDeMedida);
					//PRECIO ANTIGUO
					data_row.push(oldPrice);
					nuevaVeentana.window.close();
			        //console.log("ESTOY EN LA CONDICION");
			        flag = flag + 1;
		            resolve();
                  } catch (error) {
                    console.log(`An error occurred: ${error}`);
                    					//CADENA
					data_row.push("Carrefour");
					//SUCURSAL
	   				elementosSucursal = document.querySelector('div.vtex-store-drawer-0-x-drawerTriggerContainer');
	   				sucursal = elementosSucursal.textContent;
					console.log("SUCURSAL:"+sucursal);
	   				sucursalLugar = sucursal.split(":");
	   				//sucursalMod = sucursalLugar[1].trim();
	   				data_row.push(sucursal!== "SELECCIONÁ TIENDA" ?sucursalLugar[1].trim():" ");
					//FECHA
					data_row.push(fechaConSeparador);
					
					//CATEGORIA
					elementosCategoria = nuevaVeentana.document.querySelector('div.vtex-breadcrumb-1-x-container span.vtex-breadcrumb-1-x-arrow--3 a.vtex-breadcrumb-1-x-link');
					console.log("CATEGORIA "+elementosCategoria);
					categoria = elementosCategoria.textContent;
					console.log('la categoria: '+categoria);
					data_row.push(categoria);
					//SUBCATEGORIA
					data_row.push("");
					//MARCA
					data_row.push(products[i].item.brand.name);
					//DESCRIPCION
					data_row.push(prodName);
					//EAN		
                    data_row.push(" ");
					//PRECIO REGULAR
					data_row.push(price);
					//PRECIO PROMOCIONAL
					data_row.push(offerName_00);
					//PRECIO UNITARIO PROMOCIONAL
					data_row.push("");
					//PRECIO OFERTA
					data_row.push(offerName_01);
					//PRECIO POR UNIDAD DE MEDIDA
					if(unitDescrip === undefined){
						data_row.push(" ");
					}else{
						data_row.push(unitPrice);
					}
					//UNIDAD DE MEDIDA
					data_row.push(unidadDeMedida);
					//PRECIO ANTIGUO
					data_row.push(oldPrice);
				    nuevaVeentana.window.close();
			        console.log("ESTOY EN LA CONDICION");
			        flag = flag + 1
		            resolve();
                  }
		 });
	   };
	
    }
    await nuevaVeentana.test().then(() => {
	  console.log("ENTRE");
	  console.log("oferta en el lugar "+i+" "+offerName_00);        
      rows.push(data_row);
	  data_row = [];   
    } )}

	return new Promise((resolve) => {
		if (flag == products.length){
			resolve();
		}}).then(()=>{
			clickNext();
 		});

}
async function createFile () {
    await getInfo()
	csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(";")).join("\n");
	encodedUri = encodeURI(csvContent);
	link = document.createElement("a");
	link.setAttribute("href", encodedUri);
	link.id = linkId;
	var sucursalTitulo = sucursal!== "SELECCIONÁ TIENDA"?sucursalLugar[1].trim():"";
	var fileName = 'carrefour_'+ fechaConSeparador +'_'+ categoria +'_'+sucursalTitulo+'.csv';
	link.setAttribute("download", fileName);
	document.body.appendChild(link);
	link.click();
	$('#csv_link').remove();
}
