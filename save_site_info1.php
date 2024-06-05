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
			

			$db_conn=mysqli_connect($host_name,$db_user,$pass) or die("Bir hata oluştu!");
			mysqli_select_db($db_conn,$db) or die("Bir hata oluştu!");  
			mysqli_query($db_conn,"SET NAMES utf8");
			mysqli_query($db_conn,"SET CHARACTER SET utf8");
			mysqli_query($db_conn,"SET COLLATION_CONNECTION='utf8_general_ci'"); 

			
			///similar sites insert
			
			foreach($result_json['similar_sites'] as  $smsites){
				
				$sql='INSERT INTO alexa_similar_sites(site_id, similar_site,overlap_score) 
				VALUES('.$site_id.', "'.$smsites['site'].'", "'.$smsites['overlap_score'].'" )';
				$sql=mysqli_query($db_conn,$sql) or die(mysqli_error($db_conn));

			}

			
			
			$sql="UPDATE sites SET is_scrapped=1 WHERE id=".$site_id." LIMIT 1";
			$sql=mysqli_query($db_conn,$sql) or die(mysqli_error($db_conn));
			
			echo "okay";
			
			
			
			



?>