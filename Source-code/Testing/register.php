<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
date_default_timezone_set('Europe/Stockholm');
if($_REQUEST['interface'] === '1'){
  $emptyDatabaseFileContent = '
  {
      "configs": [
        {
            "id": 3,
            "next-unique-id": 15,
            "name": "No movement case",
            "devicesOnMap": [],
            "rules": [
                {
                    "actions": [
                        {
                            "action-id": 8,
                            "device-id": "timer",
                            "device-property": "timer_reset",
                            "action": "Reset Timer",
                            "data": "&lt;span class=\"mini-icon\"&gt;&lt;span class=\"material-icons device-icon\"&gt;restore&lt;\/span&gt;&lt;\/span&gt;Reset Timer"
                        }
                    ],
                    "active-actions": "true",
                    "active-triggers": "true",
                    "preset-name": "",
                    "rule-name": "Movement -&gt; Reset time",
                    "schedule": "Always on",
                    "triggers": [
                        {
                            "trigger-id": 1,
                            "device-id": "cam1",
                            "device-property": "vmd",
                            "trigger": "VMD",
                            "data": "",
                            "parent": 0
                        },
                        {
                            "trigger-id": 2,
                            "device-id": "cam2",
                            "device-property": "vmd",
                            "trigger": "VMD",
                            "data": "",
                            "parent": 0
                        },
                        {
                            "trigger-id": 3,
                            "device-id": "cam3",
                            "device-property": "vmd",
                            "trigger": "PIR",
                            "data": "",
                            "parent": 0
                        }
                    ]
                },
                {
                    "actions": [
                        {
                            "action-id": 14,
                            "device-id": "notification",
                            "device-property": "email",
                            "action": "Email",
                            "data": "test@test.com"
                        }
                    ],
                    "active-actions": "true",
                    "active-triggers": "true",
                    "preset-name": "",
                    "rule-name": "Send email after time",
                    "schedule": "Always on",
                    "triggers": [
                        {
                            "trigger-id": 13,
                            "device-id": "timer",
                            "device-property": "timer",
                            "trigger": "Timer",
                            "data": "1 h",
                            "parent": 0
                        }
                    ]
                }
            ]
        }
      ],
      "presets": [
      ],
      "templates": [
      ]
  }
  ';
}else{
  $emptyDatabaseFileContent = '
  {
      "configs": [
        {
            "id": 2,
            "next-unique-id": 12,
            "name": "No movement detected",
            "devicesOnMap": [],
            "rules": [
                {
                    "actions": [
                        {
                            "device_id": "timer",
                            "type_id": "timer_reset",
                            "data": false,
                            "parent": 0,
                            "action_id": 11
                        }
                    ],
                    "active-actions": true,
                    "active-triggers": true,
                    "preset-name": "",
                    "rule-name": "reset time",
                    "schedule": "Specific",
                    "triggers": [
                        {
                            "device_id": "cam1",
                            "type_id": "vmd",
                            "data": false,
                            "parent": 5,
                            "trigger_id": 1
                        },
                        {
                            "device_id": "cam2",
                            "type_id": "vmd",
                            "data": false,
                            "parent": 5,
                            "trigger_id": 2
                        },
                        {
                            "device_id": "cam3",
                            "type_id": "vmd",
                            "data": false,
                            "parent": 5,
                            "trigger_id": 3
                        },
                        {
                            "device_id": "or",
                            "type_id": "or",
                            "data": false,
                            "parent": 0,
                            "trigger_id": 5,
                            "name": "Unnamed group #1"
                        }
                    ]
                },
                {
                    "actions": [
                        {
                            "device_id": "cam1",
                            "type_id": "record",
                            "data": false,
                            "parent": 0,
                            "action_id": 7
                        },
                        {
                            "device_id": "cam2",
                            "type_id": "record",
                            "data": false,
                            "parent": 0,
                            "action_id": 8
                        },
                        {
                            "device_id": "cam3",
                            "type_id": "record",
                            "data": false,
                            "parent": 0,
                            "action_id": 9
                        }
                    ],
                    "active-actions": true,
                    "active-triggers": true,
                    "preset-name": "",
                    "rule-name": "record",
                    "schedule": "Specific",
                    "triggers": [
                        {
                            "device_id": "timer",
                            "type_id": "timer",
                            "data": "30 min",
                            "parent": 0,
                            "trigger_id": 6
                        }
                    ]
                }
            ]
        }
      ],
      "presets": [
      ],
      "templates": [
      ]
  }
  ';
}

if(isset($_REQUEST['name']) && isset($_REQUEST['email']) && isset($_REQUEST['start'])){
  $_SESSION['name'] = $_REQUEST['name'];
  $_SESSION['email'] = $_REQUEST['email'];
  $_SESSION['startTime'] = time();
  $_SESSION['interface'] = $_REQUEST['interface'];
  $regex_name = preg_replace('/[^A-Za-z0-9 _ .-]/', '', str_replace(' ', '_', $_SESSION['name']));
  $_SESSION['filename'] = 'Interface_'.$_SESSION['interface'].'-'.$_SESSION['startTime'].'-'.str_replace(' ', '_', $regex_name);
  $initLogFile = "INTERFACE ".$_REQUEST['interface']."
NAME: ".$_SESSION['name']."
EMAIL: ".$_SESSION['email']."
START: ".date('Y-m-d H:i:s');
  try {
    file_put_contents('databases/'.$_SESSION['filename'].'.json', $emptyDatabaseFileContent);
    file_put_contents('tests/'.$_SESSION['filename'].'.log', $initLogFile, FILE_APPEND);
    $_SESSION['activeTest'] = true;
    header("Location: ../Interface-".$_SESSION['interface']);
  }
  catch (Exception $e) {
      echo $e->getMessage();
  }
}else if(isset($_REQUEST['end'])){
  $_SESSION['endTime'] = time();
  $duration = $_SESSION['endTime']-$_SESSION['startTime'];
  $duration_m = (int)($duration/60);
  $duration_s = $duration%60;
  $log = "
END: ".date('Y-m-d H:i:s')."
DURATION: $duration_m min $duration_s sec ($duration seconds)
TOTAL CLICKS: ".$_REQUEST['end'];
  try {
    if($_SESSION['activeTest'] === true){
      file_put_contents('tests/'.$_SESSION['filename'].'.log', $log, FILE_APPEND);
      $_SESSION['activeTest'] = false;
    }
  }
  catch (Exception $e) {
      echo $e->getMessage();
  }
}
?>
