<?php


			$host_name='localhost';
			$db='sites_analysis1';
			$db_user='root';
			$pass='';
			

			$db_conn=mysqli_connect($host_name,$db_user,$pass) or die("Bir hata oluştu!");
			mysqli_select_db($db_conn,$db) or die("Bir hata oluştu!");  
			mysqli_query($db_conn,"SET NAMES utf8");
			mysqli_query($db_conn,"SET CHARACTER SET utf8");
			mysqli_query($db_conn,"SET COLLATION_CONNECTION='utf8_general_ci'");  



			$sql='SELECT * FROM sites WHERE is_scrapped=0 ORDER BY id ASC LIMIT 1';

			$sql=mysqli_query($db_conn,$sql) or die(mysqli_error($db_conn));

			if(mysqli_num_rows($sql)>0){
				
				$res=mysqli_fetch_assoc($sql);
				echo '{"result":1, "id":'.$res['id'].', "site":"'.$res['site'].'"}';
				
			}else{
				
				echo '{"result":0}';
				
			}



?>