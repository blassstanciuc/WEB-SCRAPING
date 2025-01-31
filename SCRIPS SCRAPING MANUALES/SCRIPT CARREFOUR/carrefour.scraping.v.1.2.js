$('html').animate({ scrollTop: 10}, 100);

// optionals values
var rows = [['EANS','OFFER 00','OFFER 01','BRAND','NAME','PRICE', 'OLD PRICE', 'PRICE BY UNIT']];
var fileName = 'my_data.csv';
var linkId = 'csv_link';
var scroll_speed = 2000;
var delay = 2000;
//-----------------
var totalProducts = $('div.lyracons-search-result-1-x-totalProducts--layout > span:first-child').contents()[0]?.nodeValue.trim();
var productsPerPage = 16;
var cont = 0;
var currentPage = 0;
var totalPages = Math.ceil(totalProducts / productsPerPage);
var prodContainer =  $('.lyracons-search-result-1-x-gallery', '.vtex-flex-layout-0-x-flexRow--galleyProducts');
var productsList = $('.lyracons-search-result-1-x-galleryItem', prodContainer);
var firstProd = $('.lyracons-search-result-1-x-galleryItem', prodContainer)[0];
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
	getInfo();
	//clickNext();
	
	if(currentPage >= totalPages){
		console.log('*****************');
    	console.log('scraping complete');
		console.log('*****************');
		setTimeout(createFile, 20000);
		return;
	}
	
	setTimeout(()=> start(), delay);
}

function scrollPage(scroll_speed, callback){
	$('html').animate({ scrollTop: $('.lyracons-search-result-1-x-paginationButtonPages').offset().top -500}, scroll_speed, 'linear', callback);
}

function clickNext(){	
    var parentButtons = $('div.lyracons-search-result-1-x-paginationButtonChangePage').parent();
    var lastPagination = $('div.lyracons-search-result-1-x-paginationButtonPages:last', parentButtons);
    var lastButtonContext = $(lastPagination).next();
    var nextButton = $('button', lastButtonContext)[0]; 
    
    if(nextButton != undefined){
        nextButton.click();
    }
	
	currentPage++;
}

function getInfo(){
	var rawData = $('script', '.render-provider')[0].innerHTML
	    .replaceAll('&amp;','&')
	    .replaceAll('&apos;','\'');
	var products = JSON.parse(rawData).itemListElement;
    var prodContainer = $('.lyracons-search-result-1-x-gallery', '.vtex-flex-layout-0-x-flexRow--galleyProducts');
    var productsList = '';  

    for (let i = 0; i < products.length; i++) {
		console.log(productsList[i])
      productsList = $('.lyracons-search-result-1-x-galleryItem', prodContainer)[i];
      var offerName_00 = $('lyracons-carrefourarg-product-highlights-4-x-productHighlightText span.tooltipText', productsList)[0]?.innerText;
      var offerName_01 = $('div.vtex-flex-layout-0-x-flexRowContent--rowRibbons span.vtex-product-specifications-1-x-specificationValue', productsList)[0]?.innerText;
	  var prodName = $('span.vtex-product-summary-2-x-productBrand', productsList)[0]?.innerText;
	  var price = $('span.lyracons-carrefourarg-product-price-1-x-sellingPriceValue span.lyracons-carrefourarg-product-price-1-x-currencyContainer', productsList)[0]?.innerText;  
	  var oldPrice = $('span.lyracons-carrefourarg-product-price-1-x-listPriceValue span.lyracons-carrefourarg-product-price-1-x-currencyContainer', productsList)[0]?.innerText;
      var unitPrice = $('.lyracons-dynamic-weight-price-0-x-container', productsList)[0]?.innerText.replace('\n',' x ');
	  //let elements = $('div.lyracons-search-result-1-x-galleryItem section.vtex-product-summary-2-x-container a.vtex-product-summary-2-x-clearLink--contentProduct', productsList)[0]?.innerText;
	 let elements = document.querySelectorAll('div.lyracons-search-result-1-x-galleryItem section.vtex-product-summary-2-x-container a.vtex-product-summary-2-x-clearLink--contentProduct');

	 //agregado al original
	 let nuevaVeentana = window.open($(elements[i]).attr('href'));
	 nuevaVeentana.test = function () {
	   return new Promise((resolve) => {
		 nuevaVeentana.addEventListener('load', () => {
		   // Obtener el elemento td con la clase especificada
		   const specificationItem = nuevaVeentana.document.querySelector('td.vtex-store-components-3-x-specificationItemSpecifications');
		   data_row.push(specificationItem.textContent);
		   console.log(specificationItem.textContent);
		   resolve();
		 });
	   });
		
    }

	  nuevaVeentana.test().then(() => {
	  data_row.push(offerName_00);
      data_row.push(offerName_01);
	  data_row.push(products[i].item.brand.name);
      data_row.push(prodName);            
	  data_row.push(price);
	  data_row.push(oldPrice);
	  data_row.push(unitPrice);
      rows.push(data_row);
	  data_row = [];   
    } )}
	clicknext();
}

function createFile () {
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



