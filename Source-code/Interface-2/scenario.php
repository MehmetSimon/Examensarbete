<div class="row">
  <div class="col-md-10 col-md-offset-1">
    <h2 class="navigation-name"><span class="main-title">Scenario</span><span class="separator"><br/></span><span class="second-title">Load or create new</span></h2>
    <p class="info-string">
      Welcome!<br>
Please select if you want to create a new scenario or if you want to load a scenario from the dropdown box! If you choose to load a scenario from the dropdown box, the preset configuration for the chosen scenario will be loaded. Press continue to go to the next step of the configuration.
<br><br>
DID YOU KNOW?<br>
A scenario is an eventconfiguration for a specificly chosen event.
    </p>
  </div>
</div>
<div class="row" style="margin-top:35px;">
  <div class="col-md-3">
    <!-- Dropdown column -->
    <div class="row">
      <div class="col-md-12">
        <div class="dropdown form-group">
          <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown"><span class="dropdown-title">Custom new config</span>
          <span class="caret"></span></button>
          <ul class="dropdown-menu">
            <li class="active" data-template-index="new"><a href="#">Custom new config</a></li>
            <li role="separator" class="divider scenarios-after-this"></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="row" style="margin-top:250px;">
      <div class="col-md-10">
        <button type="button" class="btn btn-warning btn-margin reloadConfig">Reload current config</button>
        <button id="delete-template" type="button" class="btn btn-danger btn-margin">Delete template permanently</button>
      </div>
    </div>
  </div>
  <div class="col-md-9">
    <!-- Preview -->
    <div id="config-box">
      <table id="config-overview-scenario" class="table table-bordered">
        <thead>
          <tr>
            <th class="select_include_trigger hidden" style="max-width:25px;">Include trigger</th>
            <th class="name">Name</th>
            <th class="trigger">Triggers</th>
            <th class="schedule">Schedule</th>
            <th class="action">Actions</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
    </div>
  </div>
</div>
<div class="row">
  <div class="col-md-2">
  </div>
  <div class="col-md-1 col-md-offset-9">
    <!-- Continue button on separate row -->
  <button type="button" class="btn btn-success btn-margin next-step-btn">Continue</button>
  </div>
</div>
