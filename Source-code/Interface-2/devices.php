<?php
if(!isset($print)){
  $print = true;
}

$camTriggers = array(
  "microphone" => array(
    "name"  =>  "Microphone",
    "property"  =>  "mic",
    "icon"  =>  '<span class="material-icons device-icon">mic</span>',
    "attrType"  =>  "checkbox",
    "data"  =>  array(
      "Activation", "Inactivation", "Activation & Inactivation"
    )
  ),
  "pir" =>  array(
    "name"  =>  "PIR",
    "property"  => "pir",
    "icon"  =>  '<span class="material-icons device-icon">transfer_within_a_station</span>',
    "data"  =>  array()
  ),
  "pip" =>  array(
    "name"  =>  "PiP",
    "property"  => "pip",
    "icon"  =>  '<span class="material-icons device-icon">accessibility</span>',
    "data"  =>  array()
  ),
  "vmd" =>  array(
    "name"  =>  "VMD",
    "property"  => "vmd",
    "icon"  =>  '<span class="material-icons device-icon">visibility</span>',
    "data"  =>  array()
  ),
  "input" =>  array(
    "name"  =>  "Input",
    "property"  => "input",
    "icon"  =>  '<span class="material-icons device-icon">input</span>',
    "data"  =>  array()
  ),
  "tampering" =>  array(
    "name"  =>  "Tampering",
    "property"  => "tempering",
    "icon"  =>  '<span class="material-icons device-icon">gavel</span>',
    "data"  =>  array()
  )
);
$camActions = array(
  "record" =>  array(
    "name"  =>  "Record",
    "property"  => "record",
    "icon"  =>  '<span class="material-icons device-icon">fiber_manual_record</span>',
    "data"  =>  array()
  ),
  "output" =>  array(
    "name"  =>  "Output",
    "property"  => "output",
    "icon"  =>  '<span class="glyphicon glyphicon-log-out device-icon" aria-hidden="true"></span>',
    "data"  =>  array()
  ),
  "speaker" =>  array(
    "name"  =>  "Speaker",
    "property"  => "speaker",
    "icon"  =>  '<span class="material-icons device-icon">volume_up</span>',
    "data"  =>  array()
  ),
  "light" =>  array(
    "name"  =>  "Light",
    "property"  => "light",
    "icon"  =>  '<span class="material-icons device-icon">lightbulb_outline</span>',
    "data"  =>  array(
      "On", "Off", "Flash every 1 second"
    )
  )
);
$notificationActions = array(
  "email" =>  array(
    "name"  =>  "Email",
    "property"  => "email",
    "icon"  =>  '<span class="material-icons device-icon">email</span>',
    "attrType"  =>  "text",
    "data"  =>  array()
  ),
  "http" =>  array(
    "name"  =>  "HTTP",
    "property"  => "http",
    "attrType"  =>  "text",
    "icon"  =>  '<span class="material-icons device-icon">http</span>',
    "data"  =>  array()
  )
);
$ioTriggers = array(
  "input_a" =>  array(
    "name"  =>  "Input A",
    "property"  => "input",
    "icon"  =>  '<span class="material-icons device-icon">input</span>',
    "data"  =>  array()
  ),
  "input_b" =>  array(
    "name"  =>  "Input B",
    "property"  => "input",
    "icon"  =>  '<span class="material-icons device-icon">input</span>',
    "data"  =>  array()
  ),
  "input_c" =>  array(
    "name"  =>  "Input C",
    "property"  => "input",
    "icon"  =>  '<span class="material-icons device-icon">input</span>',
    "data"  =>  array()
  )
);
$ioActions = array(
  "output_a" =>  array(
    "name"  =>  "Output A",
    "property"  => "output",
    "icon"  =>  '<span class="glyphicon glyphicon-log-out device-icon" aria-hidden="true"></span>',
    "data"  =>  array()
  ),
  "output_b" =>  array(
    "name"  =>  "Output C",
    "property"  => "output",
    "icon"  =>  '<span class="glyphicon glyphicon-log-out device-icon" aria-hidden="true"></span>',
    "data"  =>  array()
  ),
  "output_c" =>  array(
    "name"  =>  "Output C",
    "property"  => "output",
    "icon"  =>  '<span class="glyphicon glyphicon-log-out device-icon" aria-hidden="true"></span>',
    "data"  =>  array()
  )
);
$timerTriggers = array(
  "timer" =>  array(
    "name"  =>  "Timer",
    "property"  => "timer",
    "icon"  =>  '<span class="material-icons device-icon">timer</span>',
    "data"  =>  array()
  )
);
$timerActions = array(
  "timer_reset" =>  array(
    "name"  =>  "Reset Timer",
    "property"  => "timer_reset",
    "icon"  =>  '<span class="material-icons device-icon">restore</span>',
    "data"  =>  array()
  )
);
$includeTriggers = array(
  "include_trigger" =>  array(
    "name"  =>  "Include Trigger",
    "property"  => "include_trigger",
    "icon"  =>  '<span class="material-icons device-icon">attach_file</span>',
    "data"  =>  array()
  )
);
$camIcon = '<span class="glyphicon glyphicon-facetime-video device-icon"></span>';
$devices = array(
  "cam1"  =>  array(
    "name"  =>  "Cam 1",
    "icon"  =>  $camIcon,
    "triggers"  =>  $camTriggers,
    "actions"   =>  $camActions
  ),
  "cam2"  =>  array(
    "name"  =>  "Cam 2",
    "icon"  =>  $camIcon,
    "triggers"  =>  $camTriggers,
    "actions"   =>  $camActions
  ),
  "cam3"  =>  array(
    "name"  =>  "Cam 3",
    "icon"  =>  $camIcon,
    "triggers"  =>  $camTriggers,
    "actions"   =>  $camActions
  ),
  "cam4"  =>  array(
    "name"  =>  "Cam 4",
    "icon"  =>  $camIcon,
    "triggers"  =>  $camTriggers,
    "actions"   =>  $camActions
  ),
  "io1"  =>  array(
    "name"  =>  "I/O Box 1",
    "icon"  =>  '<span class="material-icons device-icon">settings_input_svideo</span>',
    "triggers"  =>  $ioTriggers,
    "actions"   =>  $ioActions
  ),
  "notification"  =>  array(
    "name"  =>  "Notification",
    "icon"  =>  '<span class="material-icons device-icon">email</span>',
    "triggers"  =>  array(),
    "actions"   =>  $notificationActions,
  ),
  "timer"  =>  array(
    "name"  =>  "Timer",
    "icon"  =>  '<span class="material-icons device-icon">timer</span>',
    "triggers"  =>  $timerTriggers,
    "actions"   =>  $timerActions
  ),
  "include_trigger"  =>  array(
    "name"  =>  "Include Trigger",
    "icon"  =>  '<span class="material-icons device-icon">attach_file</span>',
    "triggers"  =>  $includeTriggers,
    "actions"   =>  array()
  ),
  "and" =>  array(
    "name"  =>  "All",
    "icon"  =>  "",
    "triggers"  =>  array(
      "and" =>  array(
        "name"  =>  "All",
        "property"  => "and",
        "icon"  =>  '',
        "data"  =>  array()
      )
    ),
    "actions"   =>  array()
  ),
  "or" =>  array(
    "name"  =>  "Any",
    "icon"  =>  "",
    "triggers"  =>  array(
      "or" =>  array(
        "name"  =>  "Any",
        "property"  => "or",
        "icon"  =>  '',
        "data"  =>  array()
      )
    ),
    "actions"   =>  array()
  )
);
$triggers = array_merge($camTriggers, $ioTriggers, $timerTriggers, $includeTriggers);
$actions = array_merge($camActions, $ioActions, $notificationActions, $timerActions);

if($print === true){
  header("Content-type: text/json");
  /*
  Print an array of all devices and its triggers and actions as json,
  if the parameters 'triggers' or 'actions' are set it will be printed
  instead of the entire list of devices.
  */
  if(isset($_REQUEST['triggers'])){
    print_r(json_encode($triggers, JSON_PRETTY_PRINT));
  }
  else if(isset($_REQUEST['actions'])){
    print_r(json_encode($actions, JSON_PRETTY_PRINT));
  }
  else{
    print_r(json_encode($devices, JSON_PRETTY_PRINT));
  }
}

?>
