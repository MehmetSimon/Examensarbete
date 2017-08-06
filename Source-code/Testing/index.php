<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

if(isset($_REQUEST['view'])){
  $filenames = scandir(__DIR__.'/tests');
  $html = '';
  foreach($filenames as $filename){
    $name = substr($filename, 0, -4);
    $interface = substr($filename,10,1);
    if(strlen($name) > 2){
      $html .= '<a href="?interface='.$interface.'&load='.$name.'" target="_blank">Open config</a> - <a href="tests/'.$filename.'" target="_blank">View log</a> - '.$name.'<br/>';
    }
  }
  if($html === ''){
    $html .= 'There are nothing here.';
  }

  die($html);
}

if(isset($_REQUEST['load']) && isset($_REQUEST['interface'])){
  $_SESSION['filename'] = $_REQUEST['load'];
  $_SESSION['activeTest'] = false;
  $_SESSION['name'] = $_SESSION['filename'];
  $_SESSION['email'] = "check log";
  $_SESSION['startTime'] = '<a href="../Testing/tests/'.$_SESSION['filename'].'.log">check log</a>';
  $_SESSION['endTime'] = '<a href="../Testing/tests/'.$_SESSION['filename'].'.log">check log</a>';
  $_SESSION['interface'] = $_REQUEST['interface'];
  header("Location: ../Interface-".$_REQUEST['interface']);
}

$interface = "1";
if(isset($_REQUEST['interface'])){
  $interface = $_REQUEST['interface'];
}

if(isset($_SESSION['email'])){
	echo 'Hi <strong>'.$_SESSION['name'].'</strong>, you are still logged in as <strong>'.$_SESSION['email'].'.</strong><br/></br>
	Please <a href="logout.php">logout</a> to register a new test subject.';
	die();
}

?>

<!--
	Author: W3layouts
	Author URL: http://w3layouts.com
	License: Creative Commons Attribution 3.0 Unported
	License URL: http://creativecommons.org/licenses/by/3.0/
-->
<!DOCTYPE html>
<html>
<head>
<title>Flat Sign Up Form Responsive Widget Template| Home :: W3layouts</title>
<!-- Meta tag Keywords -->
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="keywords" content="Flat Sign Up Form Responsive Widget Template, Bootstrap Web Templates, Flat Web Templates, Android Compatible web template,
Smartphone Compatible web template, free webdesigns for Nokia, Samsung, LG, SonyEricsson, Motorola web design" />
<script type="application/x-javascript"> addEventListener("load", function() { setTimeout(hideURLbar, 0); }, false);
function hideURLbar(){ window.scrollTo(0,1); } </script>
<!-- Meta tag Keywords -->
<!-- css files -->
<link href="css/style.css" rel="stylesheet" type="text/css" media="all">
<link href="css/font-awesome.min.css" rel="stylesheet" type="text/css" media="all">
<!-- //css files -->
<!-- online-fonts -->
<link href='//fonts.googleapis.com/css?family=Lato:400,100,100italic,300,300italic,400italic,700,700italic,900,900italic' rel='stylesheet' type='text/css'><link href='//fonts.googleapis.com/css?family=Raleway+Dots' rel='stylesheet' type='text/css'>
</head>
<body>
<!--header-->
	<div class="header-w3l">
		<h1>Test User Interface <?php echo $interface;?></h1>
	</div>
<!--//header-->
<!--main-->
<div class="main-agileits">
	<h2 class="sub-head">Sign Up</h2>
		<div class="sub-main">
			<form action="register.php" method="post">
				<input placeholder="Name" name="name" class="name" type="text" required="">
					<span class="icon1"><i class="fa fa-user" aria-hidden="true"></i></span><br>
				<input placeholder="Email" name="email" class="mail" type="text" required="">
					<span class="icon2"><i class="fa fa-envelope" aria-hidden="true"></i></span><br>
					<input type="hidden" name="start">
					<input id="interface" type="hidden" name="interface" value="<?php echo $interface;?>">
				<input type="submit" value="Start testing">
			</form>
		</div>
		<div class="clear"></div>
</div>
<!--//main-->

<!--footer-->
<div class="footer-w3">
	<p>&copy; 2016 Flat Sign Up Form . All rights reserved | Design by <a href="http://w3layouts.com">W3layouts</a><br>
    <a href="?interface=1">Interface 1</a> &nbsp;&nbsp; - &nbsp;&nbsp;  <a href="?view" target="_blank">Admin</a> &nbsp;&nbsp; - &nbsp;&nbsp; <a href="?interface=2">Interface 2</a>
  </p>
</div>
<!--//footer-->

</body>
</html>
