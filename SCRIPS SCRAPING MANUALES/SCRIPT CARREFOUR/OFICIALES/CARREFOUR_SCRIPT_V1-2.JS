$('html').animate({ scrollTop: 10}, 100);

// optionals values
var rows = [['OFFER 00','OFFER 01','BRAND','NAME','PRICE', 'OLD PRICE', 'PRICE BY UNIT']];
var fileName = 'my_data.csv';
var linkId = 'csv_link';
var scroll_speed = 4000;
var delay = 4000;
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
	getInfo();
	clickNext();
	
	if(currentPage >= totalPages){
		console.log('*****************');
    	console.log('scraping complete');
		console.log('*****************');
		createFile();
		return;
	}
	
	setTimeout(()=> start(), delay);
}

//function scrollPage(scroll_speed, callback){
	//$('html').animate({ scrollTop: $('.valtech-carrefourar-search-result-0-x-paginationButtonPages').offset().top -500}, scroll_speed, 'linear', callback);
//}

function scrollPage(scroll_speed, callback){
	var $element = $('.valtech-carrefourar-search-result-0-x-paginationButtonPages');
	
	if ($element.length > 0) {
	  $('html').animate({ scrollTop: $element.offset().top - 500}, scroll_speed, 'linear', callback);
	} else {
	  console.error('El elemento no existe.');
	}
  }
  
function clickNext(){	
    var parentButtons = $('div.vtex-flex-layout-0-x-flexColChild').parent();
    var lastPagination = $('div.valtech-carrefourar-search-result-0-x-paginationButtonPages:last', parentButtons);
    var lastButtonContext = $(lastPagination).next();
    var nextButton = $('button', lastButtonContext)[0]
    
    if(nextButton != undefined){
        nextButton.click();
		
		console.log("Cantidad de paginas= "+totalPages);

    }
	
	currentPage++;
}

function getInfo(){
	var rawData = $('script', '.render-provider')[0].innerHTML
	    .replaceAll('&amp;','&')
	    .replaceAll('&apos;','\'');
	var products = JSON.parse(rawData).itemListElement;
    var prodContainer = $('.valtech-carrefourar-search-result-0-x-gallery');
    var productsList = '';  
    
    for (let i = 0; i < products.length; i++) {
      productsList = $('.valtech-carrefourar-search-result-0-x-galleryItem', prodContainer)[i];
	  var offerName_00 = $('span.valtech-carrefourar-product-highlights-0-x-productHighlightText span.tooltipText', productsList)[0]?.innerText;
      var offerName_01 = $('span.valtech-carrefourar-product-price-0-x-sellingPriceValue span.valtech-carrefourar-product-price-0-x-discountPercentage', productsList)[0]?.innerText;
	  var prodName = $('span.vtex-product-summary-2-x-productBrand', productsList)[0]?.innerText;
	  var price = $('span.valtech-carrefourar-product-price-0-x-sellingPriceValue span.valtech-carrefourar-product-price-0-x-currencyContainer', productsList)[0]?.innerText; 
	  var oldPrice = $('div.vtex-flex-layout-0-x-flexCol div:nth-of-type(2) span.valtech-carrefourar-product-price-0-x-listPriceValue span.valtech-carrefourar-product-price-0-x-currencyContainer', productsList)[0]?.innerText;
      var unitDescrip = $('span.valtech-carrefourar-dynamic-weight-price-0-x-unit', productsList)[0]?.innerText;
      var unitPrice = $('span.valtech-carrefourar-dynamic-weight-price-0-x-currencyContainer', productsList)[0]?.innerText + " x "+ unitDescrip;
	  

	  data_row.push(offerName_00);
      data_row.push(offerName_01);
	  data_row.push(products[i].item.brand.name);
      data_row.push(prodName);            
	  data_row.push(price);
	  data_row.push(oldPrice);
		if(unitDescrip === undefined){
			data_row.push(" ");
		}else{
			data_row.push(unitPrice);
		}
      rows.push(data_row);
	  data_row = [];   
    } 
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