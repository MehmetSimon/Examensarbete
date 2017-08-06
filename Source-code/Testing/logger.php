<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
date_default_timezone_set('Europe/Stockholm');



if(isset($_SESSION['filename']) && isset($_REQUEST['msg'])){
  $time = date('Y-m-d H:i:s');
  $logEntry = ".\n$time - ".$_REQUEST['msg'];
  try {
    file_put_contents('tests/'.$_SESSION['filename'].'.log', $logEntry, FILE_APPEND);
  }
  catch (Exception $e) {
      echo $e->getMessage();
  }
}


?>
