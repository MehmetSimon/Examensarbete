<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
date_default_timezone_set('Europe/Stockholm');
 ?><!DOCTYPE html>
<html>

  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=1920, initial-scale=1.0">
    <title>Interface 2</title>
<!-- CDN -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap-theme.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/material-design-icons/3.0.1/iconfont/material-icons.min.css">

<!-- downloaded CDN files (fonts missing for the icons...)--><!--
    <link rel="stylesheet" href="assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/css/bootstrap-theme.min.css">
    <link rel="stylesheet" href="assets/css/font-awesome.min.css">
    <link rel="stylesheet" href="assets/css/material-icons.min.css">
-->
    <link rel="stylesheet" href="assets/css/styles.css">
    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
  </head>

  <body>
    <!-- Top menu navigation -->
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
          <a class="navbar-brand navbar-link" href="#"> <img src="assets/img/axis_logo_color.svg" style="width:74px;"></a>
          <button class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navcol-1"><span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button>
        </div>
        <div class="collapse navbar-collapse" id="navcol-1">
          <ul class="nav nav-pills" id="menu-configs">
            <li class="active insertBeforeMe" data-id="new"><a href="#"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span> New config</a></li>
          </ul>
          <ul class="nav navbar-nav" style="float:right;">
            <li role="presentation">
              <a href="#">
                <i class="glyphicon glyphicon-map-marker" style="float:left;font-size:20px;margin-right:6px;padding:5px;"></i>
                <p style="float:left;padding:5px;">Test-Site </p>
              </a>
            </li>
            <li role="presentation">
              <a href="#">
                <button class="btn btn-default not_implemented" type="button" style="padding:5px;">Change site</button>
              </a>
            </li>
            <?php
            // If a test session is running, show this two list elements.
            if(isset($_SESSION['name'])){
              $startTime = $_SESSION['startTime'];
              if(is_long($_SESSION['startTime'])){
                $startTime = date('H:i:s',$_SESSION['startTime']);
              }
              $endTime = '';
              $display_button_end = "initial";
              $display_button_logout = "none";
              if(isset($_SESSION['endTime'])){
                $endTime = $_SESSION['endTime'];
                if(is_long($_SESSION['endTime'])){
                $endTime = date('H:i:s',$_SESSION['endTime']);
                }
                $display_button_end = "none";
                $display_button_logout = "initial";
              }
              echo '<li id="testingStrings">Testing as <span class="name">'.$_SESSION['name'].'</span><br/>Start: <span class="start">'.$startTime.'</span><br>End: <span class="end">'.$endTime.'</span></li>
              <li role="presentation" id="endTest" style="display:'.$display_button_end.';">
                <a href="#">
                  <button class="btn btn-danger" type="button" style="padding:5px;">End this test session!</button>
                </a>
              </li>
              <li role="presentation" id="endTestLogout" style="display:'.$display_button_logout.';">
                <a href="../Testing/logout.php">
                  <button class="btn btn-danger" type="button" style="padding:5px;">Logout</button>
                </a>
              </li>';
            }
            ?>
          </ul>
        </div>
      </div>
    </nav>
    <div class="container" style="width:100%;">
      <div class="row">
        <div class="col-md-2 local-config-navigation">
          <h3>Fast navigation</h3>
          <div class="just-padding">
            <div class="list-group list-group-root well">

              <a href="#" class="list-group-item headline">Config overview</a>
              <div class="list-group">
                <a href="#" class="list-group-item" data-page="overview">Overview</a>
              </div>

              <a href="#" class="list-group-item headline">Scenario</a>
              <div class="list-group">
                <a href="#" class="list-group-item" data-page="scenario">Load or create new</a>
              </div>

              <a href="#" class="list-group-item headline">Trigger</a>
              <div class="list-group">
                <a href="#" class="list-group-item" data-page="trigger" data-lvl="0">Select trigger(s)</a>
                <a href="#" class="list-group-item" data-page="trigger" data-lvl="1">Trigger grouping</a>
              </div>

              <a href="#" class="list-group-item headline">Action</a>
              <div class="list-group">
                <a href="#" class="list-group-item" data-page="action">Select actions</a>
              </div>

              <a href="#" class="list-group-item headline">Relation</a>
              <div class="list-group">
                <a href="#" class="list-group-item" data-page="relation">Combine triggers with actions</a>
              </div>
            </div><!-- ./list-group-root -->
          </div><!-- ./just-padding -->
        </div><!-- ./local-config-navigation -->

        <div class="col-md-8 main-window">
          <div class="container">
            <div class="row">
              <div class="col-mg-12">
                <div id="main_config" data-page="none">
                </div>
              </div>
            </div> <!-- ./row -->
          </div><!-- ./container -->
        </div>
        <div class="col-md-2">
          <!-- Nothing at the moment -->
        </div>
      </div>
    </div>

<!-- CDN
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>
-->
<!-- Downloaded CDN files-->
    <!-- version 1.12.4 -->
    <script src="assets/js/jquery.min.js"></script>

     <!-- version 3.3.7-->
     <script src="assets/js/bootstrap.min.js"></script>

    <!--version 1.12.1 -->
    <script src="assets/js/jquery-ui.min.js"></script>

    <!-- custom made js file -->
    <script src="assets/js/custom.js"></script>

    <!-- downloaded from: https://notifyjs.com/ -->
    <!-- https://rawgit.com/notifyjs/notifyjs/master/dist/notify.js -->
    <script src="assets/js/notify.min.js"></script>

    <?php if(isset($_SESSION['name'])){ ?>
      <!-- Script used for the test -->
      <script src="../Testing/testing.js"></script>
    <?php }?>

  </body>
</html>
