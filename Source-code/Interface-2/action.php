<?php
$print = false;
require_once('devices.php');

function printAllactions(){
  global $devices, $actions;
  $html = '';

  $temp_actions = array();

  foreach ($devices as $d_name => $device) {
    foreach($device['actions'] as $t_name => $action){
      $temp_actions[$t_name][] = $device['name'];
    }
  }

  foreach($actions as $t_id => $action){
    $temp_devices = htmlspecialchars(json_encode($temp_actions[$t_id]), ENT_QUOTES, 'UTF-8');
    $attributes = htmlspecialchars(json_encode($action['data']), ENT_QUOTES, 'UTF-8');
    $attrType = "false";
    if(isset($action['attrType'])){
      $attrType = htmlspecialchars(json_encode($action['attrType']), ENT_QUOTES, 'UTF-8');
    }
    $html .= '
      <div class="checkbox" data-id="'.$t_id.'" data-name="'.$action['name'].'" data-devices="'.$temp_devices.'" data-attrType="'.$attrType.'" data-attr="'.$attributes.'">
        <label><input type="checkbox" value="">'.$action['icon'].' '.$action['name'].'</label>
      </div>
    ';
  }
  print_r($html);
}

function printAllDevices($filter = ""){
  global $devices;
  $html = '';
  foreach($devices as $d_id => $device){
    if($filter === "actions"){
      if(empty($device['actions'])){
        // Ignore this device if it doesn't have any trigggers
        continue;
      }
    }else if($filter === "actions"){
      if(empty($device['actions'])){
        // Ignore this device if it doesn't have any actions
        continue;
      }
    }
    // Build an array of all actions
    $actions = array();
    foreach($device['actions'] as $action){
      array_push($actions, $action['name']);
    }
    $actions = htmlspecialchars(json_encode($actions), ENT_QUOTES, 'UTF-8');
    $html .= '
      <div class="checkbox" data-id="'.$d_id.'" data-actions="'.$actions.'" data-name="'.$device['name'].'">
        <label><input type="checkbox" value="">'.$device['icon'].' '.$device['name'].'</label>
      </div>
    ';
  }
  print_r($html);
}

?>

<div class="row">
  <div class="col-md-10 col-md-offset-1">
    <h2 class="navigation-name"><span class="main-title">Actions</span><span class="separator"><br/></span><span class="second-title">Select action(s)</span></h2>
    <p class="info-string">
      In this section, you will decide which actions will be taken for the configured triggers. Click on the checkboxes to the left for the devices you want to take an action on in the "Available devices" list. Thereafter, you can choose the action you want to be taken for the picked device by clicking on the checkboxes in the "Available actions" list. Click on the button "add" to create a relation between the chosen devices and actions. Press continue to go to the next step of the configuration.<br><br>
      DID YOU KNOW?<br>
      Some of the triggers needs to be configured futher to work properly. When you click on "add", an additional box will pop up to make the configuration necessary.
    </p>
  </div>
</div>
<div class="row" style="margin-top:35px;">
  <div class="col-md-4">
    <div class="col-md-6 available-devices">
      <h4>Available devices</h4>
      <?php printAllDevices("actions"); ?>
    </div>
    <div class="col-md-6 available-actions">
      <h4>Available actions</h4>
      <?php printAllactions(); ?>
    </div>
  </div>
  <div class="col-md-2">
    <div class="center-btns">
      <button type="button" class="btn btn-info btn-add">Add <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></button>
    </div>
  </div>
  <div class="col-md-6">
    <!-- Preview -->
    <div id="config-box"></div>
  </div>
</div>
<div class="row">
  <div class="col-md-2">
    <button type="button" class="btn btn-warning btn-margin uncheck-all-btn"><span class="glyphicon glyphicon-unchecked" aria-hidden="true"></span> Uncheck all</button>
  </div>
  <div class="col-md-1 col-md-offset-9">
    <!-- Continue button on separate row -->
  <button type="button" class="btn btn-success btn-margin next-step-btn">Continue</button>
  </div>
</div>
