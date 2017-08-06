<?php require_once('builder.php');
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
date_default_timezone_set('Europe/Stockholm');
?>
<!DOCTYPE html>
<html>

  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=1920, initial-scale=1.0">
    <title>Interface 1</title>
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
    <link rel="stylesheet" href="assets/css/custom_switch.css">
    <link rel="stylesheet" href="assets/css/styles.css">
    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
  </head>

  <body>
    <div id="device-icon-list">
      <?php echo getallIcons(); ?>
    </div>
    <!-- Top menu navigation -->
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
          <a class="navbar-brand navbar-link" href="#"> <img src="assets/img/axis_logo_color.svg" style="width:74px;"></a>
          <button class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navcol-1"><span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button>
        </div>
        <div class="collapse navbar-collapse" id="navcol-1">
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
        <!-- Left side main menu wrapper-->
        <div id="main_menu_wrapper">
          <div class="col-lg-2 col-md-3 col-sm-3 main-menu-column" >
            <div class="tabbable">
              <ul class="nav nav-pills nav-stacked" style="border-right:1px solid #DCDCDC;" id="main_menu">
                <h3>Configurations</h3>
                <li data-id="new">
                  <a href="#" data-toggle="tab" id="config-new">
                    <?php _getIcon("plus") ?>
                    Create new
                  </a>
                </li>
                <hr>
                <!-- #PLACEHOLDER menu items-->
                <span class="insertBeforeMe"></span>
                <hr>
                <li data-id="template-manager" class="not_implemented">
                  <a href="#" data-toggle="tab" id="goTemplateManager">
                    Template Manager
                    <?php _getIcon('menu-right'); ?>
                  </a>
                </li>
                <li class="simple-mode" data-id="advanced"> <!-- Show advanced tab, the class indicates when to show this tab-->
                  <a href="#" data-toggle="tab" id="goAdvanced">
                    Show Advanced
                      <?php _getIcon('menu-right'); ?>
                  </a>
                </li>
                <li class="advanced-mode" data-id="simple"><!-- Show simple tab, the class indicates when to show this tab-->
                  <a href="#" data-toggle="tab" id="goSimple">
                    Show Simple
                    <?php _getIcon('menu-right'); ?>
                  </a>
                </li>
              </ul>
            </div><!-- ./tabbable -->
          </div><!-- ./main-menu-column -->
        </div><!-- #/main_menu_wrapper -->

        <!-- Main configuration wrapper -->
        <div id="config_div">
          <div id="unique-config-id" data-id=""></div>
          <div class="col-lg-10 col-md-9 col-sm-8">

            <!-- Content head and title -->
            <div class="row" style="margin-bottom:25px;">
              <!-- Main title wrapper -->
              <div class="col-lg-4 col-lg-offset-4 col-lg-push-0 col-lg-pull-1 col-md-4
              col-md-offset-4 col-md-push-0 col-md-pull-0 col-sm-3 col-sm-offset-3
              col-sm-push-0 col-sm-pull-0 col-xs-4 col-xs-offset-4 col-xs-push-2 col-xs-pull-0">
                <div id="config-name"><h1 class="text-center">New Config</h1></div>
                <div id="template-manager-name"><h1 class="text-center">Template Manager</h1></div>
              </div><!-- END OF: Main title wrapper -->
              <!-- Save/Delete buttons div wrapper -->
              <div class="col-lg-4 col-lg-push-0 col-md-4 col-md-push-0 col-sm-6 col-sm-push-0 col-xs-4 col-xs-push-0">
                <div class="btn-group" role="group" style="float:right;margin-top:20px;margin-bottom:10px;">
                  <button class="btn btn-danger" type="button" id="delete-config">
                    <?php _getIcon('trash'); ?> Delete
                  </button>
                  <button class="btn btn-success" type="button" id="save-config">
                    <?php _getIcon('save'); ?> Save
                  </button>
                </div><!-- ./btn-group-->
              </div><!-- END OF: Save/Delete buttons div wrapper -->
            </div><!-- END OF: Content head and title -->

            <!-- Main content view-->
            <div class="row">
              <!-- Page for the advanced mode only -->
              <div id="advanced-main-view" class="advanced-mode col-lg-12">
                <!-- Devices Box -->
                <div class="row">
                  <div class="col-lg-3 col-md-3 col-sm-3 device-box">
                    <h4 class="text-center title">Devices</h4>
                    <div class="row">
                      <div class="col-lg-12">
                        <div class="row">
                          <?php echo deviceInBoxCamera(1, true);?>
                          <?php echo deviceInBoxCamera(2, true);?>
                          <?php echo deviceInBoxCamera(3, true);?>
                          <?php echo deviceInBoxCamera(4, true);?>
                          <?php echo deviceInBoxIOBox(1, true);?>
                        </div><!-- ./row -->
                      </div><!-- ./col-lg-12 -->
                    </div><!-- ./row -->
                  </div><!-- ./device-box -->

                  <!-- Virtual Devices Box -->
                  <div class="col-lg-3 col-md-3 col-sm-3 device-box">
                    <h4 class="text-center title">Virtual Devices</h4>
                    <div class="row">
                      <div class="col-lg-12">
                        <div class="row">
                          <?php echo deviceInBoxTimer(1);?><!--TODO-->
                          <?php echo deviceInBoxNotification(1);?>
                          <?php echo deviceInBoxIncludeTrigger(1);?>
                          <?php echo deviceInBoxAND(1);?>
                          <?php echo deviceInBoxOR(1);?>
                        </div><!-- ./row -->
                      </div><!-- ./col-lg-12 -->
                    </div><!-- ./row -->
                  </div><!-- ./device-box -->

                  <!-- Floor plan div box + upload-->
                  <div class="col-lg-5 col-md-5 col-sm-5" style="margin-right:10px;margin-left:10px;">
                    <img class="img-responsive" src="assets/img/boutique-floor-plan.png" style="max-height:400px;display:block;position:relative;"/>
                    <button class="btn btn-default not_implemented" type="button" style="float:right;">Upload floor plan</button>
                  </div><!-- END OF: Floor plan div box + upload-->
                </div><!-- ./row -->
                <!-- Trigger and action section -->
                <div class="row">
                  <!-- | Trigger - Schedule - Action | Rules Section-->
                  <section style="padding-top:15px;" class="ta-section col-lg-12">
                    <div class="row ta-rule" data-rule-id="0" id="ta-template">
                      <!-- | Trigger - Schedule - Action | Area -->
                      <div class="col-lg-10 col-md-10 ta-control">
                        <div class="row ta-head">
                          <!-- Rule ID number-->
                          <div class="col-lg-3 col-md-3">
                            <label class="btn btn-default current_rule" style="float:left;margin-right:10px;">
                              <input type="checkbox" class="current_rule" autocomplete="off">
                              <span class="glyphicon glyphicon-ok"></span>
                            </label>
                            <p class="rule-id-name" style="float:left;">
                              <span class="rule-id" style="clear:both;float:none;">#1</span>
                              <span class="separator"> - </span>
                              <span class="rule-name">New rule</span>
                            </p>
                          </div><!-- ./rule-nbr-->

                            <!-- Trigger Icons -->
                          <div class="col-lg-4 col-md-4">
                            <label>Triggers:</label>
                            <div class="trigger-icons"></div>
                          </div><!-- ./trigger-icons -->

                          <!-- Schedule offset -->
                          <!--<div class="col-lg-2 col-lg-offset-2 col-md-2 col-md-offset-2 schedule-offset">
                          </div>--><!-- ./schedule-offset -->

                          <!-- Action Icons -->
                          <div class="col-lg-3 col-md-3">
                            <label>Actions:</label>
                            <div class="action-icons"></div>
                          </div><!-- ./action-icons -->
                          <div class="col-lg-2 col-md-2">
                            <?php _getIcon('right-minimize');?>
                            <span class="label label-warning label-preset">Custom</span>
                          </div>
                        </div><!-- ./row ta-head -->

                        <div class="row ta-content">

                          <!-- Trigger column -->
                          <div class="col-lg-5 col-md-5 ta-trigger">
                            <div class="row">
                              <!-- Trigger headline div-->
                              <div class="col-md-10">
                                <h4>Triggers</h4>
                              </div><!-- END OF: Trigger headline div-->
                              <!-- Slider checkbox div-->
                              <div class="col-md-2">
                                <label class="switch">
                                  <input type="checkbox"/>
                                  <div class="slider round not_implemented"></div>
                                </label>
                              </div><!-- END OF: Slider checkbox div-->
                            </div><!-- ./row-->
                            <!-- 2nd row -->
                            <div class="row second-row">
                              <ul class="col-lg-12 ta-placeholder-triggers" data-ta-id="0">
                              </ul>
                            </div><!-- END OF: 2nd row-->
                          </div><!-- ./ta-trigger -->

                          <!-- Schedule column -->
                          <div class="col-lg-2 col-md-2 ta-schedule">
                            <div class="row">
                              <!-- Schedule headline div-->
                              <div class="col-lg-12 col-md-12">
                                <h4 style="float:left;">Schedule</h4>
                                <?php _getIcon('calendar'); ?>
                              </div><!-- END OF: Schedule headline div-->
                            </div><!-- ./row-->
                            <!-- 2nd row -->
                            <div class="row second-row">
                              <div class="col-lg-12 ta-placeholder-schedule">
                                <p class="text-center">Always on</p>
                                <button class="btn btn-default" type="button">Edit schedule</button>
                              </div>
                            </div><!-- END OF: 2nd row-->
                          </div><!-- ./ta-schedule -->

                          <!-- Action column -->
                          <div class="col-lg-5 col-md-5 ta-action">
                            <div class="row">
                              <!-- Action headline div-->
                              <div class="col-md-10">
                                <h4>Actions </h4>
                              </div><!-- END OF: Action headline div-->
                              <!-- Slider checkbox div-->
                              <div class="col-md-2">
                                <label class="switch">
                                  <input type="checkbox">
                                  <div class="slider round not_implemented"></div>
                                </label>
                              </div><!-- END OF: Slider checkbox div-->
                            </div><!-- ./row-->
                            <!-- 2nd row -->
                            <div class="row second-row">
                              <div class="col-lg-12 ta-placeholder-actions">
                              </div>
                            </div><!-- END OF: 2nd row-->
                          </div><!-- ./ta-action -->
                        </div><!-- ./ta-content -->
                      </div><!-- ./ta-control -->

                      <!-- Preset Control -->
                      <div class="col-lg-2 col-md-2 ta-preset-control">
                        <div class="row">
                          <!-- Headline Preset Control-->
                          <div class="col-md-12" style="margin-bottom:10px;">
                            <h4 style="font-weight:600;">Preset control</h4>
                          </div>
                          <!-- 4 cotrol buttons -->
                          <div class="col-md-6 ta-preset-control-button-right">
                            <button class="btn btn-default load-preset-btn" type="button">Load </button>
                          </div>
                          <div class="col-md-6 ta-preset-control-button-left">
                            <button class="btn btn-default save-preset-btn" type="button">Save</button>
                          </div>
                          <div class="col-md-6 ta-preset-control-button-right">
                            <button class="btn btn-default copy-preset-btn" type="button">Copy </button>
                          </div>
                          <div class="col-md-6 ta-preset-control-button-left">
                            <button class="btn btn-default paste-preset-btn" type="button">Paste </button>
                          </div><!-- END OF: 4 control buttons-->
                          <div class="col-md-12">
                            <hr>
                          </div>
                          <!-- 2 control buttons -->
                          <div >
                            <button class="btn btn-link btn-xs remove-rule" type="button">
                              <?php _getIcon('minus-sign'); ?>
                            </button>
                            <button class="btn btn-link btn-xs add-rule" type="button">
                              <?php _getIcon('plus-sign'); ?>
                            </button>
                          </div><!-- END OF: 2 control buttons -->
                          <div class="col-md-12">
                            <hr>
                          </div>
                        </div><!-- ./row-->
                      </div><!-- ./ta-preset-control -->
                    </div><!-- ./ta-rule -->
                  </section><!-- END OF: | Trigger - Schedule - Action | Section-->
                </div><!-- END OF TA Section -->
              </div><!-- #/advanced-main-view -->
              <!-- Simple view -->
              <div id="simple-main-view" class="simple-mode col-lg-12">
                <div class="row">
                  <!-- Devices Box -->
                  <div class="col-lg-3 col-md-3 col-sm-3 device-box">
                    <h4 class="text-center title">Devices</h4>
                    <div class="row">
                      <div class="col-lg-12">
                        <div class="row">
                          <?php echo deviceInBoxCamera(1);?>
                          <?php echo deviceInBoxCamera(2);?>
                          <?php echo deviceInBoxCamera(3);?>
                          <?php echo deviceInBoxCamera(4);?>
                          <?php echo deviceInBoxIOBox(1);?>
                        </div><!-- ./row -->
                      </div><!-- ./col-lg-12 -->
                    </div><!-- ./row -->
                  </div><!-- ./device-box -->
                  <!-- Floor plan div box + upload-->
                  <div class="col-lg-5 col-md-5 col-sm-5" style="margin-right:10px;margin-left:10px;">
                    <img class="img-responsive" src="assets/img/boutique-floor-plan.png" style="max-height:400px;display:block;position:relative;"/>
                    <button class="btn btn-default not_implemented" type="button" style="float:right;">Upload floor plan</button>
                  </div><!-- END OF: Floor plan div box + upload-->
                </div>
                <div class="row">
                  <div class="col-lg-3">
                    <h3>Config-rules</h3>
                    <ul class="list-group" id="simple_current_rules">
                    </ul>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-3">
                    <button class="btn btn-default load-preset-btn" type="button" style="float:right;">Load presets </button>
                  </div>
                </div>
              </div> <!-- </simpleview> -->
              <!-- Template Manager View -->
              <div id="template-manager-view" class="template-manager col-lg-12">
                <div class="row" style="position:relative;max-height:500px;">
                    <div class="col-md-3 col-md-offset-1" style="min-height:160px;border:1px solid black;">
                        <h3>Global Templates</h3>
                        <ul class="list-group" id="TM_global_templates">
                            <a href="#" class="list-group-item template-item">Item 1</a>
                            <a href="#" class="list-group-item template-item">Item 2</a>
                            <a href="#" class="list-group-item template-item">Item 3</a>
                            <a href="#" class="list-group-item template-item">Item 4</a>
                            <a href="#" class="list-group-item template-item">Item 5</a>
                        </ul>
                        <!-- <h3>Site specific Templates</h3>
                        <ul class="list-group">
                          <a href="#" class="list-group-item template-item">Item 1</a>
                          <a href="#" class="list-group-item template-item">Item 1</a>
                          <a href="#" class="list-group-item template-item">Item 1</a>
                        </ul> -->
                    </div>
                    <div class="col-md-2" style="text-align:center;vertical-align:middle;min-height:160px;line-height:200px;padding:0;"><i class="glyphicon glyphicon-circle-arrow-left" style="font-size:60px;"></i><i class="glyphicon glyphicon-circle-arrow-right" style="font-size:60px;"></i></div>
                    <div class="col-md-3" style="min-height:160px;border:1px solid black;">
                        <h3>Current configurations</h3>
                        <ul class="list-group" id="TM_configs">
                          <a href="#" class="list-group-item template-item">Item 1</a>
                          <a href="#" class="list-group-item template-item">Item 2</a>
                          <a href="#" class="list-group-item template-item">Item 3</a>
                          <a href="#" class="list-group-item template-item">Item 4</a>
                          <a href="#" class="list-group-item template-item">Item 5</a>
                        </ul>
                    </div>
                </div>
                <div class="row" style="margin-top:100px;">
                  <div class="col-lg-12">
                  <button class="btn btn-default go-back" type="button"><?php _getIcon('menu-left'); ?> Go back</button>
                  </div>
                </div>
              </div> <!-- </template-manager-view> -->
            </div><!-- END OF: Main content view-->
          </div><!-- ./col-lg-10... -->
        </div><!-- #/config, (main configuration wrapper)-->
      </div>
    </div><!-- ./container -->

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
