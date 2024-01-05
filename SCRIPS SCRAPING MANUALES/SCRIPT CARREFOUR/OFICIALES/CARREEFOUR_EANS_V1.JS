$('html').animate({ scrollTop: 10}, 100);

// optionals values
var rows = [['EANS','NOMBRE']];
var fileName = 'my_data.csv';
var linkId = 'csv_link';
var scroll_speed = 2000;
var delay = 2000;
var openedProducts = [];
let flag = 0;
//-----------------
var totalProducts = $('div.valtech-carrefourar-search-result-0-x-totalProducts--layout > span:first-child').contents()[0]?.nodeValue.trim();
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
			spinner_flag = $('.vtex__icon-spinner').length;
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
	var $element = $('.valtech-carrefourar-search-result-0-x-paginationButtonPages');
	
	if ($element.length > 0) {
	  $('html').animate({ scrollTop: $element.offset().top - 500}, scroll_speed, 'linear', callback);
	} else {
	  console.error('El elemento no existe.');
	}
  }
  
function clickNext(){	
    var parentButtons = $('div.valtech-carrefourar-search-result-0-x-paginationButtonChangePage').parent();
    var lastPagination = $('div.valtech-carrefourar-search-result-0-x-paginationButtonPages:last', parentButtons);
    var lastButtonContext = $(lastPagination).next();
    var nextButton = $('button', lastButtonContext)[0]
    
    if(nextButton != undefined){
        nextButton.click();
		console.log("Cantidad de paginas= "+totalPages);
		flag=0;
    }
	
	currentPage++;
}

async function getInfo(){
	var rawData = $('script', '.render-provider')[0].innerHTML
	    .replaceAll('&amp;','&')
	    .replaceAll('&apos;','\'');
	var products = JSON.parse(rawData).itemListElement;
    var prodContainer = $('span.lyracons-search-result-1-x-gallery', '.vtex-flex-layout-0-x-flexRow--galleyProducts');
    var productsList = '';  
    for (let i = 0; i < products.length; i++) {
      productsList = $('.lyracons-search-result-1-x-galleryItem', prodContainer)[i];
	  var offerName_00 = $('span.valtech-carrefourar-product-highlights-0-x-productHighlightText span.tooltipText', productsList)[0]?.innerText;
	  if(offerName_00 === undefined){
		offerName_00 = "default value"; // o simplemente no agregues la variable al array
	} 
	  var offerName_01 = $('div.vtex-flex-layout-0-x-flexRowContent--rowRibbons span.vtex-product-specifications-1-x-specificationValue', productsList)[i]?.innerText;
	  var prodName = $('span.vtex-product-summary-2-x-brandName', productsList)[i]?.innerText;
	  var price = $('span.lyracons-carrefourarg-product-price-1-x-sellingPriceValue span.lyracons-carrefourarg-product-price-1-x-currencyContainer', productsList)[i]?.innerText;  
	  var oldPrice = $('span.lyracons-carrefourarg-product-price-1-x-listPriceValue span.lyracons-carrefourarg-product-price-1-x-currencyContainer', productsList)[i]?.innerText;
      var unitPrice = $('span.valtech-carrefourar-dynamic-weight-price-0-x-currencyContainer', productsList)[0]?.innerText.replace('\n',' x ');
	  
	  //let oldPrice = document.querySelectorAll('span.lyracons-carrefourarg-product-price-1-x-listPriceValue span.lyracons-carrefourarg-product-price-1-x-currencyContainer');
	  //let offerName_00 = document.querySelectorAll('span.lyracons-carrefourarg-product-highlights-4-x-productHighlightText span.tooltipText');
	  let elements = document.querySelectorAll('div.valtech-carrefourar-search-result-0-x-galleryItem section.vtex-product-summary-2-x-container a.vtex-product-summary-2-x-clearLink--contentProduct');
	  let productLink = $(elements[i]).attr('href');
		console.log("PRODUCTO HREF: "+productLink);
		if (!openedProducts.includes(productLink)) {
			openedProducts.push(productLink);
	 		let nuevaVeentana = window.open(productLink);
	 		nuevaVeentana.test = function () {
        	return new Promise((resolve) => {
			nuevaVeentana.addEventListener('load', () => {
                try {
                    const specificationItem = nuevaVeentana.document.querySelector('td.vtex-store-components-3-x-specificationItemSpecifications');
                    data_row.push(specificationItem.textContent);
					nuevaVeentana.window.close();
			        console.log("ESTOY EN LA CONDICION CON ENLACE");
					console.log("hay de flgs: "+ flag + " Y de productos: " + products.length);
			        flag = flag + 1;
		            resolve();
                  } catch (error) {
                    console.log(`An error occurred: ${error}`);
                    data_row.push("no tiene");
				    nuevaVeentana.window.close();
			        console.log("ESTOY EN LA CONDICION sin enlace");
			        flag = flag + 1
					console.log("hay de flgs: "+ flag + " Y de productos: " + products.length);
		            resolve();
                  }
		 });
	   });
    }
    await nuevaVeentana.test().then(() => {
	  console.log("ENTRE");
	  console.log("oferta en eel lugar "+i+" "+offerName_00);

		//data_row.push(offerName_00);
      	//data_row.push(offerName_01);
	  	//data_row.push(products[i].item.brand.name);
      	data_row.push(prodName);            
	  	//data_row.push(price);
	  	//data_row.push(oldPrice);
	  	//data_row.push(unitPrice);
        rows.push(data_row);
	  data_row = [];   
	  
    } )}
}
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
	link.setAttribute("download", fileName);
	document.body.appendChild(link);
	link.click();
	$('#csv_link').remove();
}
