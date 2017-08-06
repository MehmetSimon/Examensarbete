var config = {};
var devices = {};
var triggers = [];
var actions = [];
// var relations =[];
var lastPage = "overview";
var lastPageData = 0;
var newConfig = {
  "id":'new',
  "next-unique-id": 1,
  "name": "New config",
  "devicesOnMap": [],
  "rules": [
  ]
};
var oldConfig = JSON.parse(JSON.stringify(newConfig));
renderConfig();
goToNewConfig();
getAndUpdateDevices();
getConfigs(function(data){
  var response = data;
  updateConfigsMenu(response);
});

function getUniqueId(){
  return config['next-unique-id']++;
}

function renderConfig(){
  // Get the full menu list of configs
}

function renderTAList(type, array = false){
  var html = "";
  var ta_array = array;
  if(type === "actions"){
    if(array === false){
      ta_array = actions;
    }
    $.each(ta_array, function(){
      html += buildTABox(this.device_id, this.type_id, type, this.data, this.action_id);
    });
  }else{
    if(array === false){
      ta_array = triggers;
    }
    html += getTriggersHtml(buildHierarchy(ta_array));
    $.each(array, function(){
      if(this.type_id === 'and' || this.type_id === 'or'){

      }
    })
  }if(array === false){
    $('#config-box').html(html);
  }
  return html;
}

function getTriggerIndexById(id){
  var foundIndex = -1;
  $.each(triggers, function(index, value){
    if(this.trigger_id === id){
      foundIndex = index;
    }
  });
  return foundIndex;
}
function getActionIndexById(id){
  var foundIndex = -1;
  $.each(actions, function(index, value){
    if(this.action_id === id){
      foundIndex = index;
    }
  });
  return foundIndex;
}

function getTriggerParentsChildren(parent_id){
  var triggersArray = [];
  $.each(triggers, function(){
    if(this.parent === parent_id){
      triggersArray.push(this);
    }
  });
  return triggersArray;
}

function addTA(device_id, type_id, type, value, name = ""){
  var unique = undefined;
  if(type === "triggers"){
    unique = getUniqueId();
    if(name !== ""){
      triggers.push({
        device_id: device_id,
        type_id: type_id,
        data: value,
        parent: 0,
        trigger_id: unique,
        name: name
      });
    }else{
      triggers.push({
        device_id: device_id,
        type_id: type_id,
        data: value,
        parent: 0,
        trigger_id: unique
      });
    }
  }else if(type === "actions"){
    unique = getUniqueId();
    actions.push({
      device_id: device_id,
      type_id: type_id,
      data: value,
      parent: 0,
      action_id: unique
    });
  }else{
    console.log("Unknown type when adding the TA (Type: "+type+")");
  }
  return unique;
}

function addAndBuildTA(device_id, type_id, type, value){
  addTA(device_id, type_id, type, value);
  renderTAList(type);
}

function goToNewConfig(){
  var id = 'new';
  config = JSON.parse(JSON.stringify(newConfig));
  actions = [];
  triggers = [];
}

function getConfig(id, callback){
    var data = { function:"getconfig", id:id };
    return load("backend.php", callback, data);
}

function getTemplate(template_index, callback){
    var data = { function:"gettemplate", index:template_index };
    return load("backend.php", callback, data);
}

function getConfigs(callback){
  var data = { function:"getconfiglist" };
  return load("backend.php", callback, data);
}

function getTemplates(callback){
    var data = { function:"gettemplatelist" };
    return load("backend.php", callback, data);
}

function saveConfig(callback){
  var config_id = config['id'];
  var data = { function:"saveconfig", id:config_id, config:JSON.stringify(config) };
  return load("backend.php", callback, data);
}

function saveTemplate(callback){
  // var config_id = config['id'];
  var config_id = 'new'; /* ALWAYS save templates as new template.*/
  var data = { function:"savetemplate", id:config_id, template:JSON.stringify(config) };
  return load("backend.php", callback, data);
}

function deleteConfig(callback){
  var config_id = config['id'];
  if(config_id === "new"){
    return false;
  }
  var data = { function:"deleteconfig", id:config_id };
  return load("backend.php", callback, data);
}

function deleteTemplate(template_id, callback){
  if(template_id === "new"){
    return false;
  }
  var data = { function:"deletetemplate", id:template_id };
  return load("backend.php", callback, data);
}

function getDevices(callback, data = {}){
  load("devices.php", callback, data);
}

function getAndUpdateDevices(){
  getDevices(function(data){
    devices = data;
  });
}

// Gets a file with filename filename and a callback function when the file is successfully retrieved.
function load(filename, callback, data = {}){
  return $.ajax({
      method: "GET",
      url: filename,
      data: data,
      success: callback
    });
}

// Loads a html-file with filename filename into #main_config div
function loadMainConfig(filename, data = {}){
  return load(filename, function(data){
    $('#main_config').html(data);
  }, data);
}

// Updates the configs menu with new items (items);
function updateConfigsMenu(items = false){
  if(items === false){
    items = [];
  }
  $('.configMenuItem').remove();
  items.forEach(function(element,index){
    var listItem = '<li data-id="'+element['id']+'"><a href="#" data-toggle="tab">'+element['name']+'</a></li>';
    $(listItem).addClass('configMenuItem').insertBefore('.insertBeforeMe')
  });
}

function markCurrentConfigActiveInMenu(id = false){
  var config_id = config.id;
  if(id !== false){
    config_id = id;
  }
  $('#menu-configs li').removeClass('active');
  $('#menu-configs li[data-id="'+config_id+'"]').addClass('active');
}

function saveThisConfig(){
  var thisConfigId = config['id'];
  saveConfig(function(data){
    if(data.status === true){
      config = data.savedConfig;
      if(data.id === thisConfigId){
        // This is an existing id
        $.notify("Config update was saved successfully",{position:"top center", className:"success"});
      }else{
        // This id is new. Update the menu and mark active.
        getConfigs(function(data){
          var response = data;
          updateConfigsMenu(response);
          renderConfig();
          markCurrentConfigActiveInMenu();
        });
        $.notify("New config was successfully saved",{position:"top center", className:"success"});
      }
    }else{
      alert("Failed to save your config, reason unknown.");
    }
  });
}

function triggerGroupingGenerator(array = false){
  var html = "";
  var triggerArray = [];
  $.each(triggers, function(){
    var device_name = devices[this.device_id]['name'];
    var trigger_name = devices[this.device_id]['triggers'][this.type_id]['name'];
    var trigger_data = this.data;
    var printData = "";
    if(this.data !== false){
      printData = ' - '+trigger_data;
    }
    var name = device_name + ' - ' + trigger_name + printData;
    if((this.type_id === 'and' || this.type_id === 'or') && this.name !== undefined){
      name = this.name;
    }
    if(this.parent === 0){
      triggerArray.push({group_trigger_id:this.trigger_id, group_name:name});
      html += ''
      + '<div class="checkbox select-triggers">'
      +  '<label><input type="checkbox" value="" data-id="'+this.trigger_id+'">'+name+'</label> <span class="glyphicon glyphicon-trash mini-icon trash" data-id="'+this.trigger_id+'">'
      + '</div>';
    }
  });
  returnValue = html;
  if(array === true){
    returnValue = triggerArray;
  }
  return returnValue;
}

// Triggers the right functions matching to the loaded page.
function pageFunctions(pageName){
  switch(pageName){
    case "overview":
      $('#config-overview tbody').html(buildRulesHtml());
      $('#config-name p').text(config.name);
    break;

    case "scenario":
      // Get all templates and laod them into the dropdown menu
      getTemplates(function(templates){
        $.each(templates, function(index){
          var listElement = '<li data-template-index="'+index+'"><a href="#">'+this.name+'</a></li>';
          $('ul.dropdown-menu').append(listElement);
        });
      });

    break;

    case "trigger":
      var lvl = $('.local-config-navigation a.active').data('lvl');
      var html = '';
      if(lvl > 0){
        html += triggerGroupingGenerator();
        if(html === ""){
          html = '<p>Please select at least one trigger from the previous step.</p>'
        }
        $('.available-lvl .trigger-checkboxes-placeholder').html(html);
      }
      renderTAList("triggers");
    break;

    case "action":
      renderTAList("actions");
    break;

    case "relation":
      var groupTriggers = triggerGroupingGenerator(true);
      $.each(groupTriggers, function(){
        var listElement = '<li data-id="'+this.group_trigger_id+'"><a href="#">'+this.group_name+'</a></li>';
        $('ul.dropdown-menu').append(listElement);
      });
      $.each(actions, function(){
        var device_name = devices[this.device_id]['name'];
        var action_name = devices[this.device_id]['actions'][this.type_id]['name'];
        var extra_action_data = "";
        if(this.data.length>0){
          extra_action_data = ' ('+this.data+')';
        }
        var name = device_name + ' - ' + action_name + extra_action_data;
        var element = ''
        + '<div class="checkbox select-actions">'
        +  '<label><input type="checkbox" value="" data-id="'+this.action_id+'">'+name+'</label>'
        + '</div>';
        $('div.chosen-actions').append(element);
      });
      console.log("Hejhej");
      $('#config-overview-relation tbody').html(buildRulesHtml());
    break;

    default:
      console.log(pageName+" isn't a valid page.");
    break;
  }
}

function updateCheckboxes(type){

  var showDevices = [];
  var showTriggers = [];

  $('.available-'+type+'s input:checked').each(function(){
    var devices = $(this).parent().parent().data('devices');
    $.merge(showDevices, devices);
  });

  $('.available-devices input:checked').each(function(){
    var triggers = $(this).parent().parent().data(type+'s');
    $.merge(showTriggers, triggers);
  });

  if($('.available-'+type+'s input:checked').length > 0){
    $('.available-devices input:not(:checked)').each(function(){
      $(this).parent().parent().hide();
    });
  }else{
    $('.available-devices div').show();
  }

  if($('.available-devices input:checked').length > 0){
      $('.available-'+type+'s input:not(:checked)').each(function(){
      $(this).parent().parent().hide();
    });
  }else{
    $('.available-'+type+'s div').show();
  }

  $('.available-'+type+'s input').each(function(){
    var trigger_name = $(this).parent().parent().data('name');
    var devices = $(this).parent().parent().data('devices');
    if($.inArray(trigger_name, showTriggers) !== -1){
      $(this).parent().parent().show();
      devices.forEach(function(){
        $('.available-devices div.checkbox[data-name="'+this+'"]').show();
      });
    }
  });

  $('.available-devices input').each(function(){
    var device_name = $(this).parent().parent().data('name');
    var triggers = $(this).parent().parent().data(type+'s');
    if($.inArray(device_name, showDevices) !== -1){
      $(this).parent().parent().show();
      triggers.forEach(function(){
        $('.available-'+type+'s div.checkbox[data-name="'+this+'"]').show();
      });
    }
  });
}

// Unchecks all checkboxes when button is pressed.
function uncheckAllCheckedCheckboxes(parentSelector = ""){
  $(parentSelector+' input:checkbox:checked').click();
}

function isParent(id){
  var test = false;
  $.each(triggers, function(){
    if(this.parent === id){
      test = true;
    }
  });
  return test;
}

function buildHierarchy(arry) {

    var roots = [], children = {};

    // find the top level nodes and hash the children based on parent
    for (var i = 0, len = arry.length; i < len; ++i) {
        var item = arry[i],
            p = item.parent,
            target = !p ? roots : (children[p] || (children[p] = []));

        target.push({ value: item });
    }

    // function to recursively build the tree
    var findChildren = function(parent) {
        if (children[parent.value['trigger_id']]) {
            parent.children = children[parent.value['trigger_id']];
            for (var i = 0, len = parent.children.length; i < len; ++i) {
                findChildren(parent.children[i]);
            }
        }
    };

    // enumerate through to handle the case where there are multiple roots
    for (var i = 0, len = roots.length; i < len; ++i) {
        findChildren(roots[i]);
    }

    return roots;
}

function getTriggersHtml(triggers_array){
  var html = '';
  var uniuqe_temp_id = 0;
  triggers_array.forEach(function(element, index){
    var andOr = element.value.device_id === 'and' || element.value.device_id === 'or';
    var device_id = element.value.device_id;
    var trigger_id = element.value.trigger_id;
    var type_id = element.value.type_id;
    var data = element.value.data;
    var device_name = devices[device_id]['triggers'][type_id].name;

    if("children" in element && (andOr)){
      var name = element.value.name;
      var parentHtml = '<div class="ta-box-wrapper and-or"><span class="headline">'+device_name+' - '+name+'</span><br></div>';
      var temp_id = uniuqe_temp_id++;
      var test = $(parentHtml)
      .append(getTriggersHtml(element.children))
      .get(0);
      html += test.outerHTML;
    }else{
      if(andOr){
        html += "";
      }else{
        html += buildTABox(device_id, type_id, "triggers", data, trigger_id);
      }
    }
  });
  return html;
}

function buildTABox(device_id, type_id, type, data, id){
  var hideDataRowClass = "";
  var html = "";
  if(data === false){
    hideDataRowClass = "hidden";
  }
  // console.log(type);
  // if((device_id === 'and' || device_id === 'or') && index > -1){
  //   var html = '<div class="ta-box-wrapper and-or">';
  //   var my_id = triggers[index].trigger_id;
  //   var array = getTriggerParentsChildren(my_id);
  //   $.each(array, function(){
  //     var useIndex = getTriggerIndexById(this.trigger_id);
  //     html += buildTABox(this.device_id, this.type_id, "triggers", this.data, useIndex, my_id);
  //   });
  //   html += '</div>';
  // }else{
  //   if(type === "triggers" && index > -1){
  //     console.log(triggers[index].parent );
  //     console.log(parent);
  //     if(triggers[index].parent !== 0 && parent === 0){
  //       return html;
  //     }
  //   }

    html = ''
    + '<div class="ta-box-wrapper">'
      + '<table class="ta-box">'
        + '<tr>'
          + '<th class="device-icon-th">'+devices[device_id]['icon']+'</th>'
          + '<th class="device-name">'+devices[device_id]['name']+'</th>'
          + '<th class="device-trash"><span class="glyphicon glyphicon-trash mini-icon trash" data-id="'+id+'"></span></th>'
        + '</tr>'
        + '<tr>'
          + '<td class="type-icon-td">'+devices[device_id][type][type_id]['icon']+'</td>'
          + '<td class="type-name" colspan="2">'+devices[device_id][type][type_id]['name']+'</td>'
        + '</tr>'
        + '<tr class="'+hideDataRowClass+'">'
          + '<td></td><td colspan="2">'+data+'</td>'
        + '</tr>'
      + '</table>'
    + '</div>';
  // }
  return html;
}

function addAndBuildCheckboxes(singularType){
  var type = singularType+"s";

  function getSomeData(){
    var arraySomeData = [];
    $('.available-devices input:checked').each(function(device_index){
      var device_name = $(this).parent().parent().data('name');
      var device_id = $(this).parent().parent().data('id');
      $('.available-'+type+' input:checked').each(function(type_index){
        var type_parent_devices = $(this).parent().parent().data('devices');
        var type_id = $(this).parent().parent().data('id');
        if($.inArray(device_name ,type_parent_devices) === -1){
          // If the parent doesn't match the device , skip this iteration
          return true;
        }else{
          var popup = true;
          var popup_html = "";
          var popup_element = {};
          var title = "";
          var msg = "";

          // (Specific for this demo/prototype implementation)
          switch(type_id){
            case "microphone":
              title = device_name + " - Microphone properties";
              msg = "Please choose how to use this property.";
              popup_html = ''
              + '<div id="popup-dialog" title="'+title+'">'
              + '  <p>'+msg+'</p>'
                + '<div class="radio">'
                + '  <label><input type="radio" name="micRadio'+device_id+'" value="Activation" checked>Activation</label>'
                + '</div>'
                + '<div class="radio">'
                + '  <label><input type="radio" name="micRadio'+device_id+'" value="Inactivation">Inactivation</label>'
                + '</div>'
                + '<div class="radio">'
                + '  <label><input type="radio" name="micRadio'+device_id+'" value="Activation & Inactivation">Activation & Inactivation</label>'
                + '</div>'
                + '<div class="add-type hidden" data-device-id="'+device_id+'" data-type-id="'+type_id+'" data-type="'+type+'">'
                + '</div>'
              + '</div>';
            break;
            case "light":
            title = device_name + " - Light properties";
            msg = "Please choose how to use this property.";
            popup_html = ''
            + '<div id="popup-dialog" title="'+title+'">'
            + '  <p>'+msg+'</p>'
              + '<div class="radio">'
              + '  <label><input type="radio" name="lightRadio'+device_id+'" value="On" checked>On</label>'
              + '</div>'
              + '<div class="radio">'
              + '  <label><input type="radio" name="lightRadio'+device_id+'" value="Off">Off</label>'
              + '</div>'
              + '<div class="radio">'
              + '  <label><input type="radio" name="lightRadio'+device_id+'" value="Flash every 1 second">Flash every 1 second</label>'
              + '</div>'
              + '<div class="add-type hidden" data-device-id="'+device_id+'" data-type-id="'+type_id+'" data-type="'+type+'">'
              + '</div>'
            + '</div>';
            break;
            case "timer":
              title = device_name + " - Timer properties";
              msg = "Select the correct time unit and type in the number of units to use in the number box below.";
              popup_html = ''
              + '<div id="popup-dialog" title="'+title+'">'
              + '  <p>'+msg+'</p>'
                + '<div class="radio">'
                + '  <label><input type="radio" name="timerRadio'+device_id+'" value="h" checked>Hours</label>'
                + '</div>'
                + '<div class="radio">'
                + '  <label><input type="radio" name="timerRadio'+device_id+'" value="min">Minutes</label>'
                + '</div>'
                + '<div class="radio">'
                + '  <label><input type="radio" name="timerRadio'+device_id+'" value="sec">Seconds</label>'
                + '</div>'
                + '<div class="form-group">'
                  + '<input type="number" class="form-control" value="0">'
                + '</div>'
                + '<div class="add-type hidden" data-device-id="'+device_id+'" data-type-id="'+type_id+'" data-type="'+type+'">'
                + '</div>'
              + '</div>';
            break;
            case "email":
              title = device_name + " - Email properties";
              msg = "Input one or multiple email addresses in the textbox below.";
              popup_html = ''
              + '<div id="popup-dialog" title="'+title+'">'
              + '  <p>'+msg+'</p>'
                + '<textarea style="width:100%;">'
                + '</textarea>'
                + '<div class="add-type hidden" data-device-id="'+device_id+'" data-type-id="'+type_id+'" data-type="'+type+'">'
                + '</div>'
              + '</div>';
            break;
            case "http":
            title = device_name + " - HTTP properties";
            msg = "Input one or multiple url addresses in the textbox below.";
            popup_html = ''
            + '<div id="popup-dialog" title="'+title+'">'
            + '  <p>'+msg+'</p>'
              + '<textarea style="width:100%;">'
              + '</textarea>'
              + '<div class="add-type hidden" data-device-id="'+device_id+'" data-type-id="'+type_id+'" data-type="'+type+'">'
              + '</div>'
            + '</div>';
            break;
            default:
              popup = false;
            break;
          }

          // $( confirm_element ).dialog(nice);
          arraySomeData.push({
            "device_id":device_id,
            "type_id":type_id,
            "type":type,
            "data":false,
            "popup":popup,
            "popup_html":popup_html
          });

          // Hantera data attributet (false)
          // Lägg in dem i triggers/actions/config? arrayerna på korrekt sätt.
          // TODO

        }
      });
    });
    return arraySomeData;
  }
  // Popup buttons and functionality
  custom_buttons = {};
  custom_buttons["Add as "+singularType] = function(){
    var device_id = $(this).find('div.add-type').data('device-id');
    var type_id = $(this).find('div.add-type').data('type-id');
    var type = $(this).find('div.add-type').data('type');
    var value = "";

    if($(this).find('input[type="text"]').length > 0){
      if(value.length > 0){
        value += " ";
      }
      value += $(this).find('input[type="text"]').val();
    }
    if($(this).find('textarea').length > 0){
      if(value.length > 0){
        value += " ";
      }
      value += $(this).find('textarea').val().split("\n").join("<br/>");
    }
    if($(this).find('input[type="number"]').length > 0){
      if(value.length > 0){
        value += " ";
      }
      value += $(this).find('input[type="number"]').val();
    }
    if($(this).find('input:radio:checked').length > 0){
      if(value.length > 0){
        value += " ";
      }
      value += $(this).find('input:radio:checked').val();
    }
    addAndBuildTA(device_id, type_id, type, value);
    $(this).dialog('destroy');
  };
  custom_buttons["Cancel"] = function(){
    $(this).dialog('destroy');
  };

  var someData = getSomeData();

  $.each(someData, function(){
    var device_id = this.device_id;
    var type_id = this.type_id;

    if(this.popup === true){
      popup_element = {
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: custom_buttons
      };
      $(this.popup_html).dialog(popup_element);
    }else{
      addAndBuildTA(device_id, type_id, type, false);
      // var html = buildTABox(device_id, type_id, type, false);
      // $('#config-box').html($('#config-box').html() + html);

    }

  });
}

function getNextUnnamedGroupId(){
  var last = 0;
  $.each(triggers, function(){
    if(this.device_id === 'and' || this.device_id === 'or'){
      var name = "unnamed group #";
      var nameIndex = this.name.toLowerCase().indexOf(name);
      if(nameIndex !== -1){
        var t_n_length = this.name.length;
        var number_length = t_n_length - name.length;

        var start = nameIndex+name.length;
        var end = nameIndex+name.length+2;
        var newValue = this.name.substring(start, end);
        console.log(newValue);
        if(newValue !== "" && !isNaN(newValue)){
          last = Number(newValue);
        }
      }
    }
  });
  return last+1;
}

function getAllTriggersIncludingChildren(trigger_id){
  var ruleTriggers = [];
  if(isParent(trigger_id)){
    var parent_id = trigger_id;
    var children = getTriggerParentsChildren(parent_id);
    $.each(children, function(){
      $.merge(ruleTriggers, getAllTriggersIncludingChildren(this.trigger_id));
    });
  }
  ruleTriggers.push(triggers[getTriggerIndexById(trigger_id)]);
  return ruleTriggers;
}

function getAllActionsFromIds(action_ids = []){
  var ruleActions = [];
  $.each(action_ids, function(index, value){
    console.log(value);
    ruleActions.push(actions[getActionIndexById(value)]);
  });
  return ruleActions;
}

function addNewRule(trigger_id, action_ids, schedule, name){
  // Get all triggers for this trigger_ids parent and form it as standard form
  // Get all actions listed in action_ids and form it as standard form for actions,
  var addActions = getAllActionsFromIds(action_ids);
  var addTriggers = getAllTriggersIncludingChildren(trigger_id);
  var rule = {
    "actions":addActions,
    "active-actions":true,
    "active-triggers":true,
    "preset-name":"",
    "rule-name": name,
    "schedule":schedule,
    "triggers":addTriggers
  }
  config.rules.push(rule);
  $.each(addTriggers, function(){
    triggers.splice(getTriggerIndexById(this.trigger_id), 1)
  });
  $.each(addActions, function(){
    actions.splice(getActionIndexById(this.action_id), 1)
  });
}

function buildRulesHtml(){
  var html = '';
  $.each(config.rules, function(){
    var triggersHtml = renderTAList("triggers", this.triggers);
    var actionsHtml = renderTAList("actions", this.actions);
    var schedule = this.schedule;
    html += ''
      + '<tr>'
      +  '<td class="select_include_trigger hidden"><div class="checkbox"><input type="checkbox"></div></td>'
      +  '<td class="name"><p class="rule-name"></p>'+this['rule-name']+'</td>'
      +  '<td class="trigger">'+triggersHtml+'</td>'
      +  '<td class="schedule"><p class="schedule">'+schedule+'</p></td>'
      +  '<td class="action">'+actionsHtml+'</td>'
      + '</tr>';
  });
  return html;
}

function addAndBuildRule(trigger_id, action_ids, schedule, name){
  addNewRule(trigger_id, action_ids, schedule, name);
  $('.local-config-navigation a.active').click();

  console.log("Trigger: "+trigger_id);
  console.log("Actions: "+action_ids);
  console.log(action_ids);
  console.log("Schedule:"+schedule);

}

//loadMainConfig("scenario.php").then();


/* ------------------------------------------------------------------ */
/* ---------------------- Clicker functionality --------------------- */
/* ------------------------------------------------------------------ */

// Handles the click event for the config selection in the top navigation bar.
$(document).on('click','#menu-configs li',function(){
  // Make the clicked item the active one.
  $('#menu-configs li.active').removeClass('active');
  $(this).addClass('active');

});

// Handles the click event on config navigation menu to the left.
$(document).on('click', '.local-config-navigation .list-group-root a', function(){
  var page = $(this).data('page');
  var filename = page+".php";
  var thisObject = $(this);
  var data = {};
  lastPage = page;
  if(page === "trigger"){
    var lvl = $(this).data('lvl');
    if(lvl > 0){
      data = {trigger_lvl: lvl}
    }
    lastPageData = lvl;
  }
  $('.local-config-navigation .list-group-root a').removeClass('active');
  if(page !== undefined){
    loadMainConfig(filename, data).then(
      function(){
        thisObject.addClass('active');
        pageFunctions(page);
        $('#main_config').attr('data-page',page);
      },
      function(){
        console.log("Error loading file ("+filename+")");
      });
  }
});

$(document).on('click','#main_config[data-page="scenario"] .dropdown-menu li',function(){
  // Make the clicked item the active one.1
  $('#main_config[data-page="scenario"] .dropdown-menu li.active').removeClass('active');
  $(this).addClass('active');
  // Change the title of the dropdown button to the clicked item.
  $('button.dropdown-toggle .dropdown-title').text($(this).find('a').text());
  var template_index = $(this).data('template-index');
  if(oldConfig === false){
    oldConfig = JSON.parse(JSON.stringify(config));
  }
  if(template_index !== 'new'){
    getTemplate(template_index, function(data){
      var response = data;
      config = response;
      triggers = [];
      actions = [];
      $.each(config.rules, function(){
        $.merge(triggers, this.triggers);
        $.merge(actions, this.actions);
      });
      $('#config-overview-scenario tbody').html(buildRulesHtml());
    });
  }else{
    goToNewConfig();
    $('#config-overview-scenario tbody').html(buildRulesHtml());
  }
});

$(document).on('click', '#main_config[data-page="scenario"] button.reloadConfig', function () {
  config = JSON.parse(JSON.stringify(oldConfig));
  oldConfig = false;
});

$(document).on('change', '#main_config[data-page="trigger"] input:checkbox', function () {
  updateCheckboxes("trigger");
});

$(document).on('click', '#main_config[data-page="trigger"] button.uncheck-all-btn', function () {
  // Unchecks all checkboxes when button is pressed.
  uncheckAllCheckedCheckboxes('#main_config[data-page="trigger"]');
});

$(document).on('click', '#main_config[data-page="trigger"] span.trash', function () {
  // Unchecks all checkboxes when button is pressed.
  var id = $(this).data('id');
  var myTriggerParent = triggers[getTriggerIndexById(id)].parent;
  $.each(triggers, function(){
    if(this.parent === id){
      this.parent = myTriggerParent;
    }
  })
  triggers.splice(getTriggerIndexById(id),1);
  // renderTAList();
  pageFunctions('trigger');
});

$(document).on('click', '#main_config[data-page="action"] span.trash', function () {
  // Unchecks all checkboxes when button is pressed.
  var id = $(this).data('id');
  actions.splice(getActionIndexById(id),1);
  // renderTAList();
  pageFunctions('action');
});

$(document).on('click', '#main_config[data-page="trigger"] button.btn-add', function () {
  // Handles the called event
  var lvl = $('.local-config-navigation a.active').data('lvl');
  if(lvl <= 0){
    addAndBuildCheckboxes('trigger');
  }else{
    var name = $('.center-btns input[type=text]').val();
    console.log(name);
    if(name === ""){
      name = "Unnamed group #"+getNextUnnamedGroupId();
    }
    var checked = $('.trigger-group input[type=radio]:checked').val();
    var id = addTA(checked,checked,'triggers',false, name);
    $('.available-lvl .trigger-checkboxes-placeholder input:checkbox:checked').each(function(){
      var index = getTriggerIndexById($(this).data('id'));
      triggers[index].parent = id;
    });
    pageFunctions('trigger');
    $('#main_config[data-page="trigger"] .uncheck-all-btn').click();
    $('.center-btns input[type="text"]').val("");
    renderTAList("triggers");
  }
});

$(document).on('change', '#main_config[data-page="action"] input:checkbox', function () {
  updateCheckboxes("action");
});

$(document).on('click', '#main_config[data-page="action"] button.btn-add', function () {
  // Handles the called event
  addAndBuildCheckboxes('action');
});

$(document).on('click', '#main_config[data-page="action"] button.uncheck-all-btn', function () {
  // Unchecks all checkboxes when button is pressed.
  uncheckAllCheckedCheckboxes('#main_config[data-page="action"]');
});

$(document).on('click','#main_config[data-page="relation"] .dropdown-menu li',function(){
  // Make the clicked item the active one.
  $('#main_config[data-page="relation"] .dropdown-menu li.active').removeClass('active');
  $(this).addClass('active');
  // Change the title of the dropdown button to the clicked item.
  $('button.dropdown-toggle .dropdown-title').text($(this).find('a').text());
});

$(document).on('click', '#main_config[data-page="relation"] button.btn-add', function () {
  var trigger_id = $('ul.dropdown-menu li.active').data('id');
  var this_actions = $('.chosen-actions .select-actions input:checked');
  var rule_name = $('.center-btns .relation-group input[type="text"]').val();
  if(rule_name === ""){
    rule_name = "New rule";
  }
  var action_ids = [];
  $.each($('.chosen-actions .select-actions input:checked'), function(){
    action_ids.push($(this).data('id'));
  });
  console.log(action_ids);
  if(trigger_id !== undefined && action_ids.length > 0){
    if(trigger_id !== "dummy"){

      title = "Schedule Manager";
      msg = "Please choose a schedule type on the buttons below.";
      popup_html = ''
      + '<div id="popup-dialog" title="'+title+'">'
      + '  <p>'+msg+'</p>'
      + '</div>';
      popup_element = {
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
          "Always":function(){
            addAndBuildRule(trigger_id, action_ids, "Always", rule_name);
            $('.center-btns .relation-group input[type="text"]').val("");
            $(this).dialog('destroy');
          },
          "Specific":function(){
            addAndBuildRule(trigger_id, action_ids, "Specific", rule_name);
            $('.center-btns .relation-group input[type="text"]').val("");
            $(this).dialog('destroy');
          },
          "Abort this!":function(){
            $(this).dialog('destroy');
          }
        }
      };
      $(popup_html).dialog(popup_element);
    }
  }else{
    alert("You need to select at least one trigger and one action.")
  }
});

$(document).on('click',"button.next-step-btn",function(){
  var currentActiveListItem = $('.local-config-navigation .list-group-root a.active:not(".headline")');
  var currentActiveListItemIndex = $('.local-config-navigation .list-group-root a:not(".headline")').index(currentActiveListItem);
  var nextListItemIndex = currentActiveListItemIndex+1;
  var maxItems = $('.local-config-navigation .list-group-root a:not(".headline")').length-1;
  if(maxItems === currentActiveListItemIndex){
    // We are on the last item in the list..
    nextListItemIndex = 0;
    $('.local-config-navigation .list-group-root a:not(".headline")').eq(nextListItemIndex).click();
    saveThisConfig();
  }else{
    $('.local-config-navigation .list-group-root a:not(".headline")').eq(nextListItemIndex).click();
  }
});

// Main menu item clicked
$(document).on('click', '#menu-configs', function(){
  var id = $(event.target).closest('li').data("id");
  if(Number.isInteger(id)){
    getConfig(id, function(data){
      var response = data;
      config = response;
      triggers = [];
      actions = [];
      // $.each(config.rules, function(){
      //   $.merge(triggers, this.triggers);
      //   $.merge(actions, this.actions);
      // });
      renderConfig();
      getConfigs(function(data){
        var response = data;
        updateConfigsMenu(response);
        markCurrentConfigActiveInMenu();
        var add = "";
        if(lastPage === "trigger"){
          add = '[data-lvl="'+lastPageData+'"]';
        }
        $('.local-config-navigation .list-group-root a[data-page="'+lastPage+'"]'+add).click();
      });
    });
  }else if(id === 'new'){
    goToNewConfig();
    $('.local-config-navigation .list-group-root a[data-page="overview"]').click();
  }
});

// Rename the config
$(document).on('click', '#config-name p', function(){
  //var currentName = $("#config-name h1").text();
  var currentName = config.name;
  var name = prompt("Please enter a name", currentName);
  if(name != null){
    $(this).text(name);
    config.name = name;
    var id = $('.configMenuItem.active').data("id");
    $('#config-name p').text(name);
    $('li.configMenuItem[data-id="'+id+'"] a').text(name);
    // $('li.configMenuItem[data-id="2"] a').text("test");
  }
});

// Save this config
$(document).on('click', '#save-config', function(){
  saveThisConfig();
});

// delete this config
$(document).on('click', '#delete-config', function(){
  deleteConfig();
  // This id is new. Update the menu and mark active.
  getConfigs(function(data){
    var response = data;
    updateConfigsMenu(response);
    renderConfig();
    markCurrentConfigActiveInMenu();
  });
});

// delete template
$(document).on('click', '#delete-template', function(){
  template_index = $('#main_config[data-page="scenario"] .dropdown-menu li.active').data('template-index');
  deleteTemplate(template_index, function(){
    console.log("Template deleted");
    $('.local-config-navigation a.active').click();
  });
});
