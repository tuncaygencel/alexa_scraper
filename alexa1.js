const puppeteer = require('puppeteer');


let site_id;
let site_name;
let result_json;

	//bir sonraki sitebilgilerini aliyor id ve url
	async function get_nextsite(){
		
			const browser = await puppeteer.launch();
			const page = await browser.newPage();
		
			//const response = await page.goto('http://localhost/scrapers/alexa/get_site_info.php');     
			//const json = JSON.parse(response);
			
			const axios = require('axios').default;
			
			await axios.post('http://localhost/scrapers/alexa/get_site_info.php', {}
			).then(function (response) {
				const json = response.data;
				site_id=json.id;
				site_name=json.site;
				
		  })
		  .catch(function (error) {
			console.log(error);
		  });
			
			
			console.log(site_id+'-'+site_name);
			
			await browser.close();
		
	}
	//site bilgilerinin gonderildigi fonksiyon
	async function save_site_info(){
		
		const browser = await puppeteer.launch();
		 
		const page = await browser.newPage();
		
		const axios = require('axios').default;
		
		console.log(result_json);
		
		const querystring = require('querystring');
		
		await axios.post('http://localhost/scrapers/alexa/save_site_info1.php', 
			querystring.stringify({site_id:site_id,site_name:site_name, result_json:JSON.stringify(result_json) })
			).then(function (response) {
			console.log(response.data);
			if(response.data=='okay'){
				setTimeout(function(){  start();   }, Math.floor(Math.random() * 10000));
			}
		  })
		  .catch(function (error) {
			console.log(error);
		  });
		
		await browser.close();
	}
	
	
	async function scrapealexa(){
		
		//const userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.50 Safari/537.36';
		
		const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36';
		
		
		const chromeOptions = {
			executablePath:'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe',
			headless:false,
			slowMo:10,
			defaultViewport: null
		};
		

		let url='https://www.alexa.com/siteinfo/'+site_name;
		
		console.log(url+' scrapping...');
		
		const browser = await puppeteer.launch({chromeOptions});
		
		const page = await browser.newPage();
		await page.setViewport({ width: 1440, height: 716});
		
		let return_value=await 1;
		
		try {
				await page.goto(url,{waitUntil: 'networkidle0'});
		} catch (ex) {
			
				await browser.close()
				console.log('IT FAILED')
				console.log(ex.toString())
				//throw ex
				
				return_value=await 0;
		}
		
		if(return_value==0){
			
			return 0;
			
		}
		
		const data = await page.evaluate( () => {
			
			let rank_selector='#card_rank > section.rank > div.rank-global > div:nth-child(1) > div > .big.data:not(.hash)';
			let rank;  //dunya siralamasi verisi;
			//rank verisi alinyor..
			if(document.querySelector(rank_selector) === null){	rank = '-'; }else{	
			
				rank = document.querySelector(rank_selector).innerText.replace("#", "").replace(/[\r\n]/g,""); 	
			
			}
			
			/////////////////////////////////////////
			let search_rate_selector='#card_mini_competitors > section.group > div:nth-child(2) > div.ThirdFull.ProgressNumberBar > span';
			let search_rate;  //aramadan gelen trafik oranini tutar;
			//search rating verisi alinyor..
			if(document.querySelector(search_rate_selector) === null){	search_rate = '-'; }else{	search_rate = document.querySelector(search_rate_selector).innerText.replace("%", "").replace(/[\r\n]/g,""); 	}
		
			/////////////////////////////////////////
			let daily_page_view_selector='#card_metrics > section.engagement > div.flex > div:nth-child(1) > .small.data';
			let daily_page_view;  //aramadan gelen trafik oranini tutar;
			//search rating verisi alinyor..
			if(document.querySelector(daily_page_view_selector) === null){	daily_page_view = '-'; }else{	
				
				if(document.querySelector(daily_page_view_selector + ' > span') !== null ){
					
					daily_page_view = document.querySelector(daily_page_view_selector).innerText.replace( document.querySelector(daily_page_view_selector + ' > span').innerText, "").replace(/[\r\n]/g,""); 	
				
				}else{
					
					daily_page_view = document.querySelector(daily_page_view_selector).innerText.replace(/[\r\n]/g,"");
					
				}
			}
		
			/////////////////////////////////////////
			let daily_time_selector='#card_metrics > section.engagement > div.flex > div:nth-child(2) > .small.data';
			let daily_time;  //aramadan gelen trafik oranini tutar;
			//search rating verisi alinyor..
			if(document.querySelector(daily_time_selector) === null){	daily_time = '-'; }else{ 
			
				if(document.querySelector(daily_time_selector + ' > span') !== null){
				
					daily_time = document.querySelector(daily_time_selector).innerText.replace(document.querySelector(daily_time_selector + ' > span').innerText, "").replace(/[\r\n]/g,""); 	
			
				}else{
					
					daily_time = document.querySelector(daily_time_selector).innerText.replace(/[\r\n]/g,""); 	
					
				}
			
			}
		
			/////////////////////////////////////////
			let bounce_rate_selector='#card_metrics > section.engagement > div.flex > div:nth-child(3) > .small.data';
			let bounce_rate;  //aramadan gelen trafik oranini tutar;
			//search rating verisi alinyor..
			if(document.querySelector(bounce_rate_selector) === null){	bounce_rate = '-'; }else{ 
			
				if(document.querySelector(bounce_rate_selector +' > span') !== null){
						
					bounce_rate = document.querySelector(bounce_rate_selector).innerText.replace(document.querySelector(bounce_rate_selector+' > span').innerText, "").replace("%","").replace(/[\r\n]/g,""); 	
					
				}else{
					
					bounce_rate = document.querySelector(bounce_rate_selector).innerText.replace("%","").replace(/[\r\n]/g,""); 	
					
				}
					
			}
		
			/////////////////////////////////////////
			let link_sites_in_selector='#card_mini_competitors > section.group > div:nth-child(8) > div.ThirdFull.thissite > span';
			let link_sites_in;  //aramadan gelen trafik oranini tutar;
			//search rating verisi alinyor..
			if(document.querySelector(link_sites_in_selector) === null){	link_sites_in = '-'; }else{ link_sites_in = document.querySelector(link_sites_in_selector).innerText.replace(/[\r\n]/g,""); 	}
		
			////////////similar sites aliniyor
			let similar_sites_selector='#card_mini_audience > section:nth-child(3) > section > div.Body > div.Row';
			let similar_sites=[];
			if(document.querySelectorAll(similar_sites_selector) !== null){	

				let similar_sites_divs=document.querySelectorAll(similar_sites_selector);

				for(i=0; i<similar_sites_divs.length; i++){
					
					similar_sites.push({  "site": similar_sites_divs[i].querySelector('.site  > a').innerText  , "overlap_score": similar_sites_divs[i].querySelector('.overlap > .truncation').innerText    });

				}

			}
		
			
			////////////top_keyword'ler aliniyor
			let top_keywords_selector='#card_topkeywords > section.table > div.Body > div.Row';
			let top_keywords=[];
			if(document.querySelectorAll(top_keywords_selector) !== null){	

				let top_keywords_selector_divs=document.querySelectorAll(top_keywords_selector);

				for(i=0; i<top_keywords_selector_divs.length; i++){
					
					top_keywords.push({  "word": top_keywords_selector_divs[i].querySelector('.keyword  > .truncation ').innerText  , "search_traffic": top_keywords_selector_divs[i].querySelector('.metric_one > .truncation').innerText.replace("%", "") , "share_of_voice": top_keywords_selector_divs[i].querySelector('.metric_two > .truncation').innerText.replace("%", "")  });

				}

			}
		
			////////////keyword gap lar aliniyor
			let keyword_gaps_selector='#card_gaps > section.table.fancymobile > div.Body > div.Row';
			let keyword_gaps=[];
			if(document.querySelectorAll(keyword_gaps_selector) !== null){	

				let keyword_gaps_selector_divs=document.querySelectorAll(keyword_gaps_selector);

				for(i=0; i<keyword_gaps_selector_divs.length; i++){
					
					keyword_gaps.push({  "word": keyword_gaps_selector_divs[i].querySelector('.keyword  > .truncation ').innerText  , "avg_traffic_to_competitors": keyword_gaps_selector_divs[i].querySelector('.metric_one > .truncation').innerText , "search_popularity": keyword_gaps_selector_divs[i].querySelector('.metric_two > .truncation ').innerText  });

				}

			}
			
			
			
			////////////geography lar aliniyor
			let geography_selector='#card_geography > div > section:nth-child(3) > section > div.visitorList > ul > li';
			let geography=[];
			if(document.querySelectorAll(geography_selector) !== null){	

				let geography_selector_divs=document.querySelectorAll(geography_selector);

				for(i=0; i<geography_selector_divs.length; i++){
					
					geography.push({  "country": geography_selector_divs[i].querySelector('#countryName ').innerText.substring(5)  ,"percent_of_share": geography_selector_divs[i].querySelector('#countryPercent').innerText.replace("%", "") });

				}

			}
		
				return {
					"rank":rank,
					"search_rate":search_rate,
					"daily_page_view":daily_page_view,
					"daily_time":daily_time,
					"bounce_rate":bounce_rate,
					"link_sites_in":link_sites_in,
					"similar_sites":similar_sites,
					"top_keywords":top_keywords,
					"keyword_gaps":keyword_gaps,
					"geography":geography
				};
			
		  });
		
		result_json= await data;
		 
		await browser.close();
		
		return 1;
		
	}
	

	
	
	//scrapesite(url);
	async function start(){
		
		await get_nextsite();
		
		let continue_op= await scrapealexa();
		
		if(continue_op==1){
		
			await save_site_info();
		
		}else{
		
			start();
	
		}
	}
	
	
	start();
	
	