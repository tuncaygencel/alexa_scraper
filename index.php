<style>

	table tr td{
		padding: 0.5em;
		border: 1px solid #a5a5a5;
		color: #505050;
		font-weight: bold;
		font-family: arial;
	}

</style>


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

if(isset($_GET['page'])){
	
	$page=trim((int)$_GET['page']);
	
}else{
	
	$page=1;
	
}

$result_per_page=100;
$start_from=($page-1)*$result_per_page;



$sql="SELECT sites.site,alexa_rank.* 
			FROM alexa_rank 
	
	LEFT JOIN sites ON sites.id=alexa_rank.site_id 
	
	WHERE rank<30000 and search_rate>70 and link_int<1000 
	
	ORDER BY rank ASC LIMIT ".$start_from.",".$result_per_page;
	
	
	$sql=mysqli_query($db_conn,$sql) or die(mysqli_error($db_conn));
	?>
		<table border=1 style="border-spacing: 0;">
			<tbody>
			<tr><td>#</td><td>Site</td><td>site_id</td><td>rank</td><td>search_rate</td>
			<td>daily_page_view</td><td>daily_time</td><td>bounce_rate</td><td>link_sites_in</td><td>link_int</td></tr>
	<?php
	
	$i=$start_from+1;
	
	if($page<2){
		
		echo '<a href="index.php?page=2" >Sonraki</a>';
		
	}else{
		
		echo '<a class="page_link" href="index.php?page='.($page-1).'" >Onceki</a>&nbsp;&nbsp;';
		echo '<a class="page_link" href="index.php?page='.($page+1).'" >Sonraki</a>';
	}
	
	while($res=mysqli_fetch_assoc($sql)){
		
		echo "<tr><td>".$i."</td><td><a class=\"site_link\" href=\"http://".$res['site']."\" target=\"_blank\">".$res['site']."</a> </td><td>".$res['site_id']."</td><td>".$res['rank']."</td><td>".$res['search_rate']."</td>
			<td>".$res['daily_page_view']."</td><td>".$res['daily_time']."</td><td>".$res['bounce_rate']."</td><td>".$res['link_sites_in']."</td>
			<td>".$res['link_int']."</td></tr>";
			
			$i++;
	}
	?>
		</tbody>
		</table>
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	