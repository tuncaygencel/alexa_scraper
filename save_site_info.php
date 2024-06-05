<?php

	if(!isset($_POST['site_id']) or !isset($_POST['site_name']) or !isset($_POST['result_json']) ){
		
		die('veri transfet hatasi');
		
	}

	$site_id=trim($_POST['site_id']);
	$site_name=trim($_POST['site_name']);
	
	$result_json=json_decode(trim($_POST['result_json']), true);
	
			$host_name='localhost';
			$db='sites_analysis1';
			$db_user='root';
			$pass='';
			

			$db_conn=mysqli_connect($host_name,$db_user,$pass) or die("Bir hata oluþtu!");
			mysqli_select_db($db_conn,$db) or die("Bir hata oluþtu!");  
			mysqli_query($db_conn,"SET NAMES utf8");
			mysqli_query($db_conn,"SET CHARACTER SET utf8");
			mysqli_query($db_conn,"SET COLLATION_CONNECTION='utf8_general_ci'"); 

			
			///similar sites insert
			
			foreach($result_json['similar_sites'] as  $smsites){
				
				$sql='INSERT INTO alexa_similar_sites(site_id, similar_site,overlap_score) 
				VALUES('.$site_id.', "'.trim($smsites['site']).'", "'.$smsites['overlap_score'].'" )';
				$sql=mysqli_query($db_conn,$sql) or die(mysqli_error($db_conn));

			}

			///top_keywords insert
			
			foreach($result_json['top_keywords'] as  $top_keywords){
				
				$sql='INSERT INTO alexa_search_words(site_id, word,search_traffic,share_of_voice) 
				VALUES('.$site_id.', "'.mysqli_real_escape_string($db_conn, $top_keywords['word']).'", "'.$top_keywords['search_traffic'].'", "'.$top_keywords['share_of_voice'].'" )';
				$sql=mysqli_query($db_conn,$sql) or die(mysqli_error($db_conn));

			}

			//insert keywordgaps
			
			foreach($result_json['keyword_gaps'] as  $keywordgaps){
				
				$sql='INSERT INTO alexa_keyword_gap(site_id, word,avg_traffic_to_competitors,search_popularity) 
				VALUES('.$site_id.', "'.mysqli_real_escape_string($db_conn, $keywordgaps['word']).'", "'.((float)$keywordgaps['avg_traffic_to_competitors']).'", "'.((float)$keywordgaps['search_popularity']).'" )';
				$sql=mysqli_query($db_conn,$sql) or die(mysqli_error($db_conn));

			}

			///insert  alexa_geography
			
			foreach($result_json['geography'] as  $geography){
				
				$sql='INSERT INTO alexa_geography(site_id, country, percent_of_share) 
				VALUES('.$site_id.', "'.$geography['country'].'", "'.$geography['percent_of_share'].'" )';
				$sql=mysqli_query($db_conn,$sql) or die(mysqli_error($db_conn));

			}
			
			//insert rank vb
			if($result_json['rank']!='-'){
				$sql='INSERT INTO alexa_rank(site_id, rank, search_rate, daily_page_view, daily_time, bounce_rate, link_sites_in) 
				VALUES('.$site_id.', "'.trim(str_replace(",","",$result_json['rank'])).'", "'.trim(($result_json['search_rate']=="" or $result_json['search_rate']=="-") ? 0 : $result_json['search_rate']).'", "'.trim($result_json['daily_page_view']=="-" ? 0 : $result_json['daily_page_view']).'"
				, "'.trim($result_json['daily_time']).'", "'.trim($result_json['bounce_rate']=="-" ? 0 : $result_json['bounce_rate'] ).'", "'.trim($result_json['link_sites_in']).'" )';
				$sql=mysqli_query($db_conn,$sql) or die(mysqli_error($db_conn));
			}
			
			
			$sql="UPDATE sites SET is_scrapped=1 WHERE id=".$site_id." LIMIT 1";
			$sql=mysqli_query($db_conn,$sql) or die(mysqli_error($db_conn));
			
			echo "okay";
			
			
			
			



?>