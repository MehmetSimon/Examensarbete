<?php

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

if(isset($_SESSION['email'])){
  $interface = $_SESSION['interface'];
  if($interface === ''){
    $interface = "1";
  }
  session_destroy();
  header("Location: index.php?interface=$interface");
}
 ?>
