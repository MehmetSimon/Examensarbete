<?php
$print = false;
require_once('devices.php');

function printAllTriggers(){
  global $devices, $triggers;
  $html = '';

  $temp_triggers = array();

  foreach ($devices as $d_name => $device) {
    foreach($device['triggers'] as $t_name => $trigger){
      $temp_triggers[$t_name][] = $device['name'];
    }
  }

  foreach($triggers as $t_id => $trigger){
    $temp_devices = htmlspecialchars(json_encode($temp_triggers[$t_id]), ENT_QUOTES, 'UTF-8');
    $attributes = htmlspecialchars(json_encode($trigger['data']), ENT_QUOTES, 'UTF-8');
    $attrType = "false";
    if(isset($trigger['attrType'])){
      $attrType = htmlspecialchars(json_encode($trigger['attrType']), ENT_QUOTES, 'UTF-8');
    }
    if($t_id === 'include_trigger'){
      // Skip to print this trigger
      continue;
    }
    $html .= '
      <div class="checkbox" data-id="'.$t_id.'" data-name="'.$trigger['name'].'" data-devices="'.$temp_devices.'" data-attrType="'.$attrType.'" data-attr="'.$attributes.'">
        <label><input type="checkbox" value="">'.$trigger['icon'].' '.$trigger['name'].'</label>
      </div>
    ';
  }
  print_r($html);
}

function printAllActions(){
  global $actions;

}

function printAllDevices($filter = ""){
  global $devices;
  $html = '';
  foreach($devices as $d_id => $device){
    if($filter === "triggers"){
      if(empty($device['triggers']) || $d_id === 'and' || $d_id === 'or' || $d_id === 'include_trigger'){
        // Ignore this device if it doesn't have any trigggers
        continue;
      }
    }else if($filter === "actions"){
      if(empty($device['actions'])){
        // Ignore this device if it doesn't have any actions
        continue;
      }
    }
    // Build an array of all triggers
    $triggers = array();
    foreach($device['triggers'] as $trigger){
      array_push($triggers, $trigger['name']);
    }
    $triggers = htmlspecialchars(json_encode($triggers), ENT_QUOTES, 'UTF-8');
    $html .= '
      <div class="checkbox" data-id="'.$d_id.'" data-triggers="'.$triggers.'" data-name="'.$device['name'].'">
        <label><input type="checkbox" value="">'.$device['icon'].' '.$device['name'].'</label>
      </div>
    ';
  }
  print_r($html);
}

?>

<div class="row">
  <div class="col-md-10 col-md-offset-1">
    <h2 class="navigation-name"><span class="main-title">Triggers</span><span class="separator"><br/></span><span class="second-title">
      <?php
      if(isset($_REQUEST['trigger_lvl'])){
        echo 'Trigger grouping';
      }else{
        echo 'Select trigger(s)';
      }
      ?>
    </span></h2>
    <p class="info-string">
      <?php
        if(isset($_REQUEST['trigger_lvl'])){
          // If grouping page:
          echo 'You can in this section group the triggers created for a device from the previous step. To group the triggers, click on the checkboxes to the left and choose if you want to group the selected devices with an "all" or "any" relation, and then press on the button "add" to create the grouping. You can name your group if you wish by writing the name in the "Tag with name" box. If you want to add additional triggers, you can choose to go back by clicking the button "add more triggers". Press continue to go to the next step of the configuration.
          <br><br>
          DID YOU KNOW?<br>
          "all" means that every chosen triggers needs to be activated before an action is taken.<br>
          "any" means that one of the chosen triggers are enough to be activated before an action is taken.';
        }else{
          // If it's the normal page
          echo 'You can in this section choose which triggers you want to use from the available devices in the system. Click on the checkboxes for each device you want to use to show which triggers are available for configuration to the chosen devices. By clicking on a checkbox for any device aswell as any trigger, and clicking add - a trigger for the chosen devices will be created. Press continue to go to the next step of the configuration. ';
        }
      ?>
    </p>
  </div>
</div>
<div class="row" style="margin-top:35px;">
  <div class="col-md-4">
      <?php
        if(isset($_REQUEST['trigger_lvl'])){
          echo '
          <div class="col-md-12 available-lvl" data-lvl="'.$_REQUEST['trigger_lvl'].'">
            <h4>Selected triggers</h4>
            <div class="trigger-checkboxes-placeholder" data-lvl="'.$_REQUEST['trigger_lvl'].'"></div>
          </div>';
        }else{
          echo '
          <div class="col-md-6 available-devices">
          <h4>Available devices</h4>';
          printAllDevices("triggers");
          echo '</div>';
          echo '
            <div class="col-md-6 available-triggers">
            <h4>Available triggers</h4>';
          printAllTriggers();
          echo '</div>';
        }
      ?>
  </div>
  <div class="col-md-2">
    <div class="center-btns">
      <?php
        if(isset($_REQUEST['trigger_lvl'])){
          echo '
            <div class="col-md-12 trigger-group">
              <h4>Trigger grouping</h4>
              <div class="radio" data-id="and" data-name="All">
                <label><input type="radio" name="trigger_grouping" value="and" checked>All</label>
              </div>
              <div class="radio" data-id="or" data-name="Any">
                <label><input type="radio" name="trigger_grouping" value="or">Any</label>
              </div>
              <hr>
            ';
        }
      ?>
      <button type="button" class="btn btn-info btn-add">Add <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></button>
      <?php
        if(isset($_REQUEST['trigger_lvl'])){
          echo '<div class="form-group"><input type="text" class="form-control btn-margin" placeholder="Tag with name"></div></div>';
        }
      ?>
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
  <div class="col-md-1 col-md-offset-4">
    <!-- <button type="button" class="btn btn-info btn-margin trigger-level-btn">Add one more trigger-level</button> -->
  </div>
  <div class="col-md-1 col-md-offset-4">
    <!-- Continue button on separate row -->
  <button type="button" class="btn btn-success btn-margin next-step-btn">Continue</button>
  </div>
</div>
