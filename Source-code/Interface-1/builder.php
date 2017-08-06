<?php

// Get the icon element
function getIcon($index, $all = false){
  $icons = array(
    "plus"          =>  '<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>',
    "menu-right"    =>  '<span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span>',
    'menu-left'     =>  '<span class="glyphicon glyphicon-menu-left" aria-hidden="true"></span>',
    'right-caret'   => '<span class="glyphicon glyphicon-menu-right right-caret" aria-hidden="true"></span>',
    'left-menu'     =>  '<span class="glyphicon glyphicon-menu-left left-caret" aria-hidden="true"></span>',
    "trash"         =>  '<span class="glyphicon glyphicon-trash"></span>',
    'right-trash'   =>  '<span class="glyphicon glyphicon-trash right-trash" aria-hidden="true"></span>',
    'save'          =>  '<span class="glyphicon glyphicon-floppy-saved"></span>',
    'minus-sign'    =>  '<span class="glyphicon glyphicon-minus-sign"></span>',
    'plus-sign'     =>  '<span class="glyphicon glyphicon-plus-sign"></span>',
	  'calendar'      =>  '<span class="fa fa-calendar calendar-icon"></span>',
    'device-video'  =>  '<span class="glyphicon glyphicon-facetime-video device-icon"></span>',
    'device-io'     =>  '<span class="material-icons device-icon">settings_input_svideo</span>',
    'timer'         =>  '<span class="material-icons device-icon">timer</span>',
    'timer_reset'   =>  '<span class="material-icons device-icon">restore</span>',
    'microphone'    =>  '<span class="material-icons device-icon">mic</span>',
    'speaker'       =>  '<span class="material-icons device-icon">volume_up</span>',
    'output'        =>  '<span class="glyphicon glyphicon-log-out device-icon" aria-hidden="true"></span>',
    'light'         =>  '<span class="material-icons device-icon">lightbulb_outline</span>',
    'email'         =>  '<span class="material-icons device-icon">email</span>',
    'http'          =>  '<span class="material-icons device-icon">http</span>',
    'pir'           =>  '<span class="material-icons device-icon">transfer_within_a_station</span>',
    'pip'           =>  '<span class="material-icons device-icon">accessibility</span>',
    'vmd'           =>  '<span class="material-icons device-icon">visibility</span>',
    'no-vmd'        =>  '<span class="material-icons device-icon">visibility_off</span>',
    'input'         =>  '<span class="material-icons device-icon">input</span>',
    'tampering'     =>  '<span class="material-icons device-icon">gavel</span>',
    'record'        =>  '<span class="material-icons device-icon">fiber_manual_record</span>',
    'attach'        =>  '<span class="material-icons device-icon">attach_file</span>',
    'right-minimize'=>  '<span class="material-icons device-icon minimize" style="float:right;">indeterminate_check_box</span>',
    'and'           =>  '<span class="fa fa-object-group device-icon"></span>',
    'or'            =>  '<span class="fa fa-object-group device-icon"></span>',
    'hashtag'       =>  '<span class="fa fa-hashtag device-icon"></span>',
    "none"          =>  '<span class="device-icon"></span>'
  );
  if($all === true){
    return $icons;
  }
  if(isset($icons[$index])){
    return $icons[$index];
  }
  return '<span></span>';
}

// Print the icon
function _getIcon($index){
  print_r(getIcon($index));
}

function getAllIcons($includeDiv = true){
  $icons = getIcon("",true);
  $print = '';
  foreach($icons as $name => $icon){
    if($includeDiv === true){
      $print .= '<div class="'.$name.'">'.$icon.'</div>';
    }else{
      $print .= $icon;
    }
  }
  return $print;
}

function getMiniIcon($index){
  return '<span class="mini-icon">'.getIcon($index).'</span>';
}

function deviceInBoxCamera($id = 0, $advanced_mode = false){
  $simple = '
  <div class="list-group simple-mode">
    <h4 class="main-headline">Cam '.$id.' - Current Configurations</h4>
    <div class="device-presets">
      <!-- Example -->
        <!--
          <a href="#" class="list-group-item" data-device="cam'.$id.'">
          Record on all cameras
          '.getIcon('right-trash').'
          </a>
        -->
      <!-- End of example -->
    </div>
    <br/>
    <a href="#" class="list-group-item add-preset-btn">Add preset</a>
  </div><!-- ./simple-mode -->
  ';

  $advanced = '
  <div class="list-group advanced-mode">
    <div class="device-property-menu">
      <!-- Device Properties Menu -->
      <h4 class="main-headline">Cam '.$id.' - Properties</h4>

      <!-- Triggers available for the device-->
      <h4 style="text-align:center;">Triggers</h4>
      <a href="#" class="list-group-item" data-device="cam'.$id.'" data-device-property="microphone" data-device-property-submenu="true" data-type="trigger">'.getMiniIcon('microphone').'Microphone
        '.getIcon('right-caret').'
      </a>
      <a href="#" class="list-group-item add-as-trigger" data-device="cam'.$id.'" data-device-property="pir" data-device-property-submenu="false" data-trigger-name="PIR" data-type="trigger">'.getMiniIcon('pir').'PIR (Passive Infrared Sensor)</a>
      <a href="#" class="list-group-item add-as-trigger" data-device="cam'.$id.'" data-device-property="pip" data-device-property-submenu="false" data-trigger-name="PiP" data-type="trigger">'.getMiniIcon('pip').'PiP (Person in Picture)</a>
      <a href="#" class="list-group-item add-as-trigger" data-device="cam'.$id.'" data-device-property="vmd" data-device-property-submenu="false" data-trigger-name="VMD" data-type="trigger">'.getMiniIcon('vmd').'VMD (Video Motion Detection)</a>
      <a href="#" class="list-group-item add-as-trigger" data-device="cam'.$id.'" data-device-property="input" data-device-property-submenu="false" data-trigger-name="Input" data-type="trigger">'.getMiniIcon('input').'I/O (input)</a>
      <a href="#" class="list-group-item add-as-trigger" data-device="cam'.$id.'" data-device-property="tampering" data-device-property-submenu="false" data-trigger-name="Tampering" data-type="trigger">'.getMiniIcon('tampering').'Tampering</a>

      <!-- Actions available for the device-->
      <h4 style="text-align:center;">Actions</h4>
      <a href="#" class="list-group-item add-as-action" data-device="cam'.$id.'" data-device-property="record" data-device-property-submenu="false" data-action-name="Record" data-type="action">'.getMiniIcon('record').'Record </a>
      <a href="#" class="list-group-item add-as-action" data-device="cam'.$id.'" data-device-property="output" data-device-property-submenu="false" data-action-name="Output" data-type="action">'.getMiniIcon('output').'I/O (output)</a>
      <a href="#" class="list-group-item add-as-action" data-device="cam'.$id.'" data-device-property="speaker" data-device-property-submenu="false" data-action-name="Speaker" data-type="action">'.getMiniIcon('speaker').'Speaker</a>
      <a href="#" class="list-group-item" data-device="cam'.$id.'" data-device-property="light" data-device-property-submenu="true" data-type="action">'.getMiniIcon('light').'Light
        '.getIcon('right-caret').'
      </a>
    </div><!-- ./device-property-menu -->

    <!-- Device Property Submenus -->
    <!-- Submenu - Microphone -->
    <div class="device-property-submenu submenu-microphone">
      <h4>Cam '.$id.' - Microphone</h4>
      <br/>
      <button class="go-back" data-device-property="microphone">
        '.getIcon('left-caret').' Go back
      </button>
      <hr><!----------------------------------------------------->
      <div class="btn-group">
        <div class="radio">
          <label><input type="radio" name="optradio" value="Activation">Activation</label>
        </div>
        <div class="radio">
          <label><input type="radio" name="optradio" value="Inactivation">Inactivation</label>
        </div>
        <div class="radio">
          <label><input type="radio" name="optradio" value="Activation &amp; Inactivation">Activation &amp; Inactivation</label>
        </div>
      </div>
      <hr><!----------------------------------------------------->
      <button class="add-as-trigger" data-device="cam'.$id.'" data-trigger-name="Microphone" data-device-property="microphone">
        Add as a trigger
      </button>
    </div><!-- ./submenu-microphone -->

    <!-- Submenu - Light -->
    <div class="device-property-submenu submenu-light">
      <h4>Cam '.$id.' - Light</h4>
      <br/>
      <button class="go-back" data-device-property="light">
        '.getIcon('left-caret').' Go back
      </button>
      <hr><!----------------------------------------------------->
      <div class="btn-group">
        <div class="radio">
          <label><input type="radio" name="optradio" value="On">On</label>
        </div>
        <div class="radio">
          <label><input type="radio" name="optradio" value="Off">Off</label>
        </div>
        <div class="radio">
          <label><input type="radio" name="optradio" value="Flash every 1 second">Flash every 1 second</label>
        </div>
      </div>
      <hr><!----------------------------------------------------->
      <button class="add-as-action" data-device="cam'.$id.'" data-action-name="Light" data-device-property="light">
        Add as an action
      </button>
    </div><!-- ./submenu-light -->
  </div><!-- ./advanced-mode -->
  ';

  $mode = $simple;
  if($advanced_mode === true){
    $mode = $advanced;
  }

  $html = '
  <!-- Cam '.$id.'-->
  <div class="col-lg-4 col-md-6 device">
    <div class="device-menu device-id-cam'.$id.'" data-device-name="Cam '.$id.'">
      '.$mode.'
    </div><!-- ./device-menu -->
    <!-- Device icon -->
    <div class="device-icon">
      '.getIcon('device-video').'
      <p style="text-align:center;">Cam '.$id.'</p>
    </div><!-- ./device-icon -->
  </div><!-- </Cam '.$id.'> -->
  ';
  return $html;
}

function deviceInBoxIOBox($id = 0, $advanced_mode = false){
  $simple = '
  <div class="list-group simple-mode">
    <h4 class="main-headline">I/O Box '.$id.' - Current Configurations</h4>
    <div class="device-presets">
      <!-- Example -->
        <!--
          <a href="#" class="list-group-item" data-device="io'.$id.'">
          Record on all cameras
          '.getIcon('right-trash').'
          </a>
        -->
      <!-- End of example -->
    </div>
    <br/>
    <a href="#" class="list-group-item add-preset-btn">Add preset</a>
  </div><!-- ./simple-mode -->
  ';

  $advanced = '
  <div class="list-group advanced-mode">
    <div class="device-property-menu">
      <!-- Device Properties Menu -->
      <h4 class="main-headline">I/O Box '.$id.' - Properties</h4>

      <!-- Triggers available for the device-->
      <h4 style="text-align:center;">Triggers</h4>
      <a href="#" class="list-group-item add-as-trigger" data-device="io'.$id.'" data-device-property="input" data-device-property-submenu="false" data-trigger-name="Input A" data-type="trigger">'.getMiniIcon('input').'Input A </a>
      <a href="#" class="list-group-item add-as-trigger" data-device="io'.$id.'" data-device-property="input" data-device-property-submenu="false" data-trigger-name="Input B" data-type="trigger">'.getMiniIcon('input').'Input B </a>
      <a href="#" class="list-group-item add-as-trigger" data-device="io'.$id.'" data-device-property="input" data-device-property-submenu="false" data-trigger-name="Input C" data-type="trigger">'.getMiniIcon('input').'Input C </a>

      <!-- Actions available for the device-->
      <h4 style="text-align:center;">Actions</h4>
      <a href="#" class="list-group-item add-as-action" data-device="io'.$id.'" data-device-property="output" data-device-property-submenu="false" data-action-name="Output A" data-type="action">'.getMiniIcon('output').'Output A </a>
      <a href="#" class="list-group-item add-as-action" data-device="io'.$id.'" data-device-property="output" data-device-property-submenu="false" data-action-name="Output B" data-type="action">'.getMiniIcon('output').'Output B </a>
      <a href="#" class="list-group-item add-as-action" data-device="io'.$id.'" data-device-property="output" data-device-property-submenu="false" data-action-name="Output C" data-type="action">'.getMiniIcon('output').'Output C </a>

    </div><!-- ./device-property-menu -->

    <!-- Device Property Submenus -->
    <!-- Has no submenus -->

  </div><!-- ./advanced-mode -->
  ';

  $mode = $simple;
  if($advanced_mode === true){
    $mode = $advanced;
  }

  $html = '
  <!-- I/O Box '.$id.'-->
  <div class="col-lg-4 col-md-6 device">
    <div class="device-menu device-id-io'.$id.'" data-device-name="I/O Box '.$id.'">
      '.$mode.'
    </div><!-- ./device-menu -->
    <!-- Device icon -->
    <div class="device-icon">
      '.getIcon('device-io').'
      <p style="text-align:center;">I/O Box '.$id.'</p>
    </div><!-- ./device-icon -->
  </div><!-- </I/O Box '.$id.'> -->
  ';
  return $html;
}

function deviceInBoxTimer($id = 0, $advanced_mode = false){
  $advanced = '
  <div class="list-group advanced-mode">
    <div class="device-property-menu">
      <!-- Device Properties Menu -->
      <h4 class="main-headline">Timer - Properties</h4>

      <!-- Triggers available for the device-->
      <h4 style="text-align:center;">Triggers</h4>
      <a href="#" class="list-group-item" data-device="timer" data-device-property="timer" data-device-property-submenu="true" data-type="trigger">'.getMiniIcon('timer').'Timer
        '.getIcon('right-caret').'
      </a>

      <!-- Actions available for the device-->
      <h4 style="text-align:center;">Actions</h4>
      <a href="#" class="list-group-item add-as-action" data-device="timer" data-device-property="timer_reset" data-device-property-submenu="false" data-action-name="Reset Timer" data-type="action">'.getMiniIcon('timer_reset').'Reset Timer</a>
    </div><!-- ./device-property-menu -->

    <!-- Device Property Submenus -->
    <!-- Submenu - Timer -->
    <div class="device-property-submenu submenu-timer">
      <h4>Timer - Timer</h4>
      <br/>
      <button class="go-back" data-device-property="timer">
        '.getIcon('left-caret').' Go back
      </button>
      <hr><!----------------------------------------------------->
      <div class="btn-group">
        <div class="radio">
          <label><input type="radio" name="optradio" value="hours" data-short="h">Hours</label>
        </div>
        <div class="radio">
          <label><input type="radio" name="optradio" value="minutes" data-short="min">Minutes</label>
        </div>
        <div class="radio">
          <label><input type="radio" name="optradio" value="seconds" data-short="sec">Seconds</label>
        </div>
      </div>
      <input type="number" class="form-control">
      <hr><!----------------------------------------------------->
      <button class="add-as-trigger" data-device="timer" data-trigger-name="Timer" data-device-property="timer">
        Add as a trigger
      </button>
    </div><!-- ./submenu-timer -->
  </div><!-- ./advanced-mode -->
  ';

  $mode = $advanced;  // FORCE ADVANCED MODE

  $html = '
  <!-- Timer -->
  <div class="col-lg-4 col-md-6 device">
    <div class="device-menu device-id-timer" data-device-name="Timer">
      '.$mode.'
    </div><!-- ./device-menu -->
    <!-- Device icon -->
    <div class="device-icon">
      '.getIcon('timer').'
      <p style="text-align:center;">Timer</p>
    </div><!-- ./device-icon -->
  </div><!-- </Timer> -->
  ';
  return $html;
}

function deviceInBoxNotification($id = 0, $advanced_mode = false){
  $advanced = '
  <div class="list-group advanced-mode">
    <div class="device-property-menu">
      <!-- Device Properties Menu -->
      <h4 class="main-headline">Notification - Properties</h4>

      <!-- Actions available for the device-->
      <h4 style="text-align:center;">Actions</h4>
      <a href="#" class="list-group-item" data-device="notification" data-device-property="email" data-device-property-submenu="true" data-type="action">'.getMiniIcon('email').'Email
        '.getIcon('right-caret').'
      </a>
      <a href="#" class="list-group-item" data-device="notification" data-device-property="http" data-device-property-submenu="true" data-type="trigger">'.getMiniIcon('http').'HTTP
        '.getIcon('right-caret').'
      </a>
    </div><!-- ./device-property-menu -->

    <!-- Device Property Submenus -->
    <!-- Submenu - Email -->
    <div class="device-property-submenu submenu-email">
      <h4>Notification - Email</h4>
      <br/>
      <button class="go-back" data-device-property="email">
        '.getIcon('left-caret').' Go back
      </button>
      <hr><!----------------------------------------------------->
      <p>Enter one or multiple email addresses</p>
      <textarea class="form-control" rows="3"></textarea>
      <hr><!----------------------------------------------------->
      <button class="add-as-action" data-device="notification" data-action-name="Email" data-device-property="email">
        Add as an action
      </button>
    </div><!-- ./submenu-email -->
    <!-- Submenu - HTTP -->
    <div class="device-property-submenu submenu-http">
      <h4>Notification - HTTP</h4>
      <br/>
      <button class="go-back" data-device-property="http">
        '.getIcon('left-caret').' Go back
      </button>
      <hr><!----------------------------------------------------->
      <p>Enter one or multiple URLs</p>
      <textarea class="form-control" rows="3"></textarea>
      <hr><!----------------------------------------------------->
      <button class="add-as-action" data-device="notification" data-action-name="HTTP" data-device-property="http">
        Add as an action
      </button>
    </div><!-- ./submenu-http -->
  </div><!-- ./advanced-mode -->
  ';

  $mode = $advanced;  // FORCE ADVANCED MODE

  $html = '
  <!-- Timer -->
  <div class="col-lg-4 col-md-6 device">
    <div class="device-menu device-id-notification" data-device-name="Notification">
      '.$mode.'
    </div><!-- ./device-menu -->
    <!-- Device icon -->
    <div class="device-icon">
      '.getIcon('email').'
      <p style="text-align:center;">Notification</p>
    </div><!-- ./device-icon -->
  </div><!-- </Notification> -->
  ';
  return $html;
}

function deviceInBoxIncludeTrigger($id = 0, $advanced_mode = false){
  $advanced = '
  <div class="list-group advanced-mode">
    <div class="device-property-menu">
      <!-- Device Properties Menu -->
      <h4 class="main-headline">Include Trigger - Properties</h4>

      <!-- Triggers available for the device-->
      <h4 style="text-align:center;">Triggers</h4>
      <!-- <a href="#" class="list-group-item add-as-trigger" data-device="include_trigger" data-device-property="include_trigger" data-device-property-submenu="false" data-trigger-name="New Rule" data-trigger-name-rule-id="0" data-type="trigger">'.getMiniIcon('attach').'#1 - New rule</a><!-- data-trigger-name="trigger-rule-id:0"-->
    </div><!-- ./device-property-menu -->
  </div><!-- ./advanced-mode -->
  ';

  $mode = $advanced;  // FORCE ADVANCED MODE

  $html = '
  <!-- Notification -->
  <div class="col-lg-4 col-md-6 device">
    <div class="device-menu device-id-include_trigger" data-device-name="Include Trigger">
      '.$mode.'
    </div><!-- ./device-menu -->
    <!-- Device icon -->
    <div class="device-icon">
      '.getIcon('attach').'
      <p style="text-align:center;">Include Trigger</p>
    </div><!-- ./device-icon -->
  </div><!-- </Notification> -->
  ';
  return $html;
}

function deviceInBoxAND($id = 0, $advanced_mode = false){
  $advanced = '
    <div class="list-group advanced-mode">
      <div class="device-property-menu">
        <!-- Device Properties Menu -->
        <h4 class="main-headline">Virtual group - All</h4>

        <!-- Triggers available for the device-->
        <a href="#" class="list-group-item add-as-trigger" data-device="AND" data-device-property="and" data-device-property-submenu="false" data-trigger-name="All" data-type="trigger">'.getMiniIcon('and').'Add to triggers</a>
      </div><!-- ./device-property-menu -->
    </div><!-- ./advanced-mode -->
  ';

  $mode = $advanced;  // FORCE ADVANCED MODE

  $html = '
  <!-- AND -->
  <div class="col-lg-4 col-md-6 device">
    <div class="device-menu device-id-AND" data-device-name="All">
      '.$mode.'
    </div><!-- ./device-menu -->
    <!-- Device icon -->
    <div class="device-icon">
      '.getIcon('and').'
      <p style="text-align:center;">All</p>
    </div><!-- ./device-icon -->
  </div><!-- </AND> -->
  ';
  return $html;
}
function deviceInBoxOR($id = 0, $advanced_mode = false){
  $advanced = '
    <div class="list-group advanced-mode">
      <div class="device-property-menu">
        <!-- Device Properties Menu -->
        <h4 class="main-headline">Virtual group - Any</h4>

        <!-- Triggers available for the device-->
        <a href="#" class="list-group-item add-as-trigger" data-device="OR" data-device-property="or" data-device-property-submenu="false" data-trigger-name="Any" data-type="trigger">'.getMiniIcon('or').'Add to triggers</a>
      </div><!-- ./device-property-menu -->
    </div><!-- ./advanced-mode -->
  ';

  $mode = $advanced;  // FORCE ADVANCED MODE

  $html = '
  <!-- OR -->
  <div class="col-lg-4 col-md-6 device add-as-trigger">
    <div class="device-menu device-id-OR" data-device-name="Any">
      '.$mode.'
    </div><!-- ./device-menu -->
    <!-- Device icon -->
    <div class="device-icon">
      '.getIcon('or').'
      <p style="text-align:center;">Any</p>
    </div><!-- ./device-icon -->
  </div><!-- </OR> -->
  ';
  return $html;
}

?>
